#!/usr/bin/env node
/** Sync public/cars/*.jpg → src/data/imported/carPhotos.json + print missing chassis. */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "../..");
const carsDir = path.join(ROOT, "public/cars");
const files = fs
  .readdirSync(carsDir)
  .filter((f) => f.endsWith(".jpg"))
  .map((f) => f.replace(/\.jpg$/, ""));

const aliases = {
  "e9x-m3": "e92",
};

const map = {};
for (const slug of files) {
  map[slug] = `/cars/${slug}.jpg`;
}
for (const [from, to] of Object.entries(aliases)) {
  if (map[to]) map[from] = map[to];
}

const out = {
  collected_at: new Date().toISOString(),
  count: Object.keys(map).length,
  aliases,
  photos: map,
};
fs.writeFileSync(
  path.join(ROOT, "src/data/imported/carPhotos.json"),
  JSON.stringify(out, null, 2) + "\n",
);
console.log("photos", files.length, "mapped", Object.keys(map).length);
