module.exports = function (message) {
  message.channel.send({
    embed: {
      fields: [
        {
          name: "NAME",
          value: "[Lena](https://example.com) - I play music",
        },
        {
          name: "SYNOPSIS",
          value: "lena COMMAND [ARG...]",
        },
        {
          name: "COMMANDS",
          value: `
**play, p** (URL|FILE|TERM...)
play the track or playlist at URL, play a FILE, or search TERMS and play it
**find, f** TERM...
search TERMS on YouTube and show the results
**pause**
pause playback
**resume, r**
resume playback
**stop**
stop playback and empty the queue
**what, w**
show what's playing now and the status of the player
**queue, q** [PAGE]
show the queue, at the specified PAGE (default: 1)
**shuffle, s**
shuffle the queue
**next, n**
play the next track
**drop, d** [START] [END]
delete tracks, from START (default: last) to END (default: START + 1)
**cut, c**
move the last track to the start of the queue
**seek** TIME
go to TIME in the playing track
**volume, v** PERCENT
set volume to PERCENT (1-100)
**loop, l** (queue|track|off)
repeat the queue, the current track, or turn off looping
**autoplay, a** (on|off)
play a related song once the queue ends, or turn it off (default: on)
**effect, e** (bassboost|nightcore|vaporwave|karaoke|off)
apply the specified effect to the audio, or turn effects off
`,
        },
        {
          name: "EXAMPLES",
          value: `
\`lena play Bohemian Rhapsody\`
\`lena play https://youtu.be/fdixQDPA2h0\`
\`lena p https://youtube.com/playlist?list=OLAK5uy_mHMBxzRe_v1MEyVhqGI8pBdUaqTJGNFKk\`
`,
        },
      ],
    },
  });
};
