import { Events, Queue } from "distube";

export const event = Events.DISCONNECT;

export const listener = function (queue: Queue) {
  console.log(
    JSON.stringify({
      event: "DISCONNECT",
      guild: queue.voiceChannel?.guild.name,
      guildId: queue.voiceChannel?.guildId,
      channel: queue.voiceChannel?.name,
      channelId: queue.voiceChannel?.id,
      date: new Date().toISOString(),
    }),
  );
};
