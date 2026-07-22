import type { SupportedLanguage } from '@/localization/types';
import { supabase } from '@/lib/supabase';
import type { Tables } from '@/types/database';

export type MeasurementUnit = Tables<'measurement_units'>;

export async function getMeasurementUnits() {
  const { data, error } = await supabase
    .from('measurement_units')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('code', { ascending: true });

  if (error) throw error;

  return data satisfies MeasurementUnit[];
}

export function getMeasurementUnitLabel(
  code: string,
  units: MeasurementUnit[],
  language: SupportedLanguage,
) {
  const unit = units.find((candidate) => candidate.code === code);

  if (!unit) return code;

  return language === 'uk' ? unit.symbol_uk : unit.symbol_en;
}

export function getAvailableMeasurementUnits(
  units: MeasurementUnit[],
  currentCode?: string,
) {
  const available = units.filter((unit) => unit.is_active);
  const current = units.find((unit) => unit.code === currentCode);

  if (current && !available.some((unit) => unit.code === current.code)) {
    return [...available, current].sort(compareMeasurementUnits);
  }

  return available;
}

function compareMeasurementUnits(left: MeasurementUnit, right: MeasurementUnit) {
  return left.sort_order - right.sort_order || left.code.localeCompare(right.code);
}
