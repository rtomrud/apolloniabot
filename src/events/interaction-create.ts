import {
  ChannelType,
  ChatInputCommandInteraction,
  Client,
  Colors,
  ComponentType,
  DiscordjsError,
  DiscordjsErrorCodes,
  EmbedBuilder,
  Events,
  Interaction,
  InteractionType,
} from "discord.js";
import { DisTubeError, DisTube as Player } from "distube";
import commands from "../commands/index.js";

export const event = Events.InteractionCreate;

const errorMessages = {
  VOICE_FULL: "Error: I can't join your voice channel because it's full",
  VOICE_CONNECT_FAILED:
    "Error: I can't join you because I can't connect to your voice channel",
  VOICE_MISSING_PERMS:
    "Error: I can't join your voice channel because I don't have permission",
  NO_RESULT: "Error: I can't find that",
  UNAVAILABLE_VIDEO: "Error: I can't play that because it's unavailable",
  UNPLAYABLE_FORMATS:
    "Error: I can't play that because it's in an unplayable format",
  NON_NSFW:
    "Error: I can't play that because it's age-restricted content and this is a SFW channel",
  NOT_SUPPORTED_URL:
    "Error: I can't play that because the website is unsupported",
  CANNOT_RESOLVE_SONG:
    "Error: I can't play that because the track is unresolved",
  EMPTY_FILTERED_PLAYLIST:
    "Error: I can't play that because there's no valid track or there's only age-restricted content and this is a SFW channel",
  EMPTY_PLAYLIST: "Error: I can't play that because there's no valid track",
  SPOTIFY_PLUGIN_NO_RESULT: "Error: I can't find that",
  YTDLP_ERROR: "Error: I can't play that",
};

const defaultErrorMessage = "Error: Something went wrong, sorry";

const handleError =
  (interaction: ChatInputCommandInteraction) =>
  async (error: DisTubeError<string>) => {
    const errorCode = error.errorCode as keyof typeof errorMessages;
    if (
      !errorMessages[errorCode] ||
      errorCode === "SPOTIFY_PLUGIN_NO_RESULT" ||
      errorCode === "YTDLP_ERROR"
    ) {
      console.error(error);
    }

    const embeds = [
      new EmbedBuilder()
        .setDescription(errorMessages[errorCode] || defaultErrorMessage)
        .setColor(Colors.Red),
    ];
    await interaction.reply({ embeds }).catch(async (error: DiscordjsError) => {
      if (error.code === DiscordjsErrorCodes.InteractionAlreadyReplied) {
        await interaction.followUp({ embeds });
      }
    });
  };

export const listener = async function (interaction: Interaction) {
  if (
    interaction.type !== InteractionType.ApplicationCommand &&
    interaction.type !== InteractionType.MessageComponent
  ) {
    return;
  }

  if (interaction.type === InteractionType.MessageComponent) {
    if (interaction.user.id !== interaction.message.interaction?.user.id) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `Error: Sorry ${interaction.user.toString()}, you can't interact with the command of another user`
            )
            .setFooter({
              text: `Run the ${
                interaction.message.interaction
                  ? `/${interaction.message.interaction.commandName}`
                  : ""
              } command yourself to interact with it`,
            })
            .setColor(Colors.Red),
        ],
      });
      return;
    }
  }

  console.log(
    JSON.stringify({
      event: "INTERACTION_CREATE",
      data:
        interaction.type === InteractionType.ApplicationCommand
          ? interaction.toString()
          : interaction.componentType === ComponentType.SelectMenu
          ? `${interaction.customId}${interaction.values.join()}`
          : interaction.customId,
      user: interaction.user.tag,
      userId: interaction.user.id,
      guild: interaction.guild?.name,
      guildId: interaction.guild?.id,
      channel:
        interaction.channel?.type === ChannelType.DM
          ? interaction.channel.recipient?.tag || ""
          : interaction.channel?.name || "",
      channelId: interaction.channel?.id,
      date: interaction.createdAt.toISOString(),
    })
  );

  const commandName = (
    interaction.type === InteractionType.MessageComponent
      ? interaction.customId.split(" ")[0].replace("/", "")
      : interaction.commandName
  ) as keyof typeof commands;
  const command = commands[commandName];
  if (!command) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Error: I can't do that yet, sorry")
          .setColor(Colors.Red),
      ],
    });
    return;
  }

  const { player } = interaction.client as Client & { player: Player };
  command
    .handler(interaction as ChatInputCommandInteraction, player)
    .catch(handleError(interaction as ChatInputCommandInteraction));
};
