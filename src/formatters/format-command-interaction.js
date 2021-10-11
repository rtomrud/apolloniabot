import { CommandInteraction } from "discord.js";

export default function (commandInteraction = new CommandInteraction()) {
  const argv = [`/${commandInteraction.commandName}`];
  const options = [...commandInteraction.options.data];
  while (options.length > 0) {
    const option = options.shift();
    if (option.value != null) {
      argv.push(`${option.name}:`, option.value);
    } else {
      argv.push(option.name);
    }

    if (option.options) {
      options.push(...option.options.values());
    }
  }

  return `${commandInteraction.createdAt.toISOString()} ${
    commandInteraction.user.id
  } /${commandInteraction.guildId}/${commandInteraction.channelId}/${
    commandInteraction.id
  } ${JSON.stringify(commandInteraction.user.username)} ${JSON.stringify(
    argv.join(" ")
  )}`;
}
