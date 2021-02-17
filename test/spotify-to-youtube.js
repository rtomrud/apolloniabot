const test = require("tape");
const spotifyToYoutube = require("../src/spotify-to-youtube.js");

test("spotify-to-youtube with songs", async (t) => {
  t.deepEquals(
    await spotifyToYoutube(
      "https://open.spotify.com/track/1QxbBB80IuPwhwW1ygGfPh?si=Xm0uPSZcT0i3sNLQMZ7T1Q"
    ),
    ["https://www.youtube.com/watch?v=qI6PKMfkgYk"],
    "spotify-to-youtube with official song way longer than the Spotify version"
  );
  t.end();
});

test("spotify-to-youtube with playlists", async (t) => {
  t.deepEquals(
    await spotifyToYoutube(
      "https://open.spotify.com/artist/0Zy4ncr8h1jd7Nzr9946fD?si=guz0ubuHTJScOxKvhMid1A"
    ),
    [
      "https://www.youtube.com/watch?v=NA1_3LG5BrY",
      "https://www.youtube.com/watch?v=grIZq2H9mFU",
      "https://www.youtube.com/watch?v=YFtrq9vy9UM",
      "https://www.youtube.com/watch?v=aTSLI_Y0eTc",
      "https://www.youtube.com/watch?v=1kJJH5dCtLQ",
      "https://www.youtube.com/watch?v=LxCJQ4yHErM",
      "https://www.youtube.com/watch?v=JhIl8uzJt0U",
      "https://www.youtube.com/watch?v=pbqwmxsXT2o",
      "https://www.youtube.com/watch?v=A4wdbibV3IM",
      "https://www.youtube.com/watch?v=ozmtBfNBkXg",
    ],
    "spotify-to-youtube with an artist playlist"
  );
  t.deepEquals(
    await spotifyToYoutube(
      "https://open.spotify.com/album/0jTjzLGg15C48CJEfZ9pFJ?si=mhHeLMzCTZmgDOjcUNJF5g"
    ),
    [
      "https://www.youtube.com/watch?v=WwoGhpYdebQ",
      "https://www.youtube.com/watch?v=6gmswmbosYo",
      "https://www.youtube.com/watch?v=fJlDyRbUtxI",
      "https://www.youtube.com/watch?v=qmMm1TwYYns",
      "https://www.youtube.com/watch?v=dlA9oaG6ZgU",
      "https://www.youtube.com/watch?v=SSsBO6UIyDc",
      "https://www.youtube.com/watch?v=FPHWgzYO4ws",
      "https://www.youtube.com/watch?v=FE6_Cay9EPY",
      "https://www.youtube.com/watch?v=CmxLAnBaizY",
      "https://www.youtube.com/watch?v=yeRuFdgrwuY",
      "https://www.youtube.com/watch?v=xnLPqleIYP0",
      "https://www.youtube.com/watch?v=Wu02LdxtMC8",
      "https://www.youtube.com/watch?v=0VPFCLGyfcg",
      "https://www.youtube.com/watch?v=2lnkCbMYzpk",
    ],
    "spotify-to-youtube with an album playlist"
  );
  t.end();
});

test("spotify-to-youtube with invalid URLs", async (t) => {
  t.deepEquals(
    await spotifyToYoutube("https://open.spotify.com/"),
    [],
    "spotify-to-youtube with a Spotify URL with no path"
  );
  t.deepEquals(
    await spotifyToYoutube("https://www.youtube.com/"),
    [],
    "spotify-to-youtube with a non-Spotify URL"
  );
  t.end();
});
