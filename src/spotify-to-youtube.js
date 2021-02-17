const ytsr = require("@distube/ytsr");
const { getData, getTracks } = require("spotify-url-info");

const spotifyListRegExp = /^https:\/\/open\.spotify\.com\/(playlist|artist|album)\/(\w|-){22}.*/;
const spotifySongRegExp = /^https:\/\/open\.spotify\.com\/track\/(\w|-){22}.*/;

const fetch = (url) =>
  spotifyListRegExp.test(url)
    ? getTracks(url)
    : spotifySongRegExp.test(url)
    ? getData(url).then((data) => [data])
    : Promise.resolve([]);

const query = ({ artists: [{ name: artist }], name: title }) =>
  `${artist} - ${title}`;

const metadata = ({ artists, duration_ms, name }) => ({
  title: name.toLowerCase(),
  artist: artists.map(({ name }) => name.toLowerCase()).join(" "),
  duration: duration_ms,
});

const ms = (string) => {
  const [s, m, h = 0] = string.split(":").reverse();
  return h * 3600000 + m * 60000 + s * 1000;
};

const best = ({ title, duration, artist }) => (item) =>
  !item.isLive &&
  item.name.toLowerCase().includes(title) &&
  Math.abs(duration - ms(item.duration)) < 30000 &&
  item.author.name.toLowerCase().includes(artist);

const good = ({ title, duration }) => (item) =>
  !item.isLive &&
  item.name.toLowerCase().includes(title) &&
  Math.abs(duration - ms(item.duration)) < 30000;

const pick = (metadata, { items }) =>
  items.find(best(metadata)) || items.find(good(metadata)) || items[0];

module.exports = function (url) {
  return fetch(url).then((songs) =>
    Promise.all(
      songs.map((song) =>
        ytsr(query(song), { limit: 10 }).then(
          (result) => pick(metadata(song), result).url
        )
      )
    )
  );
};
