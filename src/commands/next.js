import { CommandInteraction } from "discord.js";
import { DisTube as Player } from "distube";

export const data = {
  name: "next",
  description: "Play the next track in the queue",
};

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new Player()
) {
  const queue = player.queues.get(interaction.guildId);
  if (!queue || (queue.songs.length <= 1 && !queue.autoplay)) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to skip" }],
    });
  }

  const [song] = queue.songs;
  queue.skip();
  return interaction.reply({
    embeds: [{ description: `Skipped [${song.name}](${song.url})` }],
  });
};
