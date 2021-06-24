const { Interaction } = require("discord.js");
const { default: DisTube } = require("distube");
const formatPlayback = require("../format-playback.js");

exports.data = {
  name: "what",
  description: "Show what's playing and the status of the player",
};

exports.handler = async function (
  interaction = new Interaction(),
  distube = new DisTube()
) {
  const queue = distube.queues.get(interaction.guildID);
  if (!queue) {
    return interaction.reply({
      embeds: [{ description: "Nothing in queue" }],
    });
  }

  const { autoplay, filters, formattedDuration, repeatMode, songs, volume } =
    queue;
  const { length } = songs;
  return interaction.reply({
    embeds: [
      {
        title: queue.playing ? "Now playing" : "Now paused",
        description: formatPlayback(queue),
        fields: [
          { name: "Requester", value: songs[0].user.toString(), inline: true },
          { name: "Volume", value: String(volume), inline: true },
          {
            name: "Queue",
            value: `${length} track${
              length === 1 ? "" : "s"
            } [${formattedDuration}]`,
            inline: true,
          },
          { name: "Effects", value: filters.join(", ") || "off", inline: true },
          {
            name: "Loop",
            value: ["off", "track", "queue"][repeatMode],
            inline: true,
          },
          { name: "Autoplay", value: autoplay ? "on" : "off", inline: true },
        ],
      },
    ],
  });
};
