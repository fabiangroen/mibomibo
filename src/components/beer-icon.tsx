import { useState, memo } from "react";
import { motion } from "framer-motion";
import { BEER_ICON } from "../constants";

interface BeerIconProps {
  src: string;
  alt: string;
  className?: string;
}

const BeerRain = memo(({ src }: { src: string }) => (
  <div className="fixed inset-0 pointer-events-none z-50">
    {Array.from({ length: BEER_ICON.RAIN_ITEM_COUNT }).map((_, i) => (
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

BeerRain.displayName = "BeerRain";

const BeerIcon: React.FC<BeerIconProps> = ({ src, alt, className }) => {
  const [clicks, setClicks] = useState(0);

  const handleClick = () => {
    const newCount = clicks + 1;
    setClicks(newCount);

    if (newCount === BEER_ICON.CLICK_COUNT_FOR_RAIN) {
      setTimeout(() => setClicks(0), BEER_ICON.RAIN_TIMEOUT_MS);
    }
  };

  const showEasterEgg = clicks >= BEER_ICON.CLICK_COUNT_FOR_RAIN;

  return (
    <>
      {showEasterEgg && <BeerRain src={src} />}

      <motion.img
        src={src}
        alt={alt}
        className={className}
        onClick={handleClick}
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9, rotate: -10 }}
        animate={
          clicks > 0 && clicks < BEER_ICON.CLICK_COUNT_FOR_RAIN
            ? { rotate: [0, -10, 10, -10, 10, 0] }
            : {}
        }
        transition={{ duration: 0.5 }}
      />
    </>
  );
};

export default BeerIcon;
