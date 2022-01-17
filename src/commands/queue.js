import { CommandInteraction } from "discord.js";
import { DisTube as Player } from "distube";

export const data = {
  name: "queue",
  description: "Show the queue",
  options: [
    {
      name: "page",
      description: "The page of the queue to show (defaults to page 1)",
      type: 4,
    },
  ],
};

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new Player()
) {
  const queue = player.queues.get(interaction.guildId);
  if (!queue) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing in queue" }],
      ephemeral: true,
    });
  }

  const page = (interaction.options.get("page") || { value: 1 }).value;
  const pageSize = 10;
  const pageCount = Math.ceil(queue.songs.length / pageSize);
  if (!(page !== 0 && page <= pageCount)) {
    return interaction.reply({
      embeds: [{ description: "Error: No such page in the queue" }],
      ephemeral: true,
    });
  }

  const pageIndex = page < 0 ? Math.max(0, pageCount + page) : page - 1;
  const start = pageIndex * pageSize;
  const end = Math.min((pageIndex + 1) * pageSize, queue.songs.length);
  return interaction.reply({
    embeds: [
      {
        title: "Queue",
        description: `${queue.songs.length} track${
          queue.songs.length === 1 ? "" : "s"
        } • ${queue.formattedDuration}`,
        fields: queue.songs.slice(start, end).map((song, i) => ({
          name: String(i + start + 1),
          value: `[${song.name}](${song.url}) • ${song.formattedDuration}`,
        })),
        footer: { text: `Page ${pageIndex + 1} of ${pageCount}` },
      },
    ],
    ephemeral: true,
  });
};
