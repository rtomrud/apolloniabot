import {
  APIChatInputApplicationCommandInteraction,
  APIChatInputApplicationCommandInteractionData,
  APIGuild,
  APIGuildMember,
  APITextChannel,
  APIUser,
  APIVoiceChannelBase,
  ChannelType,
  ChatInputCommandInteraction,
  Client,
  ClientOptions,
  GatewayIntentBits,
  GatewayVoiceState,
  Guild,
  GuildMember,
  InteractionType,
  SnowflakeUtil,
  TextChannel,
  User,
  VoiceChannel,
  VoiceState,
} from "discord.js";

const mockClient = (
  clientOptions: ClientOptions = {
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
  }
) => new Client(clientOptions);

const mockGuild = (
  client: Client,
  apiGuild: APIGuild = {
    id: SnowflakeUtil.generate().toString(),
    name: "",
    icon: null,
    splash: null,
    discovery_splash: null,
    owner_id: SnowflakeUtil.generate().toString(),
    region: "eu-west",
    afk_channel_id: null,
    afk_timeout: 0,
    verification_level: 0,
    default_message_notifications: 0,
    explicit_content_filter: 0,
    roles: [],
    emojis: [],
    features: [],
    mfa_level: 0,
    application_id: null,
    system_channel_id: null,
    system_channel_flags: 0,
    rules_channel_id: null,
    vanity_url_code: null,
    description: null,
    banner: null,
    premium_tier: 0,
    preferred_locale: "en-US",
    public_updates_channel_id: null,
    nsfw_level: 0,
    stickers: [],
    premium_progress_bar_enabled: false,
    hub_type: null,
  }
) => Reflect.construct(Guild, [client, apiGuild]) as Guild;

const mockGuildMember = (
  client: Client,
  guild: Guild,
  user: User,
  apiGuildMember: APIGuildMember = {
    user: {
      id: user.id,
      username: user.username,
      discriminator: user.discriminator,
      avatar: user.avatar,
    },
    roles: [],
    joined_at: "1970-01-01T00:00:00",
    deaf: false,
    mute: false,
  }
) =>
  Reflect.construct(GuildMember, [
    client,
    apiGuildMember,
    guild,
  ]) as GuildMember;

const mockTextChannel = (
  guild: Guild,
  apiTextChannel: APITextChannel = {
    id: SnowflakeUtil.generate().toString(),
    type: ChannelType.GuildText,
    guild_id: guild.id,
  }
) => Reflect.construct(TextChannel, [guild, apiTextChannel]) as TextChannel;

const mockUser = (
  client: Client,
  apiUser: APIUser = {
    id: SnowflakeUtil.generate().toString(),
    username: "",
    discriminator: "",
    avatar: "",
  }
) => Reflect.construct(User, [client, apiUser]) as User;

const mockVoiceChannel = (
  guild: Guild,
  apiVoiceChannelBase: APIVoiceChannelBase<ChannelType.GuildVoice> = {
    id: SnowflakeUtil.generate().toString(),
    type: ChannelType.GuildVoice,
    guild_id: guild.id,
  }
) => Reflect.construct(VoiceChannel, [guild, apiVoiceChannelBase]);

export const mockInteraction = (
  data: APIChatInputApplicationCommandInteractionData
) => {
  const client = mockClient();
  const guild = mockGuild(client);
  client.guilds.cache.set(guild.id, guild);
  const textChannel = mockTextChannel(guild);
  guild.channels.cache.set(textChannel.id, textChannel);
  const user = mockUser(client);
  const guildMember = mockGuildMember(client, guild, user);
  const apiInteraction: APIChatInputApplicationCommandInteraction = {
    id: SnowflakeUtil.generate().toString(),
    application_id: "",
    type: InteractionType.ApplicationCommand,
    data,
    channel_id: textChannel.id,
    guild_id: guild.id,
    member: {
      user: {
        id: guildMember.user.id,
        username: guildMember.user.username,
        discriminator: guildMember.user.discriminator,
        avatar: guildMember.user.avatar,
      },
      roles: [],
      joined_at: (guildMember.joinedAt as Date).toISOString(),
      deaf: false,
      mute: false,
      permissions: "",
    },
    token: "",
    version: 1,
    locale: "en-US",
  };
  const interaction = Reflect.construct(ChatInputCommandInteraction, [
    client,
    apiInteraction,
  ]) as ChatInputCommandInteraction;
  return interaction;
};

export const mockVoiceState = (guild: Guild, user: User) => {
  const voiceChannel: VoiceChannel = mockVoiceChannel(guild);
  guild.channels.cache.set(voiceChannel.id, voiceChannel);
  const gatewayVoiceState: GatewayVoiceState = {
    channel_id: voiceChannel.id,
    user_id: user.id,
    session_id: "",
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
