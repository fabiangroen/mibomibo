import { MIBO_TIME, WEEKDAYS } from "../constants";

export interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Calculate the next occurrence of weekday 16:00 (mibo time start)
 */
export function calculateNextMiboTime(): Date {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const target = new Date(now);

  // If weekend, go to Monday 16:00
  if (day === WEEKDAYS.SUNDAY || day === WEEKDAYS.SATURDAY) {
    const daysToMonday = day === WEEKDAYS.SUNDAY ? 1 : 2;
    target.setDate(now.getDate() + daysToMonday);
    target.setHours(MIBO_TIME.START_HOUR, 0, 0, 0);
  } else {
    // If weekday before 16:00, target today at 16:00
    if (hour < MIBO_TIME.START_HOUR) {
      target.setHours(MIBO_TIME.START_HOUR, 0, 0, 0);
    } else {
      // After 16:00, target next weekday at 16:00
      const daysToAdd = day === WEEKDAYS.FRIDAY ? 3 : 1; // Friday -> Monday, else next day
      target.setDate(now.getDate() + daysToAdd);
      target.setHours(MIBO_TIME.START_HOUR, 0, 0, 0);
    }
  }
  return target;
}

/**
 * Calculate time remaining until target date
 */
export function calculateTimeLeft(targetDate: Date): TimeLeft {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff > 0) {
    return {
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  return { hours: 0, minutes: 0, seconds: 0 };
}

/**
 * Check if current time is mibo time (weekday between 16:00 and 20:00)
 */
export function checkIsMiboTime(): boolean {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();

  const isWeekday = day >= WEEKDAYS.MONDAY && day <= WEEKDAYS.FRIDAY;
  const isMiboHour = hour >= MIBO_TIME.START_HOUR && hour < MIBO_TIME.END_HOUR;

  return isWeekday && isMiboHour;
}
