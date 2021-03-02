const { promises } = require("fs");
const { tmpdir } = require("os");
const { join } = require("path");
const test = require("tape");
const store = require("../../src/store/index.js");

const { chmod, mkdtemp, readdir, rmdir, unlink } = promises;

const setup = () => mkdtemp(join(tmpdir(), "test-"));

const teardown = async (dir) => {
  const files = await readdir(dir);
  await Promise.all(files.map((file) => unlink(join(dir, file))));
  return rmdir(dir);
};

test("store", async (t) => {
  const dir = await setup();
  const a = JSON.stringify({ a: 1 });
  const b = JSON.stringify({ b: 2 });
  const c = JSON.stringify({ c: 3 });
  const storage = store(dir);
  await storage.setItem("a", a);
  await storage.setItem("b", b);
  await storage.setItem("c", c);
  t.deepEqual(await storage.key(0), "a", "key() returns the first key");
  t.deepEqual(await storage.key(1), "b", "key() returns a key in the middle");
  t.deepEqual(await storage.key(2), "c", "key() returns the last key");
  t.deepEqual(await storage.key(3), null, "key() outside bounds returns null");
  t.deepEqual(await storage.key(-1), null, "key() below 0 returns null");
  t.deepEqual(await storage.getItem("a"), a, "setItem() adds one item");
  t.deepEqual(await storage.getItem("b"), b, "setItem() adds another item");
  t.deepEqual(await storage.getItem("c"), c, "setItem() adds yet another item");
  await storage.setItem("a", c);
  t.deepEqual(await storage.getItem("a"), c, "setItem() overrides an item");
  t.equal(await storage.length, 3, "setItem() increases the length");
  await chmod(dir, 0o400);
  t.deepEqual(
    await storage.setItem("d", c).catch((error) => error),
    Error("QuotaExceededError"),
    "setItem() throws QuotaExceededError on failure"
  );
  await chmod(dir, 0o700);
  await storage.removeItem("a");
  t.deepEqual(await storage.getItem("a"), null, "removeItem() deletes an item");
  t.equal(await storage.length, 2, "removeItem() decreases the length");
  await storage.clear();
  t.deepEqual(await storage.getItem("b"), null, "clear() deletes all items");
  t.equal(await storage.length, 0, "clear() sets the length to 0");
  await teardown(dir);
  t.end();
});
