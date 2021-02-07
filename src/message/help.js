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
**play**, **p** (URL|TERM...)
play the track or playlist at URL, or search for a track and play it
**find**, **f** TERM...
search TERMS on YouTube and show the results
**pause**
pause playback
**resume**, **r**
resume playback
**stop**
stop playback
**quieter**
decrease the volume
**louder**
increase the volume
**loudest**, **l**
set the volume to 100%
**what**, **w**
show what's playing
**queue**, **q** [PAGE]
show the queue, may be queried by PAGE (default: 1)
**shuffle**, **s**
shuffle the queue
**next**, **n**
play the next track
**drop**, **d** [TRACK]
delete TRACK from the queue (default: last track)
**cut**, **c**
move the last track to the start of the queue
**clear**
empty the queue
**loop**
loop the queue
**unloop**
do not loop the queue
**repeat**
repeat the current track
**unrepeat**
do not repeat the current track
**autoplay**
play a related song when the queue ends
**unautoplay**
do not play a related song when the queue ends
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
