import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TimeLeft } from "../utils/time";

const TimeBox = memo<{ value: number; label: string }>(({ value, label }) => {
  const digits = value.toString().padStart(2, "0").split("");

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-xl border">
      <div className="text-6xl font-black text-amber-300 flex justify-center overflow-hidden">
        {digits.map((digit, index) => (
          <div key={index} className="relative w-12 h-16 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${label}-${index}-${digit}`}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {digit}
              </motion.div>
            </AnimatePresence>
          </div>
        ))}
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground uppercase mt-2 text-center">
        {label}
      </div>
    </div>
  );
});

TimeBox.displayName = "TimeBox";

const Countdown: React.FC<{
  timeLeft: TimeLeft;
  isMiboTime: boolean;
}> = ({ timeLeft, isMiboTime }) => {
  if (isMiboTime) {
    return (
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="text-4xl sm:text-6xl font-black text-amber-300 text-center animate-pulse"
      >
        Het is mibo tijd!
      </motion.div>
    );
  }

  if (!(timeLeft.minutes === 0 && timeLeft.hours === 0)) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto px-4">
        <TimeBox value={timeLeft.hours} label="hours" />
        <TimeBox value={timeLeft.minutes} label="minutes" />
        <TimeBox value={timeLeft.seconds} label="seconds" />
      </div>
    );
  } else {
    return (
      <motion.div
        key={timeLeft.seconds}
        animate={{ scale: [1, 1, 0] }}
        transition={{ duration: 1, ease: "easeIn" }}
        className="text-[16rem] sm:text-[24rem] font-black text-amber-300 text-center animate-pulse"
      >
        {timeLeft.seconds}
      </motion.div>
    );
  }
};

export default Countdown;
