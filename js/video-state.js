export function selectVideo(search, ids) {
  const candidate = new URLSearchParams(search).get("video");
  return ids.includes(candidate) ? candidate : ids[0];
}
