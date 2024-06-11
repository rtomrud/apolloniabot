import { Client, Events, VoiceState } from "discord.js";
import { DisTube as Player, isVoiceChannelEmpty } from "distube";

export const event = Events.VoiceStateUpdate;

export const listener = function (oldState: VoiceState) {
  if (!oldState?.channel) {
    return;
  }

  // @ts-expect-error client must have a player property
  const client = this as Client & { player: Player };

  const voice = client.player.voices.get(oldState);
  if (voice && isVoiceChannelEmpty(oldState)) {
    voice.leave();
  }
};
