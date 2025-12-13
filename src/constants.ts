/**
 * Time constants for mibo countdown
 */
export const MIBO_TIME = {
  START_HOUR: 16, // 16:00 - when mibo time starts
  END_HOUR: 20, // 20:00 - when mibo time ends
} as const;

export const WEEKDAYS = {
  SUNDAY: 0,
  MONDAY: 1,
  FRIDAY: 5,
  SATURDAY: 6,
} as const;

/**
 * UI interaction constants
 */
export const BEER_ICON = {
  CLICK_COUNT_FOR_RAIN: 5, // Number of clicks to trigger beer rain
  RAIN_TIMEOUT_MS: 8000, // Duration of beer rain animation
  RAIN_ITEM_COUNT: 100, // Number of beer emojis in rain
} as const;

/**
 * Video overlay constants
 */
export const VIDEO = {
  DURATION_MS: 185000, // 3:05 minutes in milliseconds
} as const;

/**
 * Cursor tracking constants
 */
export const CURSOR = {
  THROTTLE_MS: 100, // Throttle mouse movement updates
  POSITION_PRECISION: 1000, // Precision for cursor position (3 decimal places)
  INACTIVE_TIMEOUT_MS: 10000, // Mark cursor as inactive after 10 seconds
  CLEANUP_INTERVAL_MS: 2000, // Check for inactive cursors every 2 seconds
  MAX_NAME_LENGTH: 16, // Maximum length for cursor names
} as const;
