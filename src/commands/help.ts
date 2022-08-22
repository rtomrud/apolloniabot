import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { DisTube as Player } from "distube";
import permissions from "../permissions.js";
import scopes from "../scopes.js";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Show help");

export const handler = async function (
  interaction: ChatInputCommandInteraction,
  player: Player
) {
  const commands = await player.client.application?.commands.fetch();
  return interaction.reply({
    embeds: [
      {
        title: player.client.user?.username,
        description: "I play music. These are the commands you can give me:",
        url: player.client.generateInvite({ permissions, scopes }),
        fields: !commands
          ? []
          : Array.from(commands).map(([, command]) => ({
              name: `/${command.name}`,
              value: command.description,
            })),
      },
    ],
  });
};