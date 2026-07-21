import type {
  CalculatedChecklistItem,
  CalculationEventType,
} from './types';

export function generateChecklist(eventType: CalculationEventType): CalculatedChecklistItem[] {
  const items: CalculatedChecklistItem[] = [
    { key: 'confirm_guests', timingGroup: 'week_before', sortOrder: 10 },
    { key: 'complete_shopping_list', timingGroup: 'week_before', sortOrder: 20 },
    { key: 'buy_products', timingGroup: 'day_before', sortOrder: 30 },
    { key: 'chill_drinks', timingGroup: 'day_before', sortOrder: 40 },
    { key: 'prepare_serving_items', timingGroup: 'day_before', sortOrder: 50 },
    { key: 'buy_ice', timingGroup: 'event_day', sortOrder: 60 },
    { key: 'set_table', timingGroup: 'event_day', sortOrder: 70 },
  ];

  if (eventType === 'bbq') {
    items.push({ key: 'prepare_grill', timingGroup: 'day_before', sortOrder: 45 });
  }

  return items.sort((left, right) => left.sortOrder - right.sortOrder);
}
