const { CommandInteraction } = require("discord.js");
const { default: DisTube } = require("distube");
const formatPlayback = require("../format-playback.js");

exports.data = {
  name: "what",
  description: "Show what's playing and the status of the player",
};

exports.handler = async function (
  interaction = new CommandInteraction(),
  distube = new DisTube()
) {
  const queue = distube.queues.get(interaction.guildID);
  if (!queue) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing in queue" }],
    });
  }

  return interaction.reply({
    embeds: [
      {
        title: queue.playing ? "Now playing" : "Now paused",
        description: formatPlayback(queue),
        fields: [
          {
            name: "Requester",
            value: queue.songs[0].user.toString(),
            inline: true,
          },
          {
            name: "Queue",
            value: `${queue.songs.length} track${
              queue.songs.length === 1 ? "" : "s"
            } [${queue.formattedDuration}]`,
            inline: true,
          },
          {
            name: "Volume",
            value: String(queue.volume),
            inline: true,
          },
          {
            name: "Autoplay",
            value: queue.autoplay ? "on" : "off",
            inline: true,
          },
          {
            name: "Loop",
            value: ["off", "track", "queue"][queue.repeatMode],
            inline: true,
          },
          {
            name: "Effects",
            value: queue.filters.join(", ") || "off",
            inline: true,
          },
        ],
      },
    ],
  });
};
