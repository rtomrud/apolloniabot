import { jest } from "@jest/globals";
import {
  APIChatInputApplicationCommandInteraction,
  APIChatInputApplicationCommandInteractionData,
  APIGuild,
  APIGuildMember,
  APIMessage,
  APITextChannel,
  APIUser,
  APIVoiceChannelBase,
  BaseGuildVoiceChannel,
  ChannelType,
  ChatInputCommandInteraction,
  Client,
  GatewayIntentBits,
  GatewayVoiceState,
  Guild,
  GuildBasedChannel,
  GuildMember,
  InteractionResponse,
  InteractionType,
  Message,
  MessageType,
  TextChannel,
  User,
  VoiceState,
} from "discord.js";

export const mockInteraction = (
  data: APIChatInputApplicationCommandInteractionData
) => {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
  });

  const apiGuild: APIGuild = {
    id: "1",
    name: "",
    icon: null,
    splash: null,
    discovery_splash: null,
    owner_id: "1",
    region: "eu-west",
    afk_channel_id: null,
    afk_timeout: 0,
    verification_level: 1,
    default_message_notifications: 1,
    explicit_content_filter: 3,
    roles: [],
    emojis: [],
    features: [],
    mfa_level: 1,
    application_id: null,
    system_channel_id: null,
    system_channel_flags: 0,
    rules_channel_id: null,
    vanity_url_code: null,
    description: null,
    banner: null,
    premium_tier: 1,
    preferred_locale: "en-US",
    public_updates_channel_id: null,
    nsfw_level: 0,
    stickers: [],
    premium_progress_bar_enabled: false,
    hub_type: null,
  };
  const guild = Reflect.construct(Guild, [client, apiGuild]) as Guild;
  client.guilds.cache.set(guild.id, guild);

  const apiUser: APIUser = {
    id: "1",
    username: "",
    discriminator: "",
    avatar: "",
  };
  Reflect.construct(User, [client, apiUser]) as User;

  const apiGuildMember: APIGuildMember = {
    user: apiUser,
    roles: [],
    joined_at: "",
    deaf: false,
    mute: false,
  };
  Reflect.construct(GuildMember, [
    client,
    apiGuildMember,
    guild,
  ]) as GuildMember;

  const apiTextChannel: APITextChannel = {
    id: "1",
    type: ChannelType.GuildText,
    guild_id: guild.id,
  };
  const textChannel = Reflect.construct(TextChannel, [
    guild,
    apiTextChannel,
  ]) as GuildBasedChannel;
  guild.channels.cache.set(textChannel.id, textChannel);

  const apiInteraction: APIChatInputApplicationCommandInteraction = {
    id: "1",
    application_id: "1",
    type: InteractionType.ApplicationCommand,
    data,
    channel_id: textChannel.id,
    guild_id: guild.id,
    member: { ...apiGuildMember, user: apiUser, permissions: "" },
    token: "",
    version: 1,
    locale: "en-US",
  };
  const interaction = Reflect.construct(ChatInputCommandInteraction, [
    client,
    apiInteraction,
  ]) as ChatInputCommandInteraction;

  interaction.reply = jest.fn(() =>
    Promise.resolve(Reflect.construct(InteractionResponse, [interaction]))
  );

  interaction.followUp = jest.fn(() => {
    const message: APIMessage = {
      id: "1",
      channel_id: textChannel.id,
      author: apiUser,
      content: "",
      timestamp: "",
      edited_timestamp: null,
      tts: false,
      mention_everyone: false,
      mentions: [],
      mention_roles: [],
      attachments: [],
      embeds: [],
      pinned: false,
      type: MessageType.Reply,
    };
    return Promise.resolve(Reflect.construct(Message, [client, message]));
  });

  return interaction;
};

export const mockVoiceState = (guild: Guild, user: User) => {
  const apiVoiceChannel: APIVoiceChannelBase<ChannelType.GuildVoice> = {
    id: "1",
    type: ChannelType.GuildVoice,
    guild_id: guild.id,
  };
  const voiceChannel = Reflect.construct(BaseGuildVoiceChannel, [
    guild,
    apiVoiceChannel,
  ]) as GuildBasedChannel;
  guild.channels.cache.set(voiceChannel.id, voiceChannel);

  const gatewayVoiceState: GatewayVoiceState = {
    channel_id: voiceChannel.id,
    user_id: user.id,
    session_id: "1",
    deaf: false,
    mute: false,
    self_deaf: false,
    self_mute: false,
    self_video: false,
    suppress: false,
    request_to_speak_timestamp: null,
  };
  const voiceState = Reflect.construct(VoiceState, [
    guild,
    gatewayVoiceState,
  ]) as VoiceState;
  guild.voiceStates.cache.set(voiceState.id, voiceState);

  return voiceState;
};
