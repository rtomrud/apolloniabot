"use strict";

const { CommandInteraction } = require("discord.js");
const { DisTube } = require("distube");
const formatPlayback = require("../format-playback.js");

exports.data = {
  name: "stop",
  description: "Stop the playback, clear the queue and leave the voice channel",
};

exports.handler = async function (
  interaction = new CommandInteraction(),
  distube = new DisTube()
) {
  const queue = distube.queues.get(interaction.guildId);
  if (!queue) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to stop" }],
    });
  }

  const playback = queue.playing ? formatPlayback(queue) : "";
  queue.stop();
  return interaction.reply({
    embeds: [{ description: `Stopped ${playback}` }],
  });
};
