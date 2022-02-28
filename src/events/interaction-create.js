import { CommandInteraction, Interaction } from "discord.js";
import commands from "../commands/index.js";

const defaultCommand = {
  data: { name: "default" },
  handler: async (interaction = new CommandInteraction()) => {
    return interaction.reply({
      embeds: [{ description: "Error: I can't do that yet, sorry" }],
    });
  },
};

export default function interactionCreate(interaction = new Interaction()) {
  if (!interaction.isCommand()) {
    return;
  }

  console.log(
    JSON.stringify({
      event: "INTERACTION_CREATE",
      data: interaction.toString(),
      user: interaction.user.tag,
      userId: interaction.user.id,
      guild: interaction.guild.name,
      guildId: interaction.guild.id,
      channel: interaction.channel.name,
      channelId: interaction.channel.id,
      createdAt: interaction.createdAt.toISOString(),
      id: interaction.id,
    })
  );

  const command = commands[interaction.commandName] || defaultCommand;
  command.handler(interaction, interaction.client.player).catch(console.error);
}
