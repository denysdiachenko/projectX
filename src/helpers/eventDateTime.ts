const EVENT_TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export function formatEventTimeInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);

  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

export function isValidEventTime(value: string) {
  return EVENT_TIME_PATTERN.test(value);
}

export function combineEventDateAndTimeInTimeZone(
  date: Date,
  time: string,
  timeZone: string,
) {
  if (!isValidEventTime(time)) throw new Error('Invalid event time');

  const [hours, minutes] = time.split(':').map(Number);
  const desiredTimestamp = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes,
  );
  const firstGuess = new Date(desiredTimestamp);
  const firstOffset = getTimeZoneOffset(firstGuess, timeZone);
  const candidate = new Date(desiredTimestamp - firstOffset);
  const correctedOffset = getTimeZoneOffset(candidate, timeZone);

  return new Date(desiredTimestamp - correctedOffset);
}

export function splitEventDateAndTime(startsAt: string, timeZone: string) {
  const parts = getZonedParts(new Date(startsAt), timeZone);

  return {
    date: new Date(parts.year, parts.month - 1, parts.day),
    time: `${String(parts.hour).padStart(2, '0')}:${String(parts.minute).padStart(2, '0')}`,
  };
}

function getTimeZoneOffset(date: Date, timeZone: string) {
  const parts = getZonedParts(date, timeZone);
  const zonedTimestamp = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );

  return zonedTimestamp - date.getTime();
}

function getZonedParts(date: Date, timeZone: string) {
  const values = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      day: '2-digit',
      hour: '2-digit',
      hourCycle: 'h23',
      minute: '2-digit',
      month: '2-digit',
      second: '2-digit',
      timeZone,
      year: 'numeric',
    })
      .formatToParts(date)
      .filter(({ type }) => type !== 'literal')
      .map(({ type, value }) => [type, Number(value)]),
  );

  return values as Record<'day' | 'hour' | 'minute' | 'month' | 'second' | 'year', number>;
}
