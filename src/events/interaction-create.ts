import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  Colors,
  DiscordjsError,
  DiscordjsErrorCodes,
  EmbedBuilder,
  Events,
  Interaction,
  MessageComponentInteraction,
  MessageFlags,
} from "discord.js";
import { DisTubeError } from "distube";
import commands from "../commands/index.js";
import errors from "../errors.js";

export const event = Events.InteractionCreate;

const handleError =
  (interaction: ChatInputCommandInteraction | MessageComponentInteraction) =>
  async (error: DisTubeError<string>) => {
    const errorCode = error.errorCode as keyof typeof errors;
    if (
      !errors[errorCode] ||
      errorCode === "SPOTIFY_API_ERROR" ||
      errorCode === "YTDLP_ERROR"
    ) {
      console.error(error);
    }

    const embeds = [
      new EmbedBuilder()
        .setDescription(errors[errorCode] || "Something went wrong, sorry")
        .setColor(Colors.Red),
    ];
    await interaction.reply({ embeds }).catch(async (error: DiscordjsError) => {
      if (error.code === DiscordjsErrorCodes.InteractionAlreadyReplied) {
        await interaction.followUp({ embeds });
      }
    });
  };

export const listener = function (interaction: Interaction) {
  if (interaction.isAutocomplete()) {
    const { commandName } = interaction;
    const command = commands[commandName as keyof typeof commands] as {
      autocomplete(interaction: AutocompleteInteraction): Promise<void>;
    };
    command.autocomplete(interaction).catch(() => interaction.respond([]));
    return;
  }

  if (interaction.isMessageComponent()) {
    if (
      interaction.user.id !== interaction.message.interactionMetadata?.user.id
    ) {
      interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(
                `You can't interact with the command of another user.`,
              )
              .setColor(Colors.Red),
          ],
          flags: MessageFlags.Ephemeral,
        })
        .catch(console.error);
      return;
    }
  }

  if (interaction.isChatInputCommand() || interaction.isMessageComponent()) {
    console.log(
      JSON.stringify({
        event: "INTERACTION_CREATE",
        data: interaction.isChatInputCommand()
          ? interaction.toString()
          : interaction.isAnySelectMenu()
            ? `${interaction.customId}${interaction.values.join()}`
            : interaction.customId,
        user: interaction.user.tag,
        userId: interaction.user.id,
        guild: interaction.guild?.name,
        guildId: interaction.guild?.id,
        channel: interaction.channel?.toString(),
        channelId: interaction.channel?.id,
        date: interaction.createdAt.toISOString(),
      }),
    );

    const commandName = interaction.isChatInputCommand()
      ? interaction.commandName
      : interaction.customId.split(" ")[0].replace("/", "");
    const command = commands[commandName as keyof typeof commands];
    if (!command) {
      interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("I can't do that yet, sorry")
              .setColor(Colors.Red),
          ],
        })
        .catch(console.error);
      return;
    }

    command
      .execute(interaction as ChatInputCommandInteraction)
      .catch(handleError(interaction));
  }
};
