import { Queue } from "distube";

export default function initQueue(queue = new Queue()) {
  queue.autoplay = false;
}
