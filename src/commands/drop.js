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
  const queue = distube.queues.get(interaction.guildID);
  if (!queue) {
    return interaction.reply({
      embeds: [{ title: "Error", description: "Nothing to drop" }],
    });
  }

  const { length } = queue.songs;
  const track = interaction.options.get("track").value;
  if (track === 0 || track > length) {
    return interaction.reply({
      embeds: [{ title: "Error", description: "No such track" }],
    });
  }

  const start = track < 0 ? Math.max(0, length + track) : track - 1;
  let song;
  if (start === 0) {
    [song] = queue.songs;
    if (length <= 1 && !queue.autoplay) {
      queue.stop();
    } else {
      queue.skip();
    }
  } else {
    [song] = queue.songs.splice(start, 1);
  }

  return interaction.reply({
    embeds: [
      {
        title: "Dropped",
        fields: [{ name: String(start + 1), value: formatSong(song) }],
      },
    ],
  });
};
