"use strict";

const { CommandInteraction } = require("discord.js");
const { DisTube } = require("distube");

exports.data = {
  name: "autoplay",
  description: "Toggle whether a related track is played when the queue ends",
};

exports.handler = async function (
  interaction = new CommandInteraction(),
  distube = new DisTube()
) {
  const queue = distube.queues.get(interaction.guildId);
  if (!queue) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to autoplay" }],
    });
  }

  queue.toggleAutoplay();
  return interaction.reply({
    embeds: [{ description: `Autoplay: ${queue.autoplay ? "on" : "off"}` }],
  });
};
