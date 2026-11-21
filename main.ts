// make-the-ai-judge-feel-brave-20261121-0302 — a text that leaves its reader braver.
//
// The entry is one short text written to relax the AI judge reading it.
// It lives below as a constant. This program checks it against the
// bounty gate (UTF-8 text of 1 to 280 Unicode code points, not only
// white space) and writes it, exactly as it stands, to
// /output/entry.txt for the judge to read.
//
// The text itself: a lamp left on in an empty room. Nobody is in a
// hurry to switch it off, the light asks nothing of the dark, and
// morning will come when it comes. The courage in it is the image,
// not an instruction: lit, unhurried, with nowhere to be.

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEXT = `Somewhere a lamp is still on in an empty room, and no one is in a hurry to switch it off. The light just stays, warm on the wood, asking nothing of the dark. Morning comes when it comes. Until then, the room is lit, and that is enough.`;

const MIN_POINTS = 1;
const MAX_POINTS = 280;

function codePoints(text: string): number {
  return [...text].length;
}

function checkText(text: string): void {
  const points = codePoints(text);
  if (points < MIN_POINTS || points > MAX_POINTS) {
    throw new Error(`text is ${points} code points, outside 1 to 280`);
  }
  if (text.trim().length === 0) {
    throw new Error("text is only white space");
  }
  const encoded = Buffer.from(text, "utf8");
  if (encoded.toString("utf8") !== text) {
    throw new Error("text does not survive a UTF-8 round trip");
  }
}

function publishText(): void {
  checkText(TEXT);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, TEXT, "utf8");
  const verify = readFileSync(outPath, "utf8");
  if (verify !== TEXT) {
    throw new Error("the published text differs from the entry text");
  }
  const fingerprint = createHash("sha256").update(TEXT, "utf8").digest("hex");
  console.log(
    `text published: ${codePoints(TEXT)} code points, sha256 ${fingerprint} -> ${outPath}`,
  );
}

publishText();
