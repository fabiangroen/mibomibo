import { useEffect, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

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

const getNextWeekday16 = (): Date => {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const target = new Date(now);

  // If weekend, go to Monday 16:00
  if (day === 0 || day === 6) {
    const daysToMonday = day === 0 ? 1 : 2;
    target.setDate(now.getDate() + daysToMonday);
    target.setHours(16, 0, 0, 0);
  } else {
    // If weekday before 16:00, target today at 16:00
    if (hour < 16) {
      target.setHours(16, 0, 0, 0);
    } else {
      // After 16:00, target next weekday at 16:00
      const daysToAdd = day === 5 ? 3 : 1; // Friday -> Monday, else next day
      target.setDate(now.getDate() + daysToAdd);
      target.setHours(16, 0, 0, 0);
    }
  }
  return target;
};

const Countdown: React.FC<{
  timeLeft: TimeLeft;
  setTimeLeft: React.Dispatch<React.SetStateAction<TimeLeft>>;
  isMiboTime: boolean;
  setIsMiboTime: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ timeLeft, setTimeLeft, isMiboTime, setIsMiboTime }) => {
  // const [timeLeft, setTimeLeft] = useState<TimeLeft>({
  //   hours: 0,
  //   minutes: 0,
  //   seconds: 0,
  // });

  const targetDate = useMemo(getNextWeekday16, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();

      // Check if it's mibo time (weekday between 16:00 and 20:00)
      const isWeekday = day >= 1 && day <= 5;
      const isMiboHour = hour >= 16 && hour < 20;
      setIsMiboTime(isWeekday && isMiboHour);

      const diff = targetDate.getTime() - now.getTime();

      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor(diff / (1000 * 60 * 60)),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  useEffect(() => {
    if (isMiboTime) {
      document.title = "Het is mibo tijd!";
    } else {
      const { hours, minutes, seconds } = timeLeft;
      document.title = `${String(hours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")}:${String(seconds).padStart(2, "0")} - Mibo`;
    }
  }, [timeLeft, isMiboTime]);

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

  if (!(timeLeft.minutes == 0 && timeLeft.hours == 0)) {
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
