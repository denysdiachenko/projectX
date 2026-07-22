import type { MeasurementUnit } from '@/services/measurement-units';

export function convertShoppingQuantity(
  quantity: number,
  fromUnit: string,
  toUnit: string,
  units: MeasurementUnit[],
) {
  const from = units.find((unit) => unit.code === fromUnit);
  const to = units.find((unit) => unit.code === toUnit);

  if (!from || !to || from.dimension !== to.dimension) return 0;

  return (quantity * Number(from.base_multiplier)) / Number(to.base_multiplier);
}

export function parseShoppingNumber(value: string) {
  return Number(value.replace(',', '.'));
}
