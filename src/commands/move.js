const { CommandInteraction } = require("discord.js");
const { default: DisTube } = require("distube");

exports.data = {
  name: "move",
  description: "Move a track to another position in the queue",
  options: [
    {
      name: "track",
      description: "The position of the track to move",
      type: "INTEGER",
      required: true,
    },
    {
      name: "position",
      description: "The position to move the track to",
      type: "INTEGER",
      required: true,
    },
  ],
};

exports.handler = async function (
  interaction = new CommandInteraction(),
  distube = new DisTube()
) {
  const queue = distube.queues.get(interaction.guildId);
  if (!queue || queue.songs.length <= 1) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to move" }],
    });
  }

  const track = interaction.options.get("track")?.value;
  const position = interaction.options.get("position")?.value;
  if (!(track > 0 && track <= queue.songs.length)) {
    return interaction.reply({
      embeds: [{ description: "Error: No such track" }],
    });
  }

  if (!(position > 0 && position <= queue.songs.length)) {
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
