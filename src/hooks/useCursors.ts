import { useEffect, useState, useRef } from "react";
import { ref, onValue, update, onDisconnect, remove } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import throttle from "lodash/throttle";
import { db, auth } from "../firebase";

export const useCursors = () => {
  const [others, setOthers] = useState({});
  const myColor = useRef(
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  );
  const lastMouseMove = useRef(Date.now());

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      const myRef = ref(db, `cursors/${user.uid}`);

      // 1. Broadcasting
      const handleMouseMove = throttle((event) => {
        lastMouseMove.current = Date.now();
        update(myRef, {
          x: Math.round((event.clientX / window.innerWidth) * 1000) / 1000,
          y: Math.round((event.clientY / window.innerHeight) * 1000) / 1000,
          color: myColor.current,
          lastUpdate: Date.now(),
        });
      }, 100);

      // 2. Cleanup on Disconnect (Offline capability)
      onDisconnect(myRef).remove();

      window.addEventListener("mousemove", handleMouseMove);

      // 3. Listening
      const allCursorsRef = ref(db, "cursors");
      const unsubscribeCursors = onValue(allCursorsRef, (snapshot) => {
        const data = snapshot.val() || {};
        const { [user.uid]: _, ...others } = data; // Filter out self
        setOthers(others);
      });

      const intervalId = setInterval(() => {
        const now = Date.now();
        if (now - lastMouseMove.current > 10000) {
          remove(myRef);
        }
      }, 2000);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        clearInterval(intervalId);
        remove(myRef);
        unsubscribeCursors();
      };
    });

    return () => unsubscribeAuth();
  }, []);

  return others;
};
