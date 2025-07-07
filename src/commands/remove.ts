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
  .setDescription("Remove a song from the queue")
  .addStringOption((option) =>
    option
      .setName("song")
      .setDescription("The position of the song to remove")
      .setAutocomplete(true)
      .setRequired(true),
  )
  .setContexts(InteractionContextType.Guild);

export const autocomplete = async function (
  interaction: AutocompleteInteraction,
) {
  const songOption = interaction.options.getFocused();
  const queue = player.queues.get(interaction.guildId as string);
  if (!queue || queue.songs.length === 0) {
    return interaction.respond([]);
  }

  if (songOption.length === 0) {
    return interaction.respond(
      queue.songs.slice(0, 10).map((song, index) => ({
        name: `${index + 1}. ${song.name || ""}`,
        value: String(index + 1),
      })),
    );
  }

  const songNumber = Number(songOption);
  if (Number.isInteger(songNumber)) {
    const index =
      songNumber < 0
        ? Math.max(0, queue.songs.length + songNumber)
        : songNumber - 1;
    const song = queue.songs[index];
    return interaction.respond([
      { name: `${index + 1}. ${song.name || ""}`, value: String(index + 1) },
    ]);
  }

  const songs = queue.songs
    .filter((song) =>
      song.name?.toLowerCase().includes(songOption.toLowerCase()),
    )
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

  const songNumber = Number(interaction.options.getString("song", true));
  if (!(songNumber !== 0 && songNumber <= queue.songs.length)) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder().setDescription("No such song").setColor(Colors.Red),
      ],
    });
  }

  const start =
    songNumber < 0
      ? Math.max(0, queue.songs.length + songNumber)
      : songNumber - 1;
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
