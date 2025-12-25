// src/components/HeadTracker.jsx
import React, { useEffect, useRef } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";

export default function HeadTracker() {
  const videoRef = useRef(null);
  const dotRef = useRef(null);
  const cameraRef = useRef(null);
  const hoverTimerRef = useRef(null);
  const activeElementRef = useRef(null);
  const scrollAnimRef = useRef(null);

  const pos = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  const smoothing = 0.22;
  const DWELL = 900; // ms
  const SCROLL_ZONE = 0.10; // top/bottom 10%

  useEffect(() => {
    console.log("🎯 Head Tracker Activated");

    // Big glowing dot
    const dot = document.createElement("div");
    Object.assign(dot.style, {
      position: "fixed",
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      background: "radial-gradient(circle, #4dd8ff, #007bff)",
      boxShadow: "0 0 60px rgba(0,200,255,0.95)",
      zIndex: 999999,
      pointerEvents: "none",
      transform: "translate(-50%, -50%)",
      left: `${pos.current.x}px`,
      top: `${pos.current.y}px`,
      transition: "transform 0.12s ease-out, box-shadow 0.12s ease-out",
    });

    document.body.appendChild(dot);
    dotRef.current = dot;

    // Hidden video element
    const video = document.createElement("video");
    video.style.display = "none";
    video.setAttribute("playsinline", "true");
    document.body.appendChild(video);
    videoRef.current = video;

    // FaceMesh setup
    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      if (!results.multiFaceLandmarks?.length) return;

      const nose = results.multiFaceLandmarks[0][1];

      // Convert normalized coords to page coords
      const rawX = (1 - nose.x) * window.innerWidth;
      const rawY = nose.y * window.innerHeight;

      pos.current.x += (rawX - pos.current.x) * smoothing;
      pos.current.y += (rawY - pos.current.y) * smoothing;

      dot.style.left = `${pos.current.x}px`;
      dot.style.top = `${pos.current.y}px`;

      detectTarget(pos.current.x, pos.current.y);
      gazeScrollIfNeeded(pos.current.y);
    });

    startCamera(faceMesh);

    // Cleanup when component unmounts
    return () => cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------
  // Scrolling behavior — if gaze is near top/bottom, scroll chat container
  // ----------------------------------------------------------------
  function gazeScrollIfNeeded(y) {
    const h = window.innerHeight;
    const topZone = h * SCROLL_ZONE;
    const bottomZone = h * (1 - SCROLL_ZONE);

    const container = document.querySelector(".chat-messages");
    if (!container) return;

    // stop any previous anim
    if (scrollAnimRef.current) {
      cancelAnimationFrame(scrollAnimRef.current);
      scrollAnimRef.current = null;
    }

    // scroll speed (px per frame) based on how near to edge
    if (y < topZone) {
      const intensity = 1 - y / topZone; // 0..1
      smoothScroll(container, -Math.max(6, intensity * 18));
    } else if (y > bottomZone) {
      const intensity = (y - bottomZone) / (h - bottomZone); // 0..1
      smoothScroll(container, Math.max(6, intensity * 18));
    }
  }

  function smoothScroll(container, dy) {
    // dy: positive scrollDown px/frame, negative scrollUp
    function step() {
      container.scrollTop += dy;
      // keep running only while gaze remains near edges - we run a few frames to make it feel smooth
      scrollAnimRef.current = requestAnimationFrame(step);
    }
    // start one frame (will be cancelled if gaze moves away)
    scrollAnimRef.current = requestAnimationFrame(step);
    // cancel after 120ms to avoid runaway; gazeScrollIfNeeded will restart if needed
    setTimeout(() => {
      if (scrollAnimRef.current) {
        cancelAnimationFrame(scrollAnimRef.current);
        scrollAnimRef.current = null;
      }
    }, 120);
  }

  // ----------------------------------------------------------------
  // Detect buttons & auto click
  // - Will click: elements that are <button> or <a> OR have data-allow-gaze="true"
  // - Will NOT click: element with id "tracker-toggle" (so tracker won't stop itself)
  // ----------------------------------------------------------------
  function detectTarget(x, y) {
    const el = document.elementFromPoint(x, y);
    if (!el) return stopHover();

    const isExplicit = el.dataset && el.dataset.allowGaze === "true";
    const tag = el.tagName;
    const isNativeClickable = tag === "BUTTON" || tag === "A" || !!el.closest && !!el.closest("button, a");
    const isTrackerToggle = el.id === "tracker-toggle" || !!el.closest && !!el.closest("#tracker-toggle");

    const allowGaze = !isTrackerToggle && (isExplicit || isNativeClickable);

    if (allowGaze) {
      dotRef.current.style.transform = "translate(-50%, -50%) scale(1.4)";
      dotRef.current.style.boxShadow = "0 0 80px rgba(0,255,200,1)";
      startHover(el);
    } else {
      dotRef.current.style.transform = "translate(-50%, -50%) scale(1)";
      dotRef.current.style.boxShadow = "0 0 60px rgba(0,200,255,0.95)";
      stopHover();
    }
  }

  function startHover(el) {
    if (activeElementRef.current === el) return;

    stopHover();
    activeElementRef.current = el;

    hoverTimerRef.current = setTimeout(() => {
      try {
        el.focus?.();
        const evt = new PointerEvent("pointerdown", { bubbles: true });
        el.dispatchEvent(evt);
        el.click?.();
        el.style.outline = "3px solid #00ffb3";
        setTimeout(() => (el.style.outline = "none"), 400);
      } catch (e) {
        console.warn("Gaze click failed", e);
      }
    }, DWELL);
  }

  function stopHover() {
    clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = null;
    activeElementRef.current = null;
  }

  // ----------------------------------------------------------------
  // Start Camera
  // ----------------------------------------------------------------
  async function startCamera(faceMesh) {
    try {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          await faceMesh.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });

      await camera.start();
      cameraRef.current = camera;
      console.log("📸 Camera running");
    } catch (err) {
      console.log("❌ Camera failed", err);
    }
  }

  // ----------------------------------------------------------------
  // Cleanup
  // ----------------------------------------------------------------
  function cleanup() {
    console.log("🛑 Stopping tracker");

    stopHover();

    if (cameraRef.current) {
      try {
        cameraRef.current.stop();
      } catch (e) {}
      cameraRef.current = null;
    }

    if (videoRef.current) {
      const stream = videoRef.current.srcObject;
      if (stream) stream.getTracks().forEach((t) => t.stop());
      try { videoRef.current.remove(); } catch (e) {}
      videoRef.current = null;
    }

    if (dotRef.current) {
      try { dotRef.current.remove(); } catch (e) {}
      dotRef.current = null;
    }

    if (scrollAnimRef.current) {
      cancelAnimationFrame(scrollAnimRef.current);
      scrollAnimRef.current = null;
    }
  }

  return null;
}
