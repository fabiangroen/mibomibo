import { useEffect, useRef } from "react";
import { ref, set } from "firebase/database";
import { db } from "../firebase";

const SECRET_CODE = "pinguindans";

export function useSecretCode() {
  const bufferRef = useRef("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (key.length !== 1) return;

      const newBuffer = (bufferRef.current + key).slice(-SECRET_CODE.length);
      bufferRef.current = newBuffer;

      if (newBuffer === SECRET_CODE) {
        const videoRef = ref(db, "globalState/video/startTime");
        set(videoRef, {
          startTime: Date.now(),
        });
        bufferRef.current = "";
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
