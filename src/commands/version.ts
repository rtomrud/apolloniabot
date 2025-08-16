import { execFile as execFileCallback } from "child_process";
import { readFile } from "fs/promises";
import { promisify } from "util";
import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  InteractionContextType,
  SlashCommandBuilder,
} from "discord.js";
import player from "../player.js";

const execFile = promisify(execFileCallback);

const versions = { package: "", ytDlp: "", ffmpeg: "" };

export const data = new SlashCommandBuilder()
  .setName("version")
  .setDescription("Show the version of the bot")
  .setContexts(InteractionContextType.Guild);

export const execute = async function (
  interaction: ChatInputCommandInteraction,
) {
  if (!versions.package) {
    const [packageJson, ytDlp, ffmpeg] = await Promise.all([
      readFile("package.json", "utf8"),
      execFile("yt-dlp", ["--version"], { windowsHide: true }),
      execFile("ffmpeg", ["-version"], { windowsHide: true }),
    ]);
    versions.package = (JSON.parse(packageJson) as { version: string }).version;
    versions.ytDlp = ytDlp.stdout;
    versions.ffmpeg = ffmpeg.stdout;
  }

  return interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setDescription(
          `${player.client.user?.username} version ${versions.package}\nyt-dlp version ${versions.ytDlp}${versions.ffmpeg}`,
        )
        .setColor(Colors.Red),
    ],
  });
};
