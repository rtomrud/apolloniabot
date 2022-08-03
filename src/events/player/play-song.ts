import { Events, Queue, Song, DisTube } from "distube";

export const event = Events.PLAY_SONG;

export const listener = function (this: DisTube, queue: Queue, song: Song) {
  console.log(
    JSON.stringify({
      event: "PLAY_SONG",
      data: `${song.name || song.url} <${song.url}>`,
      guild: queue.voiceChannel?.guild.name,
      guildId: queue.voiceChannel?.guildId,
      channel: queue.voiceChannel?.name,
      channelId: queue.voiceChannel?.id,
      date: new Date().toISOString(),
    })
  );
};
