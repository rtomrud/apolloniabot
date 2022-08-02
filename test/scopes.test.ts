import { expect, test } from "@jest/globals";
import scopes from "../src/scopes.js";

test("scopes", () => {
  expect(scopes).toStrictEqual(["applications.commands", "bot"]);
});
