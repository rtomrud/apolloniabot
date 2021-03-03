module.exports = async function ({ initMessage }) {
  const { storage } = this.client;
  const { id } = initMessage.guild;
  const [autoplay, dj, effect, loop, volume] = await Promise.all([
    await storage.getItem(`${id}.autoplay`),
    await storage.getItem(`${id}.dj`),
    await storage.getItem(`${id}.effect`),
    await storage.getItem(`${id}.loop`),
    await storage.getItem(`${id}.volume`),
  ]);
  const queue = this.getQueue(initMessage);
  if (queue) {
    queue.autoplay = Boolean(autoplay);
    queue.dj = Boolean(dj);
    queue.effect = effect && String(effect);
    queue.loop = Number(loop);
    queue.volume = Number(volume) || 50;
  }
};
