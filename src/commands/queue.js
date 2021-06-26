const { CommandInteraction } = require("discord.js");
const { default: DisTube } = require("distube");
const formatPlayback = require("../format-playback.js");
const formatSong = require("../format-song.js");

exports.data = {
  name: "queue",
  description: "Show the queue",
  options: [
    {
      name: "page",
      description: "The page of the queue to show (defaults to page 1)",
      type: "INTEGER",
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
      embeds: [{ title: "Error", description: "Nothing in queue" }],
    });
  }

  const page = interaction.options.has("page")
    ? interaction.options.get("page").value
    : 1;
  const { formattedDuration, songs } = queue;
  const { length } = songs;
  const pageSize = 10;
  const pages = Math.ceil(length / pageSize);
  if (page < 1 || page > pages) {
    return interaction.reply({
      embeds: [{ title: "Error", description: "No such page in the queue" }],
    });
  }

  const start = (page - 1) * pageSize;
  const end = Math.min(page * pageSize, length);
  return interaction.reply({
    embeds: [
      {
        title: "Queue",
        description: `${length} track${
          length === 1 ? "" : "s"
        } [${formattedDuration}]`,
        fields: songs.slice(start, end).map((song, i) => ({
          name: String(i + start + 1),
          value: song === songs[0] ? formatPlayback(queue) : formatSong(song),
        })),
        footer: { text: `Page ${page} of ${pages}` },
      },
    ],
  });
};
