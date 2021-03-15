const ms = (string) => {
  const [s, m, h = 0] = string.split(":").reverse();
  return h * 3600000 + m * 60000 + s * 1000;
};

const best = ({ title, duration, artist }) => (item) => {
  const video = item.name.toLowerCase();
  const channel = item.author.name.toLowerCase();
  const official = item.author.ownerBadges.includes("Official Artist Channel");
  return (
    !item.isLive &&
    Math.abs(duration - ms(item.duration)) < 10000 &&
    ((video === title && channel === `${artist} - topic`) ||
      (video.includes(title) && (channel === artist || official)) ||
      (video.includes(`${artist} - ${title}`) && channel.includes(artist)))
  );
};

const good = ({ title, duration }) => (item) =>
  !item.isLive &&
  item.name.toLowerCase().includes(title) &&
  Math.abs(duration - ms(item.duration)) < 30000;

module.exports = function ({ items }, { artists, duration_ms, name }) {
  const songs = items.filter(({ type }) => type === "video");
  const metadata = {
    title: name.toLowerCase(),
    artist: artists.map(({ name }) => name.toLowerCase()).join(" "),
    duration: duration_ms,
  };
  return songs.find(best(metadata)) || songs.find(good(metadata)) || songs[0];
};
