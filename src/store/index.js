const { promises } = require("fs");
const { join } = require("path");

const { readFile, readdir, unlink, writeFile } = promises;

const encode = (s) => s.replace("/", ".");
const decode = (s) => s.replace(".", "/");

/**
 * Returns an object with the `Storage` interface but Promise-based.
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Storage,
 */
module.exports = function (path) {
  return {
    get length() {
      return readdir(path).then(({ length }) => length);
    },
    async key(index) {
      const files = await readdir(path);
      return index >= 0 && index < files.length ? decode(files[index]) : null;
    },
    async getItem(key) {
      try {
        return await readFile(join(path, encode(key)), "utf8");
      } catch {
        return null;
      }
    },
    async setItem(key, value) {
      try {
        await writeFile(join(path, encode(key)), String(value));
      } catch {
        throw Error("QuotaExceededError");
      }
    },
    async removeItem(key) {
      await unlink(join(path, encode(key)));
    },
    async clear() {
      const files = await readdir(path);
      await Promise.all(files.map((file) => unlink(join(path, file))));
    },
  };
};
