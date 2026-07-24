import {
  CalendarDialogResultActions,
  createEventInCalendarAsync,
  isAvailableAsync,
} from 'expo-calendar/legacy';

export type DeviceCalendarEvent = {
  durationHours: number;
  notes: string | null;
  startsAt: string;
  timeZone: string;
  title: string;
};

export async function addEventToDeviceCalendar(event: DeviceCalendarEvent) {
  if (!(await isAvailableAsync())) {
    throw new Error('Device calendar is unavailable');
  }

  const startDate = new Date(event.startsAt);
  const endDate = new Date(startDate.getTime() + event.durationHours * 60 * 60 * 1000);

  const result = await createEventInCalendarAsync({
    endDate,
    endTimeZone: event.timeZone,
    notes: event.notes ?? undefined,
    startDate,
    timeZone: event.timeZone,
    title: event.title,
  });

  return {
    saved: result.action === CalendarDialogResultActions.saved,
  };
}
