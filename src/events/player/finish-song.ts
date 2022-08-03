import { Events, Queue, Song } from "distube";

export const event = Events.FINISH_SONG;

export const listener = function (queue: Queue, song: Song) {
  console.log(
    JSON.stringify({
      event: "FINISH_SONG",
      data: `${song.name || song.url} <${song.url}>`,
      guild: queue.voiceChannel?.guild.name,
      guildId: queue.voiceChannel?.guildId,
      channel: queue.voiceChannel?.name,
      channelId: queue.voiceChannel?.id,
      date: new Date().toISOString(),
    })
  );
};
