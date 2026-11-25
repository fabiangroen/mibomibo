import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import type { TimeLeft } from "../lib/mibo";

const TimeBox = memo<{ value: number; label: string }>(({ value, label }) => {
  const digits = value.toString().padStart(2, "0").split("");

  return (
    <div className="bg-ink-raised rounded-2xl px-6 py-5 border border-thalia/25 shadow-[0_0_40px_-12px_var(--color-thalia)]">
      <div className="text-6xl font-black text-thalia flex justify-center tabular-nums">
        {digits.map((digit, index) => (
          <div key={index} className="relative w-11 h-16 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={digit}
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
      <div className="text-xs sm:text-sm text-white/50 uppercase tracking-widest mt-2 text-center">
        {label}
      </div>
    </div>
  );
});

const Countdown: React.FC<{ timeLeft: TimeLeft; miboTime: boolean }> = ({
  timeLeft,
  miboTime,
}) => {
  if (miboTime) {
    return (
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="text-5xl sm:text-7xl font-black text-white text-center"
      >
        Het is mibo tijd!
      </motion.div>
    );
  }

  if (timeLeft.hours === 0 && timeLeft.minutes === 0) {
    return (
      <motion.div
        key={timeLeft.seconds}
        animate={{ scale: [1, 1, 0] }}
        transition={{ duration: 1, ease: "easeIn" }}
        className="text-[16rem] sm:text-[24rem] leading-none font-black text-thalia text-center"
      >
        {timeLeft.seconds}
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      <TimeBox value={timeLeft.hours} label="uren" />
      <TimeBox value={timeLeft.minutes} label="minuten" />
      <TimeBox value={timeLeft.seconds} label="seconden" />
    </div>
  );
};

export default Countdown;
