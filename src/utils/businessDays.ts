/** Used for “can submit daily update now?” — Surge Africa operates on Ghana local time. */
export const DAILY_UPDATE_BUSINESS_TIME_ZONE = 'Africa/Accra';

function weekdayShortInTimeZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
  }).format(date);
}

/** Saturday or Sunday in the given IANA timezone (default Ghana). */
export function isWeekendInTimeZone(
  date: Date = new Date(),
  timeZone: string = DAILY_UPDATE_BUSINESS_TIME_ZONE,
): boolean {
  const short = weekdayShortInTimeZone(date, timeZone);
  return short === 'Sat' || short === 'Sun';
}
