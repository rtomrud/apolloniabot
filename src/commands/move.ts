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
  .setDescription("Move a track to another position in the queue")
  .addStringOption((option) =>
    option
      .setName("track")
      .setDescription("The name or position of the track to move")
      .setAutocomplete(true)
      .setRequired(true),
  )
  .addIntegerOption((option) =>
    option
      .setName("position")
      .setDescription("The position to move the track to")
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
  if (!queue || queue.songs.length <= 1) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Nothing to move")
          .setColor(Colors.Red),
      ],
    });
  }

  const track = Number(interaction.options.getString("track", true));
  const position = interaction.options.getInteger("position", true);
  if (!(track !== 0 && track <= queue.songs.length)) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("No such track")
          .setColor(Colors.Red),
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

  const from = track < 0 ? Math.max(0, queue.songs.length + track) : track - 1;
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
        `Moved track ${from + 1} to position ${to + 1}`,
      ),
    ],
  });
};
