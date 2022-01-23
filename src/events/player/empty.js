import { Queue } from "distube";

export default function empty(queue = new Queue()) {
  queue.textChannel
    .send({
      embeds: [{ description: "I stopped because the voice channel is empty" }],
    })
    .catch(console.error);
}
