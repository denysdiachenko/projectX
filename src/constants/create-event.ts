import type {
  CreateEventDraft,
  DrinkType,
  MenuFormat,
} from '@/components/CreateEventScreen/types';
import { getInitialDate } from '@/helpers/getInitialDate';

export const CREATE_EVENT_TOTAL_STEPS = 5;

export const CREATE_EVENT_DURATION_OPTIONS = [3, 5, 8, 'custom'] as const;

export const CREATE_EVENT_DRINK_OPTIONS = [
  'beer',
  'wine',
  'spirits',
  'juice',
  'soda',
] as const satisfies readonly DrinkType[];

export const CREATE_EVENT_MENU_OPTIONS = [
  'snacks',
  'buffet',
  'full',
] as const satisfies readonly MenuFormat[];

export function createInitialEventDraft(): CreateEventDraft {
  return {
    eventType: 'birthday',
    adults: 1,
    children: 0,
    alcoholGuests: 0,
    name: '',
    date: getInitialDate(),
    time: '18:00',
    duration: 5,
    customDuration: '',
    location: 'indoor',
    menuFormat: 'buffet',
    drinks: ['beer', 'wine', 'juice'],
    budget: '',
    note: '',
  };
}
