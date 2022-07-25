import {
  Colors,
  CommandInteraction,
  SlashCommandBuilder,
  hyperlink,
} from "discord.js";
import { DisTube as Player } from "distube";

export const data = new SlashCommandBuilder()
  .setName("seek")
  .setDescription("Seek the current track to the specified time")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("backward")
      .setDescription("Seek backward by the specified time")
      .addStringOption((option) =>
        option
          .setName("time")
          .setDescription(
            "The time to seek backward by, in seconds or in HH:MM:SS format (15s by default)"
          )
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("forward")
      .setDescription("Seek forward by the specified time")
      .addStringOption((option) =>
        option
          .setName("time")
          .setDescription(
            "The time to seek forward by, in seconds or in HH:MM:SS format (15s by default)"
          )
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("to")
      .setDescription("Seek the specified time")
      .addStringOption((option) =>
        option
          .setName("time")
          .setDescription("The time to seek, in seconds or in HH:MM:SS format")
          .setRequired(true)
      )
  );

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new Player()
) {
  const queue = player.queues.get(interaction.guildId);
  if (!queue || !queue.playing) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to seek on", color: Colors.Red }],
    });
  }

  const time = interaction.options.getString("time") || "15";
  const seconds = time
    .split(":")
    .reduce(
      (seconds, component, i, { length }) =>
        seconds + Number(component) * 60 ** (length - i - 1),
      0
    );
  const subcommand = interaction.options.getSubcommand();
  const newTime =
    subcommand === "backward"
      ? queue.currentTime - seconds
      : subcommand === "forward"
      ? queue.currentTime + seconds
      : seconds;
  queue.seek(Math.max(0, Math.min(newTime, queue.songs[0].duration)));
  return interaction.reply({
    embeds: [
      {
        description: `Seeked to ${queue.formattedCurrentTime} in ${hyperlink(
          queue.songs[0].name,
          queue.songs[0].url
        )}`,
      },
    ],
  });
};
