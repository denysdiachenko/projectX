import { generateChecklist } from './checklist';
import { clamp, getDurationCoefficient, getSeason, roundTo } from './helpers';
import {
  ALCOHOL_SERVING_LITERS,
  CALCULATION_RULES_VERSION,
  CHILD_PORTION_COEFFICIENT,
  FOOD_CATEGORY_ORDER,
  ICE_PER_CHILLED_LITER_KG,
  ICE_PER_GUEST_KG,
  MENU_BASE_GRAMS,
  MENU_CATEGORY_SHARES,
  MINIMUM_ICE_KG,
  PLATES_PER_GUEST,
  RESERVE_COEFFICIENT,
  SUPPLY_RESERVE_GROUP_SIZE,
} from './rules';
import type {
  CalculatedPlanTarget,
  CalculationDrinkCategory,
  EventCalculationInput,
  EventCalculationResult,
  PlanTargetCategory,
  PlanTargetExplanation,
  PlanTargetUnit,
} from './types';

const ALCOHOL_CATEGORIES: CalculationDrinkCategory[] = ['beer', 'wine', 'spirits'];

function assertValidInput(input: EventCalculationInput) {
  const totalGuests = input.adultsCount + input.childrenCount;

  if (!Number.isInteger(input.adultsCount) || input.adultsCount < 0) {
    throw new Error('adultsCount must be a non-negative integer');
  }
  if (!Number.isInteger(input.childrenCount) || input.childrenCount < 0) {
    throw new Error('childrenCount must be a non-negative integer');
  }
  if (totalGuests < 1 || totalGuests > 100) {
    throw new Error('total guest count must be between 1 and 100');
  }
  if (
    !Number.isInteger(input.alcoholGuestsCount)
    || input.alcoholGuestsCount < 0
    || input.alcoholGuestsCount > input.adultsCount
  ) {
    throw new Error('alcoholGuestsCount must be between 0 and adultsCount');
  }
  if (!Number.isInteger(input.durationHours) || input.durationHours < 1 || input.durationHours > 24) {
    throw new Error('durationHours must be an integer between 1 and 24');
  }
  if (Number.isNaN(input.startsAt.getTime())) {
    throw new Error('startsAt must be a valid Date');
  }
  if (!input.timeZone.trim()) {
    throw new Error('timeZone is required');
  }
  if (new Set(input.drinkCategories).size !== input.drinkCategories.length) {
    throw new Error('drinkCategories must not contain duplicates');
  }
}

function createTarget(
  category: PlanTargetCategory,
  targetQuantity: number,
  unit: PlanTargetUnit,
  explanation: PlanTargetExplanation,
  sortOrder: number,
): CalculatedPlanTarget {
  return {
    category,
    targetQuantity: Number(targetQuantity.toFixed(2)),
    unit,
    explanation,
    sortOrder,
  };
}

function getAlcoholShares(selected: CalculationDrinkCategory[]) {
  if (selected.length === 1) return { [selected[0]]: 1 };

  const key = [...selected].sort().join(':');
  const shares: Record<string, Partial<Record<CalculationDrinkCategory, number>>> = {
    'beer:wine': { beer: 0.6, wine: 0.4 },
    'beer:spirits': { beer: 0.7, spirits: 0.3 },
    'spirits:wine': { wine: 0.7, spirits: 0.3 },
    'beer:spirits:wine': { beer: 0.5, wine: 0.35, spirits: 0.15 },
  };

  return shares[key] ?? {};
}

