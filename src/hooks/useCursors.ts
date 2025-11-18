import { useEffect, useState, useRef } from "react";
import { ref, onValue, set, onDisconnect, remove } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import throttle from "lodash/throttle";
import { db, auth } from "../firebase";

export const useCursors = () => {
  const [others, setOthers] = useState({});
  const myColor = useRef(
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  );

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      const myRef = ref(db, `cursors/${user.uid}`);

      // 1. Broadcasting
      const handleMouseMove = throttle((event) => {
        set(myRef, {
          x: Math.round((event.clientX / window.innerWidth) * 1000) / 1000,
          y: Math.round((event.clientY / window.innerHeight) * 1000) / 1000,
          color: myColor.current,
          lastUpdate: Date.now(),
        });
      }, 50);

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

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        remove(myRef);
        unsubscribeCursors();
      };
    });

    return () => unsubscribeAuth();
  }, []);

  return others;
};
