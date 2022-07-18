import {
  Colors,
  CommandInteraction,
  SlashCommandBuilder,
  hyperlink,
} from "discord.js";
import { DisTube as Player } from "../../node_modules/distube/dist/index.js";

export const data = new SlashCommandBuilder()
  .setName("remove")
  .setDescription("Remove a track from the queue")
  .addIntegerOption((option) =>
    option
      .setName("track")
      .setDescription("The position of the track to remove")
      .setRequired(true)
  );

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new Player()
) {
  const queue = player.queues.get(interaction.guildId);
  if (!queue) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to remove", color: Colors.Red }],
    });
  }

  const track = interaction.options.getInteger("track");
  if (!(track !== 0 && track <= queue.songs.length)) {
    return interaction.reply({
      embeds: [{ description: "Error: No such track", color: Colors.Red }],
    });
  }

  const start = track < 0 ? Math.max(0, queue.songs.length + track) : track - 1;
  const song = queue.songs[start];
  if (start === 0) {
    if (queue.songs.length <= 1 && !queue.autoplay) {
      queue.stop();
    } else {
      queue.skip();
    }
  } else {
    queue.songs.splice(start, 1);
  }

  return interaction.reply({
    embeds: [{ description: `Removed ${hyperlink(song.name, song.url)}` }],
  });
};
