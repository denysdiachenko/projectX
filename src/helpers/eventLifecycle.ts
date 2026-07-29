export type EventLifecycleStatus =
  | 'completed'
  | 'needs_closure'
  | 'ongoing'
  | 'upcoming';

type EventLifecycleInput = {
  completedAt?: string | null;
  durationHours: number;
  startsAt: string;
  status?: string;
};

export function getEventLifecycleStatus(
  event: EventLifecycleInput,
  now = new Date(),
): EventLifecycleStatus {
  if (event.status === 'completed' || event.completedAt) {
    return 'completed';
  }

  const startsAt = new Date(event.startsAt).getTime();
  const endsAt = startsAt + event.durationHours * 60 * 60 * 1000;
  const currentTime = now.getTime();

  if (currentTime < startsAt) return 'upcoming';
  if (currentTime < endsAt) return 'ongoing';
  return 'needs_closure';
}
