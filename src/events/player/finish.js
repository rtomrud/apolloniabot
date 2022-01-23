import { Queue } from "distube";

export default function finish(queue = new Queue()) {
  queue.textChannel
    .send({
      embeds: [{ description: "I stopped because the queue is finished" }],
    })
    .catch(console.error);
}
