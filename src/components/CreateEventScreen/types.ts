export type CreateEventStep = 0 | 1 | 2 | 3 | 4;
export type EventType = 'birthday' | 'bbq' | 'homeParty';
export type EventLocation = 'indoor' | 'outdoor';
export type MenuFormat = 'snacks' | 'buffet' | 'full';
export type DrinkType = 'beer' | 'wine' | 'spirits' | 'water' | 'juice' | 'soda';

export type CreateEventDraft = {
  eventType: EventType;
  adults: number;
  children: number;
  alcoholGuests: number;
  name: string;
  date: Date;
  duration: number | 'custom';
  customDuration: string;
  location: EventLocation;
  menuFormat: MenuFormat;
  drinks: DrinkType[];
  budget: string;
  note: string;
};

export type UpdateCreateEventDraft = <Key extends keyof CreateEventDraft>(
  key: Key,
  value: CreateEventDraft[Key],
) => void;
