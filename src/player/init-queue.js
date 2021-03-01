module.exports = async function ({ initMessage }) {
  const { storage } = this.client;
  const { id } = initMessage.guild;
  const [autoplay] = await Promise.all([
    await storage.getItem(`${id}.autoplay`),
  ]);
  const queue = this.getQueue(initMessage);
  if (queue) {
    queue.autoplay = Boolean(autoplay);
  }
};
