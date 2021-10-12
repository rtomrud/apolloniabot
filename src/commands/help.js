import { CommandInteraction } from "discord.js";
import { DisTube } from "distube";
import formatInviteUrl from "../formatters/format-invite-url.js";
import permissions from "../permissions.js";

export const data = {
  name: "help",
  description: "Show help",
};

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new DisTube()
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
        url: formatInviteUrl({
          client_id: player.client.user.id,
          permissions,
        }),
        fields: Array.from(commands, ([, command]) => ({
          name: `/${command.name}`,
          value: command.description,
        })),
      },
    ],
    ephemeral: true,
  });
};
