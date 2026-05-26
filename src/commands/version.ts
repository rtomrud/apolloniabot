import {
  type ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  InteractionContextType,
  SlashCommandBuilder,
} from "discord.js";
import player from "../player.ts";

const versions = { package: "", ytDlp: "", ffmpeg: "" };

export const data = new SlashCommandBuilder()
  .setName("version")
  .setDescription("Show the version of the bot")
  .setContexts(InteractionContextType.Guild);

export const execute = async function (
  interaction: ChatInputCommandInteraction,
) {
  if (!versions.package) {
    const dec = new TextDecoder();
    const [denoJson, ytDlpOutput, ffmpegOutput] = await Promise.all([
      Deno.readTextFile("deno.json"),
      new Deno.Command("yt-dlp", { args: ["--version"], stdout: "piped" })
        .output(),
      new Deno.Command("ffmpeg", { args: ["-version"], stdout: "piped" })
        .output(),
    ]);
    versions.package = (JSON.parse(denoJson) as { version: string }).version;
    versions.ytDlp = dec.decode(ytDlpOutput.stdout);
    versions.ffmpeg = dec.decode(ffmpegOutput.stdout);
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
