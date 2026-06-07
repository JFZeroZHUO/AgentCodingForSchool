"use client";

import { useEffect, useRef, useState } from "react";

interface CourseVideoPlayerProps {
  title: string;
  videoUrl: string;
}

export default function CourseVideoPlayer({ title, videoUrl }: CourseVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState(videoUrl ? "准备播放" : "暂无视频链接");

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    let hlsInstance: { destroy: () => void } | undefined;
    const isHls = videoUrl.includes(".m3u8");

    async function setup() {
      if (!video) return;

      if (isHls && video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoUrl;
        setStatus("浏览器原生 HLS 播放");
        return;
      }

      if (isHls) {
        try {
          const Hls = (await import("hls.js")).default;
          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(videoUrl);
            hls.attachMedia(video);
            hlsInstance = hls;
            setStatus("HLS 内嵌播放已就绪");
          } else {
            setStatus("当前浏览器不支持 HLS 内嵌播放");
          }
        } catch {
          setStatus("播放器加载失败，请检查 hls.js 依赖");
        }
        return;
      }

      video.src = videoUrl;
      setStatus("视频已就绪");
    }

    setup();

    return () => {
      hlsInstance?.destroy();
    };
  }, [videoUrl]);

  if (!videoUrl) {
    return (
      <div className="video-empty">
        <span className="video-empty-icon" aria-hidden="true">▶</span>
        <strong>这节课暂无视频链接</strong>
        <span>可先阅读教学文档并完成作业。</span>
      </div>
    );
  }

  return (
    <div className="video-player">
      <video ref={videoRef} controls playsInline preload="metadata" aria-label={title} />
      <div className="video-status">
        <span>{status}</span>
        <a href={videoUrl} target="_blank" rel="noreferrer">
          <span aria-hidden="true">↗</span> 原视频链接
        </a>
      </div>
    </div>
  );
}
