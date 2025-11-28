import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { ref, onValue, runTransaction, set } from "firebase/database";
import { db } from "../firebase";

interface BeerIconProps {
  src: string;
  alt: string;
  className?: string;
}

const BeerRain = memo(({ src }: { src: string }) => (
  <div className="fixed inset-0 pointer-events-none z-50">
    {Array.from({ length: 100 }).map((_, i) => (
      <motion.img
        key={i}
        src={src}
        className="absolute w-8 h-8"
        initial={{ y: -300, x: `${Math.random() * 100}vw`, rotate: 0 }}
        animate={{ y: "110vh", rotate: Math.random() > 0.5 ? 360 : -360 }}
        transition={{
          duration: 3 + Math.random() * 5,
          ease: "linear",
          delay: Math.random() * 0.5,
        }}
      />
    ))}
  </div>
));

const BeerIcon: React.FC<BeerIconProps> = ({ src, alt, className }) => {
  const [clicks, setClicks] = useState(0);
  const [isRaining, setIsRaining] = useState(false);

  useEffect(() => {
    const clicksRef = ref(db, `globalState/easteregg/clicks`);
    const unsubscribe = onValue(clicksRef, (snapshot) => {
      const count = snapshot.val();
      if (typeof count === "number") {
        setClicks(count);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (clicks >= 5) {
      setIsRaining(true);

      const timer = setTimeout(() => {
        setIsRaining(false);
        set(ref(db, `globalState/easteregg/clicks`), 0);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [clicks]);

  const handleClick = () => {
    if (isRaining) return;

    const clicksRef = ref(db, `globalState/easteregg/clicks`);
    runTransaction(clicksRef, (currentClicks) => {
      return (currentClicks || 0) + 1;
    });
  };

  return (
    <>
      {isRaining && <BeerRain src={src} />}

      <motion.img
        src={src}
        alt={alt}
        className={className}
        onClick={handleClick}
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9, rotate: -10 }}
        animate={
          clicks > 0 && clicks < 5 ? { rotate: [0, -10, 10, -10, 10, 0] } : {}
        }
        transition={{ duration: 0.5 }}
      />
    </>
  );
};

export default BeerIcon;
