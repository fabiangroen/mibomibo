import React, { useEffect, useRef, useState } from "react";
import { useCursors } from "../hooks/useCursors";
import type { Cursor } from "../types";

const CursorSVG: React.FC<{
  color: string;
  name?: string;
}> = ({ color, name }) => (
  <>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="transform -translate-x-1 -translate-y-1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19119L11.7841 12.3673H5.65376Z"
        fill={color}
        stroke="white"
        strokeWidth="1"
      />
    </svg>
    {name && (
      <div
        className="mt-1 px-2 py-1 rounded text-xs text-white font-medium whitespace-nowrap"
        style={{ backgroundColor: color }}
      >
        {name}
      </div>
    )}
  </>
);

const CursorOverlay: React.FC = () => {
  const { others: cursors, self } = useCursors() as {
    others: Record<string, Cursor>;
    self: Cursor | null;
  };
  const localCursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (localCursorRef.current) {
        localCursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      if (!isVisible) setIsVisible(true);
    };

    const handleLeave = () => setIsVisible(false);
    const handleEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.body.addEventListener("mouseleave", handleLeave);
    document.body.addEventListener("mouseenter", handleEnter);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.body.removeEventListener("mouseleave", handleLeave);
      document.body.removeEventListener("mouseenter", handleEnter);
    };
  }, [isVisible]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Object.entries(cursors).map(([userId, cursor]) => {
        if (!cursor.x || !cursor.y) return null;
        return (
          <div
            key={userId}
            className="absolute transition-all duration-150 ease-linear"
            style={{
              left: `${cursor.x * 100}%`,
              top: `${cursor.y * 100}%`,
            }}
          >
            <CursorSVG color={cursor.color} name={cursor.name} />
          </div>
        );
      })}

      <div
        ref={localCursorRef}
        className="fixed top-0 left-0 will-change-transform z-50"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.2s",
        }}
      >
        <CursorSVG color={self?.color || "#FFFFFF"} name={self?.name || ""} />
      </div>
    </div>
  );
};

export default CursorOverlay;
