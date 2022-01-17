import { CommandInteraction } from "discord.js";
import { DisTube as Player } from "distube";

export const data = {
  name: "move",
  description: "Move a track to another position in the queue",
  options: [
    {
      name: "track",
      description: "The position of the track to move",
      type: 4,
      required: true,
    },
    {
      name: "position",
      description: "The position to move the track to",
      type: 4,
      required: true,
    },
  ],
};

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new Player()
) {
  const queue = player.queues.get(interaction.guildId);
  if (!queue || queue.songs.length <= 1) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to move" }],
    });
  }

  const track = interaction.options.get("track")?.value;
  const position = interaction.options.get("position")?.value;
  if (!(track !== 0 && track <= queue.songs.length)) {
    return interaction.reply({
      embeds: [{ description: "Error: No such track" }],
    });
  }

  if (!(position !== 0 && position <= queue.songs.length)) {
    return interaction.reply({
      embeds: [{ description: "Error: No such position" }],
    });
  }

  const from = track < 0 ? Math.max(0, queue.songs.length + track) : track - 1;
  const to =
    position < 0 ? Math.max(0, queue.songs.length + position) : position - 1;
  const [song] = queue.songs;
  queue.songs.splice(to, 0, queue.songs.splice(from, 1)[0]);
  if (from === 0 || to === 0) {
    queue.songs.unshift(song);
    queue.jump(1);
  }

  return interaction.reply({
    embeds: [{ description: `Moved track ${from + 1} to position ${to + 1}` }],
  });
};
