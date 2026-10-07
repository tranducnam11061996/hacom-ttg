import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { load } from "cheerio";
import { selectVideo } from "../js/video-state.js";
test("URL selection validates membership and survives query ordering", () => {
  const ids = ["abc12345678", "def12345678"];
  assert.equal(selectVideo("?video=def12345678", ids), ids[1]);
  assert.equal(selectVideo("?other=1&video=abc12345678", ids), ids[0]);
  for (const query of [
    "",
    "?video=bad",
    "?video=%3Cscript%3E",
    "?video=abc12345678evil",
  ])
    assert.equal(selectVideo(query, ids), ids[0]);
});
test("Generated episodes preserve snapshot order and titles; all limits respected", () => {
  const d = JSON.parse(fs.readFileSync("data/youtube.snapshot.json"));
  assert.equal(d.playlists.length, 4);
  for (const p of d.playlists) {
    assert.ok(p.videos.length > 0 && p.videos.length <= 30);
    assert.equal(new Set(p.videos.map((v) => v.id)).size, p.videos.length);
    const $ = load(fs.readFileSync(`videos/playlist/${p.slug}.html`, "utf8"));
    const entries = $("[data-episode]").toArray();
    assert.equal(entries.length, p.videos.length);
    entries.forEach((el, i) => {
      assert.equal($(el).attr("data-video-id"), p.videos[i].id);
      assert.equal($(el).find("[data-title]").text(), p.videos[i].title);
      assert.match(p.videos[i].id, /^[\w-]{11}$/);
    });
    assert.equal($("iframe").length, 0);
    assert.equal($('script[src*="youtube"]').length, 0);
  }
});
