import { Events, VoiceState } from "discord.js";
import { isVoiceChannelEmpty } from "distube";
import player from "../player.js";

export const event = Events.VoiceStateUpdate;

export const listener = function (oldState: VoiceState) {
  if (!oldState?.channel) {
    return;
  }

  const voice = player.voices.get(oldState.guild.id);

  // @ts-expect-error Wrong typings in lib
  if (voice && isVoiceChannelEmpty(oldState)) {
    voice.leave();
  }
};
