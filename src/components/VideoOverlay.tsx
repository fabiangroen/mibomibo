import { useEffect, useRef, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

export function VideoOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoStateRef = ref(db, "globalState/video");

    const unsubscribe = onValue(videoStateRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.startTime) {
        const now = Date.now();
        const elapsed = (now - data.startTime) / 1000;

        if (elapsed < 300) {
          setStartTime(data.startTime);
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isVisible && startTime && videoRef.current) {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;

      if (videoRef.current.duration && elapsed > videoRef.current.duration) {
        setIsVisible(false);
        return;
      }

      videoRef.current.currentTime = elapsed;
      videoRef.current.play().catch((e) => {
        console.log("Autoplay prevented:", e);
        setNeedsInteraction(true);
      });
    }
  }, [isVisible, startTime]);

  const handleInteraction = () => {
    if (videoRef.current && startTime) {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;
      videoRef.current.currentTime = elapsed;
      videoRef.current.play().then(() => setNeedsInteraction(false));
    }
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
        <div
          onClick={handleInteraction}
          className="absolute inset-0 z-50 bg-gray-900 flex items-center justify-center cursor-pointer"
        >
          <span className="text-amber-300 text-2xl font-bold animate-pulse">
            Klik om te openen...
          </span>
        </div>
      )}
      <video
        ref={videoRef}
        src="/pinguindans.mp4"
        className={`w-full h-full object-cover ${
          needsInteraction ? "invisible" : ""
        }`}
        onEnded={() => setIsVisible(false)}
        onLoadedMetadata={(e) => {
          if (startTime) {
            const now = Date.now();
            const elapsed = (now - startTime) / 1000;
            e.currentTarget.currentTime = elapsed;
            if (elapsed < e.currentTarget.duration) {
              e.currentTarget.play().catch((err) => {
                console.error(err);
                setNeedsInteraction(true);
              });
            } else {
              setIsVisible(false);
            }
          }
        }}
      />
    </div>
  );
}
