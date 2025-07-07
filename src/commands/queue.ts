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

export const data = new SlashCommandBuilder()
  .setName("queue")
  .setDescription("Show the queue")
  .addIntegerOption((option) =>
    option
      .setName("page")
      .setDescription("The page of the queue to show (1 by default)"),
  )
  .setContexts(InteractionContextType.Guild);

export const execute = async function (
  interaction: ChatInputCommandInteraction | ButtonInteraction,
) {
  const queue = player.queues.get(interaction.guildId as string);
  if (!queue) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("No songs in the queue")
          .setColor(Colors.Red),
      ],
    });
  }

  const page =
    interaction.type === InteractionType.ApplicationCommand
      ? interaction.options.getInteger("page") || 1
      : Number(interaction.customId.match(/queue page:(-?\d+)/)?.[1]) || 1;
  const pageSize = 10;
  const pageCount = Math.ceil(queue.songs.length / pageSize);
  if (!(page !== 0 && page <= pageCount)) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("No such page in the queue")
          .setColor(Colors.Red),
      ],
    });
  }

  const pageIndex = page < 0 ? Math.max(0, pageCount + page) : page - 1;
  const start = pageIndex * pageSize;
  const end = Math.min((pageIndex + 1) * pageSize, queue.songs.length);
  const embeds = [
    new EmbedBuilder()
      .setTitle("Queue")
      .setDescription(
        `${queue.songs.length} ${
          queue.songs.length === 1 ? "song" : "songs"
        } • ${queue.formattedDuration}`,
      )
      .addFields(
        queue.songs.slice(start, end).map((song, i) => ({
          name: String(i + start + 1),
          value: `${hyperlink(song.name || song.url || "", song.url || "")} • ${
            song.formattedDuration || "--:--"
          }`,
        })),
      )
      .setFooter({ text: `Page ${pageIndex + 1} of ${pageCount}` }),
  ];
  const components =
    pageCount === 1
      ? []
      : [
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId("/queue")
              .setLabel("<< First")
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(pageIndex === 0),
            new ButtonBuilder()
              .setCustomId(`/queue page:${pageIndex}`)
              .setLabel("< Prev")
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(pageIndex === 0),
            new ButtonBuilder()
              .setCustomId(`/queue page:${pageIndex + 2}`)
              .setLabel("Next >")
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(pageIndex === pageCount - 1),
            new ButtonBuilder()
              .setCustomId(`/queue page:-1`)
              .setLabel("Last >>")
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(pageIndex === pageCount - 1),
          ),
        ];
  return interaction.type === InteractionType.ApplicationCommand
    ? interaction.reply({ embeds, components })
    : interaction.update({ embeds, components });
};