export function calculateEventPlan(input: EventCalculationInput): EventCalculationResult {
  assertValidInput(input);

  const guestCount = input.adultsCount + input.childrenCount;
  const equivalentGuests = input.adultsCount
    + input.childrenCount * CHILD_PORTION_COEFFICIENT;
  const durationCoefficient = getDurationCoefficient(input.durationHours);
  const season = getSeason(input.startsAt, input.timeZone);
  const totalFoodKg = (
    equivalentGuests
    * MENU_BASE_GRAMS[input.menuFormat]
    * durationCoefficient
    * RESERVE_COEFFICIENT
  ) / 1000;
  const targets: CalculatedPlanTarget[] = [];

  FOOD_CATEGORY_ORDER.forEach((category, index) => {
    const share = MENU_CATEGORY_SHARES[input.menuFormat][category];
    if (!share) return;

    targets.push(createTarget(
      category,
      roundTo(totalFoodKg * share, 0.1),
      'kg',
      {
        rule: 'food',
        factors: {
          equivalentGuests: Number(equivalentGuests.toFixed(2)),
          menuFormat: input.menuFormat,
          durationCoefficient: Number(durationCoefficient.toFixed(3)),
          reserveCoefficient: RESERVE_COEFFICIENT,
          categoryShare: share,
        },
      },
      10 + index * 10,
    ));
  });

  const baseWaterPerGuest = clamp(0.25 + 0.15 * input.durationHours, 0.5, 2.5);
  const seasonCoefficient = season === 'summer' ? 1.3 : 1;
  const locationCoefficient = input.location === 'outdoor' ? 1.15 : 1;
  const waterLiters = roundTo(
    guestCount
      * baseWaterPerGuest
      * seasonCoefficient
      * locationCoefficient
      * RESERVE_COEFFICIENT,
    0.5,
  );

  targets.push(createTarget(
    'water',
    waterLiters,
    'l',
    {
      rule: 'water',
      factors: {
        guestCount,
        baseWaterPerGuest: Number(baseWaterPerGuest.toFixed(2)),
        season,
        seasonCoefficient,
        location: input.location,
        locationCoefficient,
        reserveCoefficient: RESERVE_COEFFICIENT,
      },
    },
    100,
  ));

  const selectedSoftDrinks = input.drinkCategories.filter(
    (category) => category === 'juice' || category === 'soda',
  );
  const totalSoftDrinkLiters = guestCount
    * clamp(0.35 + 0.1 * input.durationHours, 0.5, 1.5)
    * RESERVE_COEFFICIENT;

  selectedSoftDrinks.forEach((category, index) => {
    const share = selectedSoftDrinks.length === 1
      ? 1
      : category === 'juice' ? 0.6 : 0.4;

    targets.push(createTarget(
      category,
      roundTo(totalSoftDrinkLiters * share, 0.5),
      'l',
      {
        rule: 'soft_drink',
        factors: {
          guestCount,
          durationHours: input.durationHours,
          categoryShare: share,
          reserveCoefficient: RESERVE_COEFFICIENT,
        },
      },
      110 + index * 10,
    ));
  });

  const selectedAlcohol = ALCOHOL_CATEGORIES.filter((category) => (
    input.drinkCategories.includes(category)
  ));
  const alcoholServingsPerGuest = Math.min(6, 2 + 0.5 * input.durationHours);
  const alcoholShares = getAlcoholShares(selectedAlcohol);

  selectedAlcohol.forEach((category, index) => {
    const share = alcoholShares[category] ?? 0;
    const liters = input.alcoholGuestsCount
      * alcoholServingsPerGuest
      * share
      * ALCOHOL_SERVING_LITERS[category]
      * RESERVE_COEFFICIENT;

    if (liters === 0) return;

    targets.push(createTarget(
      category,
      roundTo(liters, 0.1),
      'l',
      {
        rule: 'alcohol',
        factors: {
          alcoholGuestsCount: input.alcoholGuestsCount,
          servingsPerGuest: alcoholServingsPerGuest,
          categoryShare: share,
          servingLiters: ALCOHOL_SERVING_LITERS[category],
          reserveCoefficient: RESERVE_COEFFICIENT,
        },
      },
      130 + index * 10,
    ));
  });

  const chilledDrinkLiters = targets
    .filter((target) => ['water', 'juice', 'soda', 'beer', 'wine', 'spirits'].includes(target.category))
    .reduce((total, target) => total + target.targetQuantity, 0);
  const iceSeasonCoefficient = season === 'summer' ? 1.2 : 1;
  const iceLocationCoefficient = input.location === 'outdoor' ? 1.1 : 1;
  const baseIceKg = Math.max(
    MINIMUM_ICE_KG,
    guestCount * ICE_PER_GUEST_KG + chilledDrinkLiters * ICE_PER_CHILLED_LITER_KG,
  );
  const iceKg = roundTo(
    baseIceKg * iceSeasonCoefficient * iceLocationCoefficient,
    0.5,
  );

  targets.push(createTarget(
    'ice',
    iceKg,
    'kg',
    {
      rule: 'ice',
      factors: {
        guestCount,
        chilledDrinkLiters: Number(chilledDrinkLiters.toFixed(2)),
        baseIceKg: Number(baseIceKg.toFixed(2)),
        seasonCoefficient: iceSeasonCoefficient,
        locationCoefficient: iceLocationCoefficient,
      },
    },
    170,
  ));

  const reserveSupplies = Math.floor(guestCount / SUPPLY_RESERVE_GROUP_SIZE);
  const platesPerGuest = PLATES_PER_GUEST[input.menuFormat];
  const plateCount = Math.ceil(guestCount * platesPerGuest) + reserveSupplies;
  const alcoholCupCount = selectedAlcohol.length > 0 ? input.alcoholGuestsCount : 0;
  const cupCount = guestCount + alcoholCupCount + reserveSupplies;

  targets.push(createTarget(
    'plates',
    plateCount,
    'pcs',
    {
      rule: 'supplies',
      factors: { guestCount, perGuest: platesPerGuest, reserveSupplies },
    },
    180,
  ));
  targets.push(createTarget(
    'cups',
    cupCount,
    'pcs',
    {
      rule: 'supplies',
      factors: { guestCount, alcoholCupCount, reserveSupplies },
    },
    190,
  ));

  return {
    rulesVersion: CALCULATION_RULES_VERSION,
    season,
    equivalentGuests: Number(equivalentGuests.toFixed(2)),
    targets: targets.sort((left, right) => left.sortOrder - right.sortOrder),
    checklistItems: generateChecklist(input.eventType),
  };
}
