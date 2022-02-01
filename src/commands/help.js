import { CommandInteraction } from "discord.js";
import { DisTube as Player } from "distube";
import permissions from "../permissions.js";
import scopes from "../scopes.js";

export const data = {
  name: "help",
  description: "Show help",
};

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new Player()
) {
  const commands = process.env.GUILD_ID
    ? await player.client.guilds
        .fetch(interaction.guildId)
        .then((guild) => guild.commands.fetch())
    : await player.client.application.commands.fetch();
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
