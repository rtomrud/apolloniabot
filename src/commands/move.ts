import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  InteractionContextType,
  SlashCommandBuilder,
} from "discord.js";
import player from "../player.js";

export const data = new SlashCommandBuilder()
  .setName("move")
  .setDescription("Move a song to another position in the queue")
  .addStringOption((option) =>
    option
      .setName("song")
      .setDescription("The name or position of the song to move")
      .setAutocomplete(true)
      .setRequired(true),
  )
  .addIntegerOption((option) =>
    option
      .setName("position")
      .setDescription("The position to move the song to")
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
  if (!queue || queue.songs.length <= 1) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Nothing to move")
          .setColor(Colors.Red),
      ],
    });
  }

  const songNumber = Number(interaction.options.getString("song", true));
  const position = interaction.options.getInteger("position", true);
  if (!(songNumber !== 0 && songNumber <= queue.songs.length)) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder().setDescription("No such song").setColor(Colors.Red),
      ],
    });
  }

  if (!(position !== 0 && position <= queue.songs.length)) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("No such position")
          .setColor(Colors.Red),
      ],
    });
  }

  const from =
    songNumber < 0
      ? Math.max(0, queue.songs.length + songNumber)
      : songNumber - 1;
  const to =
    position < 0 ? Math.max(0, queue.songs.length + position) : position - 1;
  queue.songs.splice(to, 0, queue.songs.splice(from, 1)[0]);
  if (from === 0 || to === 0) {
    queue.songs.unshift(queue.songs[0]);
    await queue.skip();
  }

  return interaction.reply({
    embeds: [
      new EmbedBuilder().setDescription(
        `Moved song ${from + 1} to position ${to + 1}`,
      ),
    ],
  });
};
