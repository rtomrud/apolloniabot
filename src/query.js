const ytdl = require("ytdl-core");
const ytpl = require("ytpl");
const ytsr = require("ytsr");
const formatDuration = require("./format-duration.js");

const track = ({
  title = "",
  author: { name = "" } = {},
  url = "",
  duration = "",
  isLive = false,
}) => ({ title, author: name, url, duration, isLive });

module.exports = async function (query) {
  try {
    return ytpl.validateID(query)
      ? ytpl(query, { limit: Infinity, pages: Infinity }).then(({ items }) =>
          items.map(track)
        )
      : ytdl.validateURL(query)
      ? ytdl
          .getBasicInfo(query)
          .then(
            ({
              videoDetails: {
                title,
                author,
                video_url,
                lengthSeconds,
                isLiveContent,
              },
            }) => [
              track({
                title,
                author,
                url: video_url,
                duration: formatDuration(Number(lengthSeconds)),
                isLive: isLiveContent,
              }),
            ]
          )
      : ytsr(query, { limit: 1 }).then(({ items }) => items.map(track));
  } catch {
    return [];
  }
};
