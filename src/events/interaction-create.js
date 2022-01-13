import { Interaction } from "discord.js";
import commands from "../commands/index.js";

export default function interactionCreate(interaction = new Interaction()) {
  if (!interaction.isCommand()) {
    return;
  }

  console.log(
    '%s (%s) used "%s" at %s (%s) #%s (%s) on %s',
    interaction.user.tag,
    interaction.user.toString(),
    interaction.toString(),
    interaction.guild.name,
    interaction.guild.id,
    interaction.channel.name,
    interaction.channel.toString(),
    interaction.createdAt.toUTCString()
  );

  const command = commands[interaction.commandName];
  if (!command) {
    interaction.reply({
      embeds: [{ description: "Error: I can't do that yet, sorry" }],
    });
    return;
  }

  command.handler(interaction, interaction.client.player);
}
