import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  InteractionContextType,
  SlashCommandBuilder,
  hyperlink,
} from "discord.js";
import player from "../player.js";

export const data = new SlashCommandBuilder()
  .setName("remove")
  .setDescription("Remove a track from the queue")
  .addStringOption((option) =>
    option
      .setName("track")
      .setDescription("The position of the track to remove")
      .setAutocomplete(true)
      .setRequired(true),
  )
  .setContexts(InteractionContextType.Guild);

export const autocomplete = async function (
  interaction: AutocompleteInteraction,
) {
  const track = interaction.options.getFocused();
  const queue = player.queues.get(interaction.guildId as string);
  if (!queue || queue.songs.length === 0) {
    return interaction.respond([]);
  }

  if (track.length === 0) {
    return interaction.respond(
      queue.songs.slice(0, 10).map((song, index) => ({
        name: `${index + 1}. ${song.name || ""}`,
        value: String(index + 1),
      })),
    );
  }

  const trackNumber = Number(track);
  if (Number.isInteger(trackNumber)) {
    const index =
      trackNumber < 0
        ? Math.max(0, queue.songs.length + trackNumber)
        : trackNumber - 1;
    const song = queue.songs[index];
    return interaction.respond([
      { name: `${index + 1}. ${song.name || ""}`, value: String(index + 1) },
    ]);
  }

  const songs = queue.songs
    .filter((song) => song.name?.toLowerCase().includes(track.toLowerCase()))
    .slice(0, 10)
    .map((song) => {
      const index = queue.songs.indexOf(song);
      return {
        name: `${index + 1}. ${song.name || ""}`,
        value: String(index + 1),
      };
    });
  return interaction.respond(songs);
};

export const execute = async function (
  interaction: ChatInputCommandInteraction,
) {
  const queue = player.queues.get(interaction.guildId as string);
  if (!queue) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Nothing to remove")
          .setColor(Colors.Red),
      ],
    });
  }

  const track = Number(interaction.options.getString("track", true));
  if (!(track !== 0 && track <= queue.songs.length)) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("No such track")
          .setColor(Colors.Red),
      ],
    });
  }

  const start = track < 0 ? Math.max(0, queue.songs.length + track) : track - 1;
  const song = queue.songs[start];
  if (start === 0) {
    if (queue.songs.length <= 1 && !queue.autoplay) {
      await queue.stop();
    } else {
      await queue.skip();
    }
  } else {
    queue.songs.splice(start, 1);
  }

  return interaction.reply({
    embeds: [
      new EmbedBuilder().setDescription(
        `Removed ${hyperlink(song.name || song.url || "", song.url || "")}`,
      ),
    ],
  });
};
