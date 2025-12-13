import { useEffect, useState, useRef } from "react";
import { ref, onValue, update, onDisconnect, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import throttle from "lodash/throttle";
import { db, auth } from "../firebase";
import { CURSOR } from "../constants";
import type { Cursor } from "../types";

export interface UseCursorsResult {
  others: Record<string, Cursor>;
  self: Cursor | null;
}

export const useCursors = (): UseCursorsResult => {
  const [others, setOthers] = useState<Record<string, Cursor>>({});
  const [self, setSelf] = useState<Cursor | null>(null);
  const myColor = useRef(
    "#" + Math.floor(Math.random() * 16777215).toString(16)
  );
  const lastMouseMove = useRef(Date.now());

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      const myRef = ref(db, `cursors/${user.uid}`);

      get(myRef).then((snapshot) => {
        const data = snapshot.val();
        if (data && data.color) {
          myColor.current = data.color;
        } else {
          update(myRef, { color: myColor.current });
        }
      });

      const handleMouseMove = throttle((event: MouseEvent) => {
        lastMouseMove.current = Date.now();
        update(myRef, {
          x:
            Math.round(
              (event.clientX / window.innerWidth) * CURSOR.POSITION_PRECISION
            ) / CURSOR.POSITION_PRECISION,
          y:
            Math.round(
              (event.clientY / window.innerHeight) * CURSOR.POSITION_PRECISION
            ) / CURSOR.POSITION_PRECISION,
          lastUpdate: Date.now(),
        });
      }, CURSOR.THROTTLE_MS);

      onDisconnect(myRef).update({
        x: null,
        y: null,
        lastUpdate: null,
      });

      window.addEventListener("mousemove", handleMouseMove);

      const allCursorsRef = ref(db, "cursors");
      const unsubscribeCursors = onValue(allCursorsRef, (snapshot) => {
        const data = snapshot.val() || {};
        const { [user.uid]: selfCursor, ...otherCursors } = data;
        setOthers(otherCursors);
        setSelf(selfCursor);
      });

      const intervalId = setInterval(() => {
        const now = Date.now();
        if (now - lastMouseMove.current > CURSOR.INACTIVE_TIMEOUT_MS) {
          update(myRef, {
            x: null,
            y: null,
            lastUpdate: null,
          });
        }
      }, CURSOR.CLEANUP_INTERVAL_MS);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        clearInterval(intervalId);
        update(myRef, {
          x: null,
          y: null,
          lastUpdate: null,
        });
        unsubscribeCursors();
      };
    });

    return () => unsubscribeAuth();
  }, []);

  return { others, self };
};
