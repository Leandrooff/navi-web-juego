import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("el diálogo ofrece teclado, nombre accesible y devolución del foco", async () => {
  const modal = await source("./Modal.jsx");
  assert.match(modal, /role="dialog" aria-modal="true" aria-labelledby=/);
  assert.match(modal, /event\.key === "Escape"/);
  assert.match(modal, /event\.key === "Tab"/);
  assert.match(modal, /previousFocus\.focus\(\)/);
});

test("las pantallas reales conectan juego, familia y guardado", async () => {
  const app = await source("../main.jsx");
  assert.match(app, /<StoryStage/);
  assert.match(app, /<FamilyDashboard/);
  assert.match(app, /<ClassroomDashboard/);
  assert.match(app, /localStorage\.setItem\("navi-progress"/);
  assert.match(app, /disabled=\{saving\} aria-busy=\{saving\}/);
});
