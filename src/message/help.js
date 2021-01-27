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
decrease the volume by 10%
**louder**
increase the volume by 10%
**loudest**, **l**
set the volume to 100%
**what**, **w**
show what is currently playing
**queue**, **q** [PAGE]
show the queue, which may be queried by PAGE (default: 1)
**shuffle**, **s**
shuffle the queue
**next**, **n**
play the next track in the queue
**back**, **b**
play the previous track
**drop**, **d** [TRACK]
delete the TRACK from the queue (default: last track)
**cut**, **c**
move the track from the end of the queue to the start
**clear**
empty the queue
**loop**
loop the queue once it ends
**unloop**
do not loop the queue once it ends
**repeat**
repeat the current track
**unrepeat**
do not repeat the current track
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
