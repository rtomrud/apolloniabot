import { Queue } from "distube";

export default function noRelated(queue = new Queue()) {
  queue.textChannel
    .send({
      embeds: [
        {
          description:
            "I stopped because the queue is finished and I can't autoplay anything",
        },
      ],
    })
    .catch(console.error);
}
