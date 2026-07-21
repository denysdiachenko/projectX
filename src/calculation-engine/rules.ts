import type {
  CalculationDrinkCategory,
  CalculationMenuFormat,
  PlanTargetCategory,
} from './types';

export const CALCULATION_RULES_VERSION = '1.1.0';
export const CHILD_PORTION_COEFFICIENT = 0.6;
export const RESERVE_COEFFICIENT = 1.1;
export const ICE_PER_GUEST_KG = 0.15;
export const ICE_PER_CHILLED_LITER_KG = 0.1;
export const MINIMUM_ICE_KG = 0.5;
export const SUPPLY_RESERVE_GROUP_SIZE = 10;

export const PLATES_PER_GUEST: Record<CalculationMenuFormat, number> = {
  snacks: 1,
  buffet: 1.5,
  full_menu: 2,
};

export const MENU_BASE_GRAMS: Record<CalculationMenuFormat, number> = {
  snacks: 450,
  buffet: 700,
  full_menu: 900,
};

export const MENU_CATEGORY_SHARES: Record<
  CalculationMenuFormat,
  Partial<Record<PlanTargetCategory, number>>
> = {
  snacks: {
    snacks_and_canapes: 0.65,
    sides_and_vegetables: 0.15,
    fruit_and_dessert: 0.2,
  },
  buffet: {
    snacks_and_canapes: 0.35,
    substantial_food: 0.35,
    sides_and_vegetables: 0.15,
    fruit_and_dessert: 0.15,
  },
  full_menu: {
    snacks_and_canapes: 0.2,
    substantial_food: 0.3,
    sides_and_vegetables: 0.35,
    fruit_and_dessert: 0.15,
  },
};

export const ALCOHOL_SERVING_LITERS: Record<CalculationDrinkCategory, number> = {
  beer: 0.5,
  wine: 0.15,
  spirits: 0.05,
  juice: 0,
  soda: 0,
};

export const FOOD_CATEGORY_ORDER: PlanTargetCategory[] = [
  'snacks_and_canapes',
  'substantial_food',
  'sides_and_vegetables',
  'fruit_and_dessert',
];
