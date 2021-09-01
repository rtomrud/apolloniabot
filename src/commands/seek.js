import { CommandInteraction } from "discord.js";
import { DisTube } from "distube";
import formatPlayback from "../formatters/format-playback.js";

export const data = {
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
      description: "Whether to seek forward or backward by the specified time",
      type: "STRING",
      choices: [
        { name: "backward", value: "backward" },
        { name: "forward", value: "forward" },
      ],
    },
  ],
};

export const handler = async function (
  interaction = new CommandInteraction(),
  distube = new DisTube()
) {
  const queue = distube.queues.get(interaction.guildId);
  if (!queue || !queue.playing) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to seek on" }],
    });
  }

  const time = interaction.options.get("time")?.value;
  const seconds = time
    .split(":")
    .reduce(
      (seconds, component, i, { length }) =>
        seconds + Number(component) * 60 ** (length - i - 1),
      0
    );
  const mode = interaction.options.get("mode")?.value;
  const newTime =
    mode === "forward"
      ? queue.currentTime + seconds
      : mode === "backward"
      ? queue.currentTime - seconds
      : seconds;
  queue.seek(Math.max(0, Math.min(newTime, queue.songs[0].duration)));
  return interaction.reply({
    embeds: [{ description: `Seeked ${formatPlayback(queue)}` }],
  });
};
