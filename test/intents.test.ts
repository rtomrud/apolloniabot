import { expect, test } from "@jest/globals";
import intents from "../src/intents.js";

test("intents", () => {
  expect(intents).toStrictEqual([1, 128]);
});
