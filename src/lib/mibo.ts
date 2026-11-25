export interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

const MIBO_START_HOUR = 16;
const MIBO_END_HOUR = 20;

const isWeekday = (date: Date) => date.getDay() >= 1 && date.getDay() <= 5;

export const isMiboTime = (now: Date) =>
  isWeekday(now) &&
  now.getHours() >= MIBO_START_HOUR &&
  now.getHours() < MIBO_END_HOUR;

/** Next weekday 16:00 strictly after `now`. */
const nextMiboStart = (now: Date): Date => {
  const target = new Date(now);
  target.setHours(MIBO_START_HOUR, 0, 0, 0);
  while (target <= now || !isWeekday(target)) {
    target.setDate(target.getDate() + 1);
  }
  return target;
};

export const getTimeLeft = (now: Date): TimeLeft => {
  const diff = Math.max(0, nextMiboStart(now).getTime() - now.getTime());
  const totalSeconds = Math.ceil(diff / 1000);
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds / 60) % 60),
    seconds: totalSeconds % 60,
  };
};
