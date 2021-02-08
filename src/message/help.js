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
show the queue, may be queried by PAGE (default: 1)
**shuffle, s**
shuffle the queue
**next, n**
play the next track
**drop, d** [TRACK]
delete TRACK from the queue (default: last track)
**cut, c**
move the last track to the start of the queue
**volume, v** PERCENT
set volume to PERCENT (from 1 to 100)
**loop, l** [1]
repeat the queue, or the current track if 1 is given
**unloop**
do not repeat the queue or current track
**autoplay, a**
play a related song once the queue ends
**unautoplay**
do not play a related song once the queue ends
**nightcore|reverse|vaporwave**
apply the specified filter to the audio
**unfilter**
do not filter the audio
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
