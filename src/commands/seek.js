const { CommandInteraction } = require("discord.js");
const { default: DisTube } = require("distube");
const formatPlayback = require("../format-playback.js");

exports.data = {
  name: "seek",
  description: "Seek the current track to a specified time",
  options: [
    {
      name: "time",
      description: "The time in seconds or in HH:MM:SS format",
      type: "STRING",
      required: true,
    },
    {
      name: "mode",
      description: "Whether to seek forward or back by the specified time",
      type: "STRING",
      choices: [
        { name: "back", value: "-" },
        { name: "forward", value: "+" },
      ],
    },
  ],
};

exports.handler = async function (
  interaction = new CommandInteraction(),
  distube = new DisTube()
) {
  const queue = distube.queues.get(interaction.guildID);
  if (!queue || !queue.playing) {
    return interaction.reply({
      embeds: [{ title: "Error", description: "Nothing to seek on" }],
    });
  }

  const { currentTime, songs } = queue;
  const time = interaction.options.get("time").value;
  const seconds = time
    .split(":")
    .reduce(
      (seconds, component, i, { length }) =>
        seconds + Number(component) * 60 ** (length - i - 1),
      0
    );
  const mode = interaction.options.has("mode")
    ? interaction.options.get("mode").value
    : "";
  const newTime =
    mode === "+"
      ? currentTime + seconds
      : mode === "-"
      ? currentTime - seconds
      : seconds;
  queue.seek(Math.max(0, Math.min(newTime, songs[0].duration)));
  return interaction.reply({
    embeds: [{ title: "Seeked", description: formatPlayback(queue) }],
  });
};
