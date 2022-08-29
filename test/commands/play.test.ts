import { expect, jest, test } from "@jest/globals";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Guild,
  GuildMember,
  InteractionResponse,
} from "discord.js";
import { DisTube as Player } from "distube";
import { handler } from "../../src/commands/play.js";
import { mockInteraction, mockVoiceState } from "../mock-discordjs.js";

test("play when not in a voice channel", async () => {
  const interaction = mockInteraction({
    id: "1",
    name: "play",
    type: ApplicationCommandType.ChatInput,
    options: [
      {
        type: ApplicationCommandOptionType.String,
        name: "query",
        value: "titi me pregunto",
      },
    ],
  });
  interaction.reply = jest.fn(() =>
    Promise.resolve(Reflect.construct(InteractionResponse, [interaction]))
  );
  const player = new Player(interaction.client);
  player.play = jest.fn(() => Promise.resolve());
  await handler(interaction, player);
  expect(interaction.reply).toHaveBeenCalledTimes(1);
  expect(player.play).toHaveBeenCalledTimes(0);
});

test("play with a text query", async () => {
  const interaction = mockInteraction({
    id: "1",
    name: "play",
    type: ApplicationCommandType.ChatInput,
    options: [
      {
        type: ApplicationCommandOptionType.String,
        name: "query",
        value: "titi me pregunto",
      },
    ],
  });
  interaction.reply = jest.fn(() =>
    Promise.resolve(Reflect.construct(InteractionResponse, [interaction]))
  );
  mockVoiceState(interaction.guild as NonNullable<Guild>, interaction.user);
  const player = new Player(interaction.client);
  player.play = jest.fn(() => Promise.resolve());
  await handler(interaction, player);
  expect(interaction.reply).toHaveBeenCalledTimes(1);
  const member = interaction.member as GuildMember;
  expect(player.play).toHaveBeenCalledWith(
    member.voice.channel,
    "titi me pregunto",
    expect.objectContaining({ member, textChannel: interaction.channel })
  );
});

test("play with an URL query", async () => {
  const interaction = mockInteraction({
    id: "1",
    name: "play",
    type: ApplicationCommandType.ChatInput,
    options: [
      {
        type: ApplicationCommandOptionType.String,
        name: "query",
        value: "https://soundcloud.com/badbunny15/bad-bunny-titi-me-pregunto",
      },
    ],
  });
  interaction.reply = jest.fn(() =>
    Promise.resolve(Reflect.construct(InteractionResponse, [interaction]))
  );
  mockVoiceState(interaction.guild as NonNullable<Guild>, interaction.user);
  const player = new Player(interaction.client);
  player.play = jest.fn(() => Promise.resolve());
  await handler(interaction, player);
  expect(interaction.reply).toHaveBeenCalledTimes(1);
  const member = interaction.member as GuildMember;
  expect(player.play).toHaveBeenCalledWith(
    member.voice.channel,
    "https://soundcloud.com/badbunny15/bad-bunny-titi-me-pregunto",
    expect.objectContaining({ member, textChannel: interaction.channel })
  );
});

test("play with a failed reply", async () => {
  const interaction = mockInteraction({
    id: "1",
    name: "play",
    type: ApplicationCommandType.ChatInput,
    options: [
      {
        type: ApplicationCommandOptionType.String,
        name: "query",
        value: "titi me pregunto",
      },
    ],
  });
  interaction.reply = jest
    .fn<() => Promise<never>>()
    .mockRejectedValue(new Error());
  mockVoiceState(interaction.guild as NonNullable<Guild>, interaction.user);
  const player = new Player(interaction.client);
  player.play = jest.fn(() => Promise.resolve());
  await handler(interaction, player);
  expect(interaction.reply).toHaveBeenCalledTimes(1);
  const member = interaction.member as GuildMember;
  expect(player.play).toHaveBeenCalledWith(
    member.voice.channel,
    "titi me pregunto",
    expect.objectContaining({ member, textChannel: interaction.channel })
  );
});
