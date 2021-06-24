const { Interaction } = require("discord.js");

exports.data = {
  name: "help",
  description: "Show help",
};

exports.handler = async function (interaction = new Interaction()) {
  return interaction.reply({
    embeds: [
      {
        title: "Lena Bot",
        description: `I play music. [Invite me to your server!](https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=2150647872&scope=bot%20applications.commands)`,
        url: "https://discord.gg/wp3HWnUDMa",
        fields: [
          {
            name: "/play",
            value: "Play a track or playlist",
          },
          {
            name: "/find",
            value: "Search on YouTube and show the search results",
          },
          {
            name: "/pause",
            value: "Pause the playback",
          },
          {
            name: "/resume",
            value: "Resume the playback",
          },
          {
            name: "/what",
            value: "Show what's playing and the status of the player",
          },
          {
            name: "/queue",
            value: "Show the queue",
          },
          {
            name: "/next",
            value: "Play the next track in the queue",
          },
          {
            name: "/move",
            value: "Move a track to another position in the queue",
          },
          {
            name: "/shuffle",
            value: "Shuffle the queue",
          },
          {
            name: "/drop",
            value: "Drop a track from the queue",
          },
          {
            name: "/stop",
            value:
              "Stop the playback, clear the queue and leave the voice channel",
          },
          {
            name: "/seek",
            value: "Seek the current track to a specified time",
          },
          {
            name: "/volume",
            value: "Set the volume of the playback",
          },
          {
            name: "/autoplay",
            value:
              "Toggle whether a related track is played when the queue ends",
          },
          {
            name: "/loop",
            value: "Loop the queue or current track",
          },
          {
            name: "/effect",
            value: "Applies an effect to the audio stream",
          },
        ],
      },
    ],
  });
};
