import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { DisTube as Player } from "../../node_modules/distube/dist/index.js";
import permissions from "../permissions.js";
import scopes from "../scopes.js";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Show help");

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new Player()
) {
  const commands = await player.client.application.commands.fetch();
  return interaction.reply({
    embeds: [
      {
        title: player.client.user.username,
        description: "I play music. These are the commands you can give me:",
        url: player.client.generateInvite({ permissions, scopes }),
        fields: Array.from(commands, ([, command]) => ({
          name: `/${command.name}`,
          value: command.description,
        })),
      },
    ],
  });
};
