import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  InteractionType,
  SelectMenuBuilder,
  SelectMenuInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { DisTube as Player, RepeatMode } from "distube";

const repeatModes = {
  off: RepeatMode.DISABLED,
  track: RepeatMode.SONG,
  queue: RepeatMode.QUEUE,
} as const;

type RepeatModes = keyof typeof repeatModes;

const repeatChoices: { name: string; value: RepeatModes }[] = [
  { name: "off", value: "off" },
  { name: "queue", value: "queue" },
  { name: "track", value: "track" },
];

export const data = new SlashCommandBuilder()
  .setName("repeat")
  .setDescription("Repeat the queue or current track")
  .addStringOption((option) =>
    option
      .setName("repeat")
      .setDescription("The repeat mode")
      .addChoices(...repeatChoices)
  );

export const handler = async function (
  interaction: ChatInputCommandInteraction | SelectMenuInteraction,
  player: Player
) {
  const queue = player.queues.get(interaction);
  if (!queue) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Error: Nothing is playing")
          .setColor(Colors.Red),
      ],
    });
  }

  const repeatMode =
    interaction.type === InteractionType.ApplicationCommand
      ? interaction.options.getString("repeat")
      : interaction.values[0];
  if (repeatMode) {
    queue.setRepeatMode(repeatModes[repeatMode as RepeatModes]);
  }

  const components = [
    new ActionRowBuilder<SelectMenuBuilder>().addComponents(
      new SelectMenuBuilder().setCustomId("/repeat repeat:").addOptions(
        repeatChoices.map(({ name, value }) => ({
          default: queue.repeatMode === repeatModes[value],
          label: `Repeat: ${name}`,
          value,
        }))
      )
    ),
  ];
  return interaction.type === InteractionType.ApplicationCommand
    ? interaction.reply({ components })
    : interaction.update({ components });
};
