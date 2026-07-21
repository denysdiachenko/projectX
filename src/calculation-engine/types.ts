export type CalculationEventType = 'birthday' | 'bbq' | 'home_party';
export type CalculationLocation = 'indoor' | 'outdoor';
export type CalculationMenuFormat = 'snacks' | 'buffet' | 'full_menu';
export type CalculationDrinkCategory = 'beer' | 'wine' | 'spirits' | 'juice' | 'soda';
export type CalculationSeason = 'winter' | 'spring' | 'summer' | 'autumn';
export type PlanTargetUnit = 'kg' | 'l' | 'pcs';

export type PlanTargetCategory =
  | 'snacks_and_canapes'
  | 'substantial_food'
  | 'sides_and_vegetables'
  | 'fruit_and_dessert'
  | 'water'
  | 'juice'
  | 'soda'
  | 'beer'
  | 'wine'
  | 'spirits'
  | 'ice'
  | 'plates'
  | 'cups';

export type ChecklistTimingGroup = 'week_before' | 'day_before' | 'event_day';

export type EventCalculationInput = {
  eventType: CalculationEventType;
  startsAt: Date;
  timeZone: string;
  durationHours: number;
  location: CalculationLocation;
  adultsCount: number;
  childrenCount: number;
  alcoholGuestsCount: number;
  menuFormat: CalculationMenuFormat;
  drinkCategories: CalculationDrinkCategory[];
};

export type PlanTargetExplanation = {
  rule: 'food' | 'water' | 'soft_drink' | 'alcohol' | 'ice' | 'supplies';
  factors: Record<string, number | string>;
};

export type CalculatedPlanTarget = {
  category: PlanTargetCategory;
  targetQuantity: number;
  unit: PlanTargetUnit;
  explanation: PlanTargetExplanation;
  sortOrder: number;
};

export type CalculatedChecklistItem = {
  key: string;
  timingGroup: ChecklistTimingGroup;
  sortOrder: number;
};

export type EventCalculationResult = {
  rulesVersion: string;
  season: CalculationSeason;
  equivalentGuests: number;
  targets: CalculatedPlanTarget[];
  checklistItems: CalculatedChecklistItem[];
};
