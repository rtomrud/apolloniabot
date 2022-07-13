import { SlashCommandBuilder, hyperlink } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { DisTube as Player } from "distube";

export const data = new SlashCommandBuilder()
  .setName("queue")
  .setDescription("Show the queue")
  .addIntegerOption((option) =>
    option
      .setName("page")
      .setDescription("The page of the queue to show (1 by default)")
  );

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new Player()
) {
  const queue = player.queues.get(interaction.guildId);
  if (!queue) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing in queue", color: "RED" }],
    });
  }

  const page = interaction.options.getInteger("page") || 1;
  const pageSize = 10;
  const pageCount = Math.ceil(queue.songs.length / pageSize);
  if (!(page !== 0 && page <= pageCount)) {
    return interaction.reply({
      embeds: [
        { description: "Error: No such page in the queue", color: "RED" },
      ],
    });
  }

  const pageIndex = page < 0 ? Math.max(0, pageCount + page) : page - 1;
  const start = pageIndex * pageSize;
  const end = Math.min((pageIndex + 1) * pageSize, queue.songs.length);
  return interaction.reply({
    embeds: [
      {
        title: "Queue",
        description: `${queue.songs.length} ${
          queue.songs.length === 1 ? "track" : "tracks"
        } • ${queue.formattedDuration}`,
        fields: queue.songs.slice(start, end).map((song, i) => ({
          name: String(i + start + 1),
          value: `${hyperlink(song.name, song.url)} • ${
            song.formattedDuration
          }`,
        })),
        footer: { text: `Page ${pageIndex + 1} of ${pageCount}` },
      },
    ],
  });
};
