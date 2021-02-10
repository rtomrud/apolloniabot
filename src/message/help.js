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
**play, p** (URL|TERM...)
play the track or playlist at URL, or search for TERM and play it
**find, f** TERM...
search TERMS on YouTube and show the results
**pause**
pause playback
**resume, r**
resume playback
**stop**
stop playback and empty the queue
**what, w**
show what's playing
**queue, q** [PAGE]
show the queue, at the specified PAGE (default: 1) if there's many pages
**shuffle, s**
shuffle the queue
**next, n**
play the next track
**drop, d** [START] [END]
delete tracks, from START (default: last track) to END (default: START + 1)
**cut, c**
move the last track to the start of the queue
**seek** TIME
go to TIME in the playing track
**volume, v** PERCENT
set volume to PERCENT (from 1 to 100)
**loop, l** (queue|track|off)
repeat the queue, the current track, or turn off looping
**autoplay, a** (on|off)
play a related song once the queue ends, or turn off autoplay (default: on)
**effect, e** (bassboost|nightcore|reverse|vaporwave|off)
apply the specified effect to the audio, or turn off effects
`,
        },
        {
          name: "EXAMPLES",
          value: "`lena play Bohemian Rhapsody`",
        },
      ],
    },
  });
};
