import { useState } from "react";
import { motion } from "framer-motion";

interface BeerIconProps {
  src: string;
  alt: string;
  className?: string;
}

const BeerIcon: React.FC<BeerIconProps> = ({ src, alt, className }) => {
  const [clicks, setClicks] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const handleClick = () => {
    const newCount = clicks + 1;
    setClicks(newCount);

    if (newCount === 5) {
      setShowEasterEgg(true);
      setTimeout(() => {
        setShowEasterEgg(false);
        setClicks(0);
      }, 5000);
    }
  };

  return (
    <>
      {showEasterEgg && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                y: -100,
                x: Math.random() * window.innerWidth,
                rotate: 0,
              }}
              animate={{ y: window.innerHeight + 100, rotate: 360 }}
              transition={{
                duration: 3 + Math.random() * 2,
                ease: "linear",
                delay: Math.random() * 0.5,
              }}
              className="absolute text-4xl"
            >
              🍺
            </motion.div>
          ))}
        </div>
      )}

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
