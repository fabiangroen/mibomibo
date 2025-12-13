import { useEffect, useState, useRef, useCallback } from "react";
import { ref, onValue, push, set } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Point {
  x: number;
  y: number;
}

interface DrawingStroke {
  points: Point[];
  color: string;
  userId: string;
  timestamp: number;
}

const STROKE_LIFETIME = 10000;

export default function DrawingOverlay({
  onDrawingModeChange,
}: {
  onDrawingModeChange: (mode: boolean) => void;
}) {
  const [drawingMode, setDrawingMode] = useState(false);
  const [strokes, setStrokes] = useState<Record<string, DrawingStroke>>({});
  const [userColor, setUserColor] = useState("#FFFFFF");
  const [userId, setUserId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentStroke = useRef<{ id: string; points: Point[] } | null>(null);

  // Get user color and ID
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) return;
      setUserId(user.uid);

      const colorRef = ref(db, `cursors/${user.uid}/color`);
      onValue(colorRef, (snapshot) => {
        if (snapshot.exists()) setUserColor(snapshot.val());
      });
    });
    return () => unsubscribe();
  }, []);

  // Listen to strokes
  useEffect(() => {
    const unsubscribe = onValue(ref(db, "drawings"), (snapshot) => {
      setStrokes(snapshot.val() || {});
    });
    return () => unsubscribe();
  }, []);

  // Clean up old strokes
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      Object.entries(strokes).forEach(([id, stroke]) => {
        if (now - stroke.timestamp > STROKE_LIFETIME) {
          set(ref(db, `drawings/${id}`), null);
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [strokes]);

  // Toggle with D key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "d" && !e.repeat) {
        setDrawingMode((prev) => {
          const newMode = !prev;
          onDrawingModeChange(newMode);
          return newMode;
        });
        currentStroke.current = null;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onDrawingModeChange]);

  // Handle mouse drawing
  useEffect(() => {
    if (!drawingMode) return;

    const startStroke = (e: MouseEvent) => {
      const newStrokeRef = push(ref(db, "drawings"));
      currentStroke.current = {
        id: newStrokeRef.key!,
        points: [
          {
            x: e.clientX / window.innerWidth,
            y: e.clientY / window.innerHeight,
          },
        ],
      };
    };

    const addPoint = (e: MouseEvent) => {
      if (!currentStroke.current) return;
      currentStroke.current.points.push({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
      set(ref(db, `drawings/${currentStroke.current.id}`), {
        points: currentStroke.current.points,
        color: userColor,
        userId,
        timestamp: Date.now(),
      });
    };

    const endStroke = () => {
      currentStroke.current = null;
    };

    window.addEventListener("mousedown", startStroke);
    window.addEventListener("mousemove", addPoint);
    window.addEventListener("mouseup", endStroke);
    return () => {
      window.removeEventListener("mousedown", startStroke);
      window.removeEventListener("mousemove", addPoint);
      window.removeEventListener("mouseup", endStroke);
    };
  }, [drawingMode, userColor, userId]);

  // Render canvas
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const now = Date.now();
    Object.values(strokes).forEach((stroke) => {
      if (!stroke.points?.length) return;

      const opacity = Math.max(
        0,
        1 - (now - stroke.timestamp) / STROKE_LIFETIME
      );
      ctx.strokeStyle = stroke.color;
      ctx.globalAlpha = opacity;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      stroke.points.forEach((p, i) => {
        const x = p.x * canvas.width;
        const y = p.y * canvas.height;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();
    });

    requestAnimationFrame(render);
  }, [strokes]);

  useEffect(() => {
    const frame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frame);
  }, [render]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-20"
      />

      <Button
        size="icon"
        variant={drawingMode ? "beer" : "outline"}
        onClick={() => {
          const newMode = !drawingMode;
          setDrawingMode(newMode);
          onDrawingModeChange(newMode);
        }}
        className="fixed bottom-4 right-4 z-30 transition-all hover:scale-110"
        title={drawingMode ? "Drawing ON (D)" : "Drawing OFF (D)"}
      >
        <Pencil />
      </Button>
    </>
  );
}
