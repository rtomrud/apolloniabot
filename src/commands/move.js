const { Interaction } = require("discord.js");
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
  interaction = new Interaction(),
  distube = new DisTube()
) {
  const queue = distube.queues.get(interaction.guildID);
  const { length } = queue.songs;
  if (!queue) {
    return interaction.reply({
      embeds: [{ title: "Error", description: "Nothing to move" }],
    });
  }

  const track = interaction.options.get("track").value;
  const position = interaction.options.get("position").value;
  if (track === 0 || track > length) {
    return interaction.reply({
      embeds: [{ title: "Error", description: "No track at that position" }],
    });
  }

  if (position === 0 || position > length) {
    return interaction.reply({
      embeds: [{ title: "Error", description: "No such position" }],
    });
  }

  if (track === 1 || position === 1) {
    return interaction.reply({
      embeds: [
        {
          title: "Error",
          description: "I can't move track 1 because it's currently playing",
        },
      ],
    });
  }

  const from = track < 0 ? Math.max(0, length + track) : track - 1;
  const to = position < 0 ? Math.max(0, length + position) : position - 1;
  queue.songs.splice(to, 0, queue.songs.splice(from, 1)[0]);
  return interaction.reply({
    embeds: [
      {
        title: "Moved",
        description: `track ${from + 1} to position ${to + 1}`,
      },
    ],
  });
};
