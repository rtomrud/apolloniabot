const { CommandInteraction } = require("discord.js");
const { default: DisTube } = require("distube");
const formatSong = require("../format-song.js");

exports.data = {
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

exports.handler = async function (
  interaction = new CommandInteraction(),
  distube = new DisTube()
) {
  const queue = distube.queues.get(interaction.guildId);
  if (!queue) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to drop" }],
    });
  }

  const track = interaction.options.get("track").value;
  if (track === 0 || track > queue.songs.length) {
    return interaction.reply({
      embeds: [{ description: "Error: No such track" }],
    });
  }

  const start = track < 0 ? Math.max(0, queue.songs.length + track) : track - 1;
  let song;
  if (start === 0) {
    [song] = queue.songs;
    if (queue.songs.length <= 1 && !queue.autoplay) {
      queue.stop();
    } else {
      queue.skip();
    }
  } else {
    [song] = queue.songs.splice(start, 1);
  }

  return interaction.reply({
    embeds: [
      { description: `Dropped track ${start + 1}: ${formatSong(song)}` },
    ],
  });
};
