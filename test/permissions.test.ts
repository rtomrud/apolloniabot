import { expect, test } from "@jest/globals";
import permissions from "../src/permissions.js";

test("permissions", () => {
  expect(permissions).toStrictEqual([
    "Connect",
    "Speak",
    "UseApplicationCommands",
  ]);
});
