import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { expect, test } from "@jest/globals";

const path = fileURLToPath(new URL("../src/index.js", import.meta.url));

test("lenabot smoke test", async () => {
  const lenabot = spawn("node", [path]);
  const exit = await new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, 500);
    lenabot.on("close", (code) => {
      clearTimeout(timeout);
      resolve(code);
    });
    lenabot.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
  lenabot.kill("SIGKILL");
  expect(exit).toBe(undefined);
});
