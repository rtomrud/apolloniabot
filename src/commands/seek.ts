import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  InteractionContextType,
  InteractionType,
  SlashCommandBuilder,
  hyperlink,
} from "discord.js";
import player from "../player.js";

const defaultTime = 15;

export const data = new SlashCommandBuilder()
  .setName("seek")
  .setDescription("Seek the current track to the specified time")
  .setContexts(InteractionContextType.Guild)
  .addSubcommand((subcommand) =>
    subcommand
      .setName("backward")
      .setDescription("Seek backward by the specified time")
      .addStringOption((option) =>
        option
          .setName("time")
          .setDescription(
            `The time to seek backward by, in seconds or in HH:MM:SS format (${defaultTime}s by default)`,
          ),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("forward")
      .setDescription("Seek forward by the specified time")
      .addStringOption((option) =>
        option
          .setName("time")
          .setDescription(
            `The time to seek forward by, in seconds or in HH:MM:SS format (${defaultTime}s by default)`,
          ),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("to")
      .setDescription("Seek the specified time")
      .addStringOption((option) =>
        option
          .setName("time")
          .setDescription("The time to seek, in seconds or in HH:MM:SS format")
          .setRequired(true),
      ),
  );

export const execute = async function (
  interaction: ChatInputCommandInteraction | ButtonInteraction,
) {
  const queue = player.queues.get(interaction.guildId as string);
  if (!queue || !queue.playing) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Nothing to seek on")
          .setColor(Colors.Red),
      ],
    });
  }

  const time =
    interaction.type === InteractionType.ApplicationCommand
      ? interaction.options.getString("time") || String(defaultTime)
      : interaction.customId.match(/seek .*time:(-?\d+)/)?.[1] ||
        String(defaultTime);
  const seconds = time
    .split(":")
    .reduce(
      (seconds, component, i, { length }) =>
        seconds + Number(component) * 60 ** (length - i - 1),
      0,
    );
  const subcommand =
    interaction.type === InteractionType.ApplicationCommand
      ? interaction.options.getSubcommand(true)
      : interaction.customId.match(/seek (backward|forward|to)/)?.[1];
  const newTime =
    subcommand === "backward"
      ? queue.currentTime - seconds
      : subcommand === "forward"
        ? queue.currentTime + seconds
        : seconds;
  queue.seek(Math.max(0, Math.min(newTime, queue.songs[0].duration)));
  const embeds = [
    new EmbedBuilder().setDescription(
      `Seeked to ${queue.formattedCurrentTime} in ${hyperlink(
        queue.songs[0].name || queue.songs[0].url || "",
        queue.songs[0].url || "",
      )}`,
    ),
  ];
  const components = [
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("/seek to time:0")
        .setLabel("00:00")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(queue.currentTime === 0),
      new ButtonBuilder()
        .setCustomId(`/seek backward time:${defaultTime}`)
        .setLabel(`-${defaultTime}s`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(queue.currentTime - defaultTime < 0),
      new ButtonBuilder()
        .setCustomId(`/seek forward time:${defaultTime}`)
        .setLabel(`+${defaultTime}s`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(
          queue.currentTime + defaultTime >= queue.songs[0].duration,
        ),
    ),
  ];
  return interaction.type === InteractionType.ApplicationCommand
    ? interaction.reply({ embeds, components })
    : interaction.update({ embeds, components });
};
