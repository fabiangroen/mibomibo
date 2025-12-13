import { useEffect, useRef, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import { VIDEO } from "../constants";

export function VideoOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoStateRef = ref(db, "globalState/video/startTime");

    const unsubscribe = onValue(videoStateRef, (snapshot) => {
      const startTime = snapshot.val();
      if (!startTime) return;

      const elapsed = (Date.now() - startTime) / 1000;
      setElapsedTime(elapsed);
      setIsVisible(elapsed < VIDEO.DURATION_MS / 1000);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVisible) return;

    video.currentTime = elapsedTime;
    video.play().catch(() => setNeedsInteraction(true));
  }, [isVisible, elapsedTime]);

  const handleInteraction = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = elapsedTime;
    video.play().then(() => setNeedsInteraction(false));
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 bg-black flex items-center justify-center ${
        needsInteraction ? "pointer-events-auto" : "pointer-events-none"
      }`}
      style={{ zIndex: 100 }}
    >
      {needsInteraction && (
        <button
          onClick={handleInteraction}
          className="absolute inset-0 z-50 bg-gray-900 flex items-center justify-center cursor-pointer"
        >
          <span className="text-amber-300 text-2xl font-bold animate-pulse">
            Klik om te openen...
          </span>
        </button>
      )}
      <video
        ref={videoRef}
        src="/pinguindans.mp4"
        className={`w-full h-full object-cover ${
          needsInteraction ? "invisible" : ""
        }`}
        onEnded={() => setIsVisible(false)}
      />
    </div>
  );
}
