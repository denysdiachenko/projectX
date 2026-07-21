import type { CalculationSeason } from './types';

export function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function roundTo(value: number, increment: number) {
  return Math.ceil(value / increment) * increment;
}

export function getDurationCoefficient(durationHours: number) {
  if (durationHours <= 3) {
    return 0.7 + (durationHours - 1) * 0.075;
  }

  if (durationHours <= 5) {
    return 0.85 + (durationHours - 3) * 0.075;
  }

  if (durationHours <= 8) {
    return 1 + (durationHours - 5) / 12;
  }

  return clamp(1.25 + (durationHours - 8) * 0.03125, 1.25, 1.75);
}

export function getSeason(startsAt: Date, timeZone: string): CalculationSeason {
  const month = Number(
    new Intl.DateTimeFormat('en-US', { month: 'numeric', timeZone }).format(startsAt),
  );

  if (month === 12 || month <= 2) return 'winter';
  if (month <= 5) return 'spring';
  if (month <= 8) return 'summer';
  return 'autumn';
}
