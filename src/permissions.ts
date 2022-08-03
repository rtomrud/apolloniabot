import { PermissionsBitField } from "discord.js";

export default new PermissionsBitField()
  .add([
    PermissionsBitField.Flags.Connect,
    PermissionsBitField.Flags.Speak,
    PermissionsBitField.Flags.UseApplicationCommands,
  ])
  .toArray();
