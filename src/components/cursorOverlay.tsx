import { useCursors } from "../hooks/useCursors";
import type { Cursor } from "../types";

const CursorOverlay: React.FC = () => {
  const cursors = useCursors() as Record<string, Cursor>;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Object.entries(cursors).map(([userId, cursor]) => (
        <div
          key={userId}
          className="absolute transition-all duration-150 ease-linear"
          style={{
            left: `${cursor.x * 100}%`,
            top: `${cursor.y * 100}%`,
          }}
        >
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
              fill={cursor.color}
              stroke="white"
              strokeWidth="1"
            />
          </svg>

          {/* User ID Label, not sensical right now since anonymous users
          <div
            className="mt-1 px-2 py-1 rounded text-xs text-white font-medium whitespace-nowrap"
            style={{ backgroundColor: cursor.color }}
          >
            User {userId.slice(0, 4)}
          </div>
            */}
        </div>
      ))}
    </div>
  );
};

export default CursorOverlay;
