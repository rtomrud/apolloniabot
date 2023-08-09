import { GuildMember } from "discord.js";
import { DisTubeError, ExtractorPlugin, Playlist, Song } from "distube";
import spotifyUrlInfo from "spotify-url-info";
import { fetch } from "undici";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const { getTracks } = spotifyUrlInfo(fetch) as {
  getTracks: (url: string) => Promise<
    Array<{
      name: string;
      artist: string;
    }>
  >;
};

export class SpotifyPlugin extends ExtractorPlugin {
  regExp: RegExp;

  constructor({
    regExp = /^https?:\/\/(open|play)\.spotify\.com\/(?<type>album|artist|episode|playlist|show|track)\/(?<id>[a-zA-Z0-9]+)\??.*$/,
  } = {}) {
    super();
    this.regExp = regExp;
  }

  override validate(url: string) {
    return this.regExp.test(url);
  }

  override async resolve<T>(
    url: string,
    { member, metadata }: { member?: GuildMember; metadata?: T },
  ) {
    const tracks = await getTracks(url).catch((error: Error) => {
      throw new DisTubeError("SPOTIFY_PLUGIN_NO_RESULT", String(error));
    });
    const songs = await Promise.all(
      tracks.map(async (track) => {
        const query = `${track.name} ${track.artist}`;
        const songInfo = await this.distube
          .search(query, { limit: 1 })
          .catch((error: Error) => {
            throw new DisTubeError("SPOTIFY_PLUGIN_NO_RESULT", String(error));
          });
        return new Song(songInfo[0], {
          member,
          source: "youtube (spotify)",
          metadata,
        });
      }),
    );
    return songs.length > 1
      ? new Playlist(songs, { member, properties: { url }, metadata })
      : songs[0];
  }
}
