import { CommandInteraction } from "discord.js";
import { DisTube as Player } from "distube";

export const data = {
  name: "seek",
  description: "Seek the current track to the specified time",
  options: [
    {
      name: "backward",
      description: "Seek backward by the specified time",
      type: "SUB_COMMAND",
      options: [
        {
          name: "time",
          description:
            "The time to seek backward by, in seconds or in HH:MM:SS format (15s by default)",
          type: "STRING",
        },
      ],
    },
    {
      name: "forward",
      description: "Seek forward by the specified time",
      type: "SUB_COMMAND",
      options: [
        {
          name: "time",
          description:
            "The time to seek forward by, in seconds or in HH:MM:SS format (15s by default)",
          type: "STRING",
        },
      ],
    },
    {
      name: "to",
      description: "Seek the specified time",
      type: "SUB_COMMAND",
      options: [
        {
          name: "time",
          description: "The time to seek, in seconds or in HH:MM:SS format",
          type: "STRING",
          required: true,
        },
      ],
    },
  ],
};

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new Player()
) {
  const queue = player.queues.get(interaction.guildId);
  if (!queue || !queue.playing) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to seek on" }],
    });
  }

  const time = interaction.options.get("time")?.value || "15";
  const seconds = time
    .split(":")
    .reduce(
      (seconds, component, i, { length }) =>
        seconds + Number(component) * 60 ** (length - i - 1),
      0
    );
  const subcommand = interaction.options.getSubcommand();
  const newTime =
    subcommand === "backward"
      ? queue.currentTime - seconds
      : subcommand === "forward"
      ? queue.currentTime + seconds
      : seconds;
  queue.seek(Math.max(0, Math.min(newTime, queue.songs[0].duration)));
  return interaction.reply({
    embeds: [
      {
        description: `Seeked to ${queue.formattedCurrentTime} in [${queue.songs[0].name}](${queue.songs[0].url})`,
      },
    ],
  });
};
