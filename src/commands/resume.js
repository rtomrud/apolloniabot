"use strict";

const { CommandInteraction } = require("discord.js");
const { DisTube } = require("distube");
const formatPlayback = require("../format-playback.js");

exports.data = {
  name: "resume",
  description: "Resume the playback",
};

exports.handler = async function (
  interaction = new CommandInteraction(),
  distube = new DisTube()
) {
  const queue = distube.queues.get(interaction.guildId);
  if (!queue || queue.playing) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to resume" }],
    });
  }

  queue.resume();
  return interaction.reply({
    embeds: [{ description: `Resumed ${formatPlayback(queue)}` }],
  });
};
