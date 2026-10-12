export interface YoutubePlayer {
  destroy(): void;
  loadPlaylist(options: {
    list: string;
    listType: string;
    index: number;
  }): void;
  getVideoData(): { video_id?: string };
}
interface PlayerEvent {
  target: YoutubePlayer;
}
interface YoutubeApi {
  Player: new (
    element: HTMLElement,
    options: {
      width: string;
      height: string;
      videoId: string;
      playerVars: {
        autoplay: number;
        playsinline: number;
        listType: string;
        list: string;
        origin: string;
      };
      events: {
        onReady: (event: PlayerEvent) => void;
        onStateChange: (event: PlayerEvent) => void;
        onError: () => void;
      };
    },
  ) => YoutubePlayer;
}
declare global {
  interface Window {
    YT?: YoutubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let pending: Promise<YoutubeApi> | undefined;
/** One lazy API load can be shared across playlist visits. Failures remain retryable. */
export function loadYoutubeApi(): Promise<YoutubeApi> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (pending) return pending;
  pending = new Promise<YoutubeApi>((resolve, reject) => {
    const script = document.createElement("script");
    script.id = "youtube-api";
    script.src = "https://www.youtube.com/iframe_api";
    const previous = window.onYouTubeIframeAPIReady;
    function cleanup() {
      clearTimeout(timeout);
      script.onerror = null;
      if (window.onYouTubeIframeAPIReady === ready)
        window.onYouTubeIframeAPIReady = previous;
    }
    function ready() {
      cleanup();
      previous?.();
      if (window.YT?.Player) resolve(window.YT);
      else {
        pending = undefined;
        script.remove();
        reject(
          new Error(
            "Không tải được YouTube. Hãy thử lại hoặc xem trên YouTube.",
          ),
        );
      }
    }
    function fail() {
      cleanup();
      script.remove();
      pending = undefined;
      reject(
        new Error(
          "Không tải được YouTube. Hãy kiểm tra mạng hoặc xem trên YouTube.",
        ),
      );
    }
    const timeout = setTimeout(fail, 15000);
    window.onYouTubeIframeAPIReady = ready;
    script.onerror = fail;
    document.head.append(script);
  });
  return pending;
}
