import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionContextType,
  OAuth2Scopes,
  PermissionsBitField,
  SlashCommandBuilder,
} from "discord.js";
import player from "../player.js";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Show help")
  .setContexts(InteractionContextType.Guild);

export const execute = async function (
  interaction: ChatInputCommandInteraction,
) {
  const commands = await player.client.application?.commands.fetch();
  return interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle(player.client.user?.username || null)
        .setURL(
          player.client.generateInvite({
            permissions: new PermissionsBitField()
              .add([
                PermissionsBitField.Flags.Connect,
                PermissionsBitField.Flags.Speak,
                PermissionsBitField.Flags.UseApplicationCommands,
              ])
              .toArray(),
            scopes: [OAuth2Scopes.ApplicationsCommands, OAuth2Scopes.Bot],
          }),
        )
        .addFields(
          Array.from(commands || [])
            .sort(([, a], [, b]) =>
              a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
            )
            .map(([, command]) => ({
              name: `/${command.name}`,
              value: command.description,
            })),
        ),
    ],
  });
};
