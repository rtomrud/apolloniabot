import { CommandInteraction } from "discord.js";
import { DisTube as Player } from "distube";

export const data = {
  name: "drop",
  description: "Drop a track from the queue",
  options: [
    {
      name: "track",
      description: "The position of the track to drop",
      type: "INTEGER",
      required: true,
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
      embeds: [{ description: "Error: Nothing to drop" }],
    });
  }

  const track = interaction.options.get("track")?.value;
  if (!(track !== 0 && track <= queue.songs.length)) {
    return interaction.reply({
      embeds: [{ description: "Error: No such track" }],
    });
  }

  const start = track < 0 ? Math.max(0, queue.songs.length + track) : track - 1;
  const song = queue.songs[start];
  if (start === 0) {
    if (queue.songs.length <= 1 && !queue.autoplay) {
      queue.stop();
    } else {
      queue.skip();
    }
  } else {
    queue.songs.splice(start, 1);
  }

  return interaction.reply({
    embeds: [
      {
        description: `Dropped track ${start + 1}: [${song.name}](${song.url})`,
      },
    ],
  });
};
