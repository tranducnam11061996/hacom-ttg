import { selectVideo } from "./video-state.js";
const root = document.querySelector("[data-playlist]");
const episodes = [...document.querySelectorAll("[data-episode]")];
const ids = episodes.map((a) => a.dataset.videoId);
const title = document.querySelector("#current-title"),
  status = document.querySelector("#player-status"),
  link = document.querySelector("#youtube-link"),
  cover = document.querySelector("#player-cover"),
  button = document.querySelector("#play-video");
let selected = selectVideo(location.search, ids),
  player,
  loading = false;
function reflect(id, changeUrl = true) {
  selected = id;
  const known = episodes.find((a) => a.dataset.videoId === id);
  title.textContent = known
    ? known.querySelector("[data-title]").textContent
    : "Video ngoài danh sách đã lưu";
  episodes.forEach((a) => {
    if (a === known) a.setAttribute("aria-current", "true");
    else a.removeAttribute("aria-current");
  });
  link.href = `https://www.youtube.com/watch?v=${encodeURIComponent(id)}&list=${root.dataset.playlist}`;
  if (known) cover.src = known.querySelector("img").src;
  if (changeUrl) {
    const url = new URL(location.href);
    url.searchParams.set("video", id);
    url.hash = "player";
    history.replaceState(null, "", url);
  }
}
reflect(selected, false);
function loadAPI() {
  return new Promise((resolve, reject) => {
    if (window.YT?.Player) {
      resolve();
      return;
    }
    const timeout = setTimeout(() => {
      document.querySelector("#youtube-api")?.remove();
      reject(
        Error(
          "Không tải được YouTube. Hãy kiểm tra mạng hoặc xem trên YouTube.",
        ),
      );
    }, 15000);
    window.onYouTubeIframeAPIReady = () => {
      clearTimeout(timeout);
      resolve();
    };
    let script = document.querySelector("#youtube-api");
    if (!script) {
      script = document.createElement("script");
      script.id = "youtube-api";
      script.src = "https://www.youtube.com/iframe_api";
      script.onerror = () => {
        clearTimeout(timeout);
        script.remove();
        reject(
          Error("Không tải được YouTube. Hãy thử lại hoặc xem trên YouTube."),
        );
      };
      document.head.append(script);
    }
  });
}
button.addEventListener("click", async () => {
  if (loading) return;
  loading = true;
  button.disabled = true;
  status.textContent = "Đang tải trình phát…";
  try {
    await loadAPI();
    const holder = document.querySelector("#youtube-player");
    holder.hidden = false;
    player = new window.YT.Player(holder, {
      width: "100%",
      height: "100%",
      videoId: selected,
      playerVars: {
        autoplay: 1,
        playsinline: 1,
        listType: "playlist",
        list: root.dataset.playlist,
        origin: location.origin,
      },
      events: {
        onReady: (event) => {
          cover.hidden = true;
          button.hidden = true;
          status.textContent = "Trình phát đã sẵn sàng.";
          event.target.loadPlaylist({
            list: root.dataset.playlist,
            listType: "playlist",
            index: ids.indexOf(selected),
          });
        },
        onStateChange: (event) => {
          const id = event.target.getVideoData()?.video_id;
          if (id) reflect(id);
        },
        onError: () => {
          status.textContent =
            "Video không phát được tại đây. Dùng liên kết “Xem trên YouTube” bên dưới.";
        },
      },
    });
  } catch (error) {
    status.textContent = error.message;
    button.disabled = false;
  } finally {
    loading = false;
  }
});
episodes.forEach((a) =>
  a.addEventListener("click", (event) => {
    event.preventDefault();
    reflect(a.dataset.videoId);
    if (player?.loadPlaylist)
      player.loadPlaylist({
        list: root.dataset.playlist,
        listType: "playlist",
        index: ids.indexOf(selected),
      });
    else
      status.textContent = "Đã chọn tập. Bấm phát để tải trình phát YouTube.";
  }),
);
