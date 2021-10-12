import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { expect, test } from "@jest/globals";

const path = fileURLToPath(new URL("../src/index.js", import.meta.url));

test("smoke test", async () => {
  const process = spawn("node", [path]);
  const exit = await new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, 500);
    process.on("close", (code) => {
      clearTimeout(timeout);
      resolve(code);
    });
    process.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
  process.kill("SIGKILL");
  expect(exit).toBe(undefined);
});
