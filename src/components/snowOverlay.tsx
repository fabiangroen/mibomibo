import { useMemo } from "react";

export default function SnowOverlay() {
  const snowflakes = useMemo(() => {
    return Array.from({ length: 50 }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 10,
      size: 2 + Math.random() * 3,
    }));
  }, []);

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-50">
        {snowflakes.map((flake, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/80"
            style={{
              left: `${flake.left}%`,
              width: `${flake.size}px`,
              height: `${flake.size}px`,
              animation: `snow-fall ${flake.duration}s linear infinite`,
              animationDelay: `${flake.delay}s`,
              transform: "translate3d(0, -100px, 0)",
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes snow-fall {
          from {
            transform: translate3d(0, -100px, 0);
          }
          to {
            transform: translate3d(0, calc(100vh + 100px), 0);
          }
        }
      `}</style>
    </>
  );
}
