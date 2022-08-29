import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { DisTube as Player } from "distube";
import permissions from "../permissions.js";
import scopes from "../scopes.js";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Show help")
  .setDMPermission(false);

export const handler = async function (
  interaction: ChatInputCommandInteraction,
  player: Player
) {
  const commands = await player.client.application?.commands.fetch();
  return interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle(player.client.user?.username || null)
        .setDescription("I play music. These are the commands you can give me:")
        .setURL(player.client.generateInvite({ permissions, scopes }))
        .addFields(
          !commands
            ? []
            : Array.from(commands)
                .sort(([, a], [, b]) =>
                  a.name < b.name ? -1 : a.name > b.name ? 1 : 0
                )
                .map(([, command]) => ({
                  name: `/${command.name}`,
                  value: command.description,
                }))
        ),
    ],
  });
};
