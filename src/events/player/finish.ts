import { Events, Queue } from "distube";

export const event = Events.FINISH;

export const listener = function (queue: Queue) {
  console.log(
    JSON.stringify({
      event: "FINISH",
      guild: queue.voiceChannel?.guild.name,
      guildId: queue.voiceChannel?.guildId,
      channel: queue.voiceChannel?.name,
      channelId: queue.voiceChannel?.id,
      date: new Date().toISOString(),
    }),
  );
};
