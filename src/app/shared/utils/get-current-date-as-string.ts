/**
 * Converts a Date object to a string format compatible with
 * <input type="datetime-local"> (YYYY-MM-DDTHH:mm),
 * strictly forced to UTC+5 (Asia/Tashkent).
 */
export function getCurrentDateAsString(date: string | Date = new Date()): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  // 1. Get the timestamp in UTC
  const utcMillis = date.getTime() + date.getTimezoneOffset() * 60000;

  // 2. Add 5 hours for Uzbekistan (5 * 60 min * 60 sec * 1000 ms)
  const uzbekMillis = utcMillis + 5 * 3600000;
  const uzbekDate = new Date(uzbekMillis);

  // 3. Format manually to avoid browser timezone interference
  const pad = (n: number) => n.toString().padStart(2, '0');

  const year = uzbekDate.getFullYear();
  const month = pad(uzbekDate.getMonth() + 1);
  const day = pad(uzbekDate.getDate());
  const hours = pad(uzbekDate.getHours());
  const minutes = pad(uzbekDate.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Converts a string from <input type="datetime-local"> (YYYY-MM-DDTHH:mm)
 * to a UTC ISO string, assuming the input is in Asia/Tashkent (+05:00).
 */
export function formatDateToIso(localString: string): string {
  if (!localString) return new Date().toISOString();
  // We append the timezone offset to ensure it's parsed as Tashkent time
  // regardless of the browser's local timezone.
  return new Date(`${localString}+05:00`).toISOString();
}
