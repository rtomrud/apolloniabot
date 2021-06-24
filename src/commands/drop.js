const { Interaction } = require("discord.js");
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
  interaction = new Interaction(),
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
      embeds: [
        { title: "Error", description: "Nothing to drop at that position" },
      ],
    });
  }

  if (track === 1 && queue.playing) {
    return interaction.reply({
      embeds: [
        {
          title: "Error",
          description: "I can't drop track 1 because it's playing now",
        },
      ],
    });
  }

  const start = track < 0 ? Math.max(0, length + track) : track - 1;
  const [song] = queue.songs.splice(start, 1);
  return interaction.reply({
    embeds: [
      {
        title: "Dropped",
        fields: [{ name: String(start + 1), value: formatSong(song) }],
      },
    ],
  });
};
