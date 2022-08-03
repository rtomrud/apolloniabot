import {
  ChannelType,
  ChatInputCommandInteraction,
  Client,
  Colors,
  Events,
  Interaction,
  InteractionType,
} from "discord.js";
import { DisTube as Player } from "distube";
import commands from "../commands/index.js";

export const event = Events.InteractionCreate;

export const listener = async function (interaction: Interaction) {
  if (
    interaction.type !== InteractionType.ApplicationCommand &&
    interaction.type !== InteractionType.MessageComponent
  ) {
    return;
  }

  console.log(
    JSON.stringify({
      event: "INTERACTION_CREATE",
      data:
        interaction.type === InteractionType.MessageComponent
          ? interaction.customId
          : interaction.toString(),
      user: interaction.user.tag,
      userId: interaction.user.id,
      guild: interaction.guild?.name,
      guildId: interaction.guild?.id,
      channel:
        interaction.channel?.type === ChannelType.DM
          ? interaction.channel.recipient?.tag
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
        { description: "Error: I can't do that yet, sorry", color: Colors.Red },
      ],
    });
    return;
  }

  const { player } = interaction.client as Client & { player: Player };
  command
    .handler(interaction as ChatInputCommandInteraction, player)
    .catch(console.error);
};
