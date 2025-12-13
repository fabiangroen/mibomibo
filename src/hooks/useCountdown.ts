import { useState, useEffect, useMemo } from "react";
import {
  calculateNextMiboTime,
  calculateTimeLeft,
  checkIsMiboTime,
  type TimeLeft,
} from "../utils/time";

export interface CountdownState {
  timeLeft: TimeLeft;
  isMiboTime: boolean;
}

/**
 * Hook to manage countdown state and mibo time detection
 */
export function useCountdown(): CountdownState {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMiboTime, setIsMiboTime] = useState(false);

  const targetDate = useMemo(calculateNextMiboTime, []);

  useEffect(() => {
    const updateCountdown = () => {
      setIsMiboTime(checkIsMiboTime());
      setTimeLeft(calculateTimeLeft(targetDate));
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  useEffect(() => {
    if (isMiboTime) {
      document.title = "Het is mibo tijd!";
    } else {
      document.title = "Mibo Countdown";
    }
  }, [isMiboTime]);

  return { timeLeft, isMiboTime };
}
