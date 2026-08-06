import type {
  CreateEventDraft,
  SupplyType,
} from '@/components/CreateEventScreen/types';
import {
  calculateEventPlan,
  type CalculationEventType,
  type CalculationMenuFormat,
  type EventCalculationInput,
} from '@/calculation-engine';
import {
  combineEventDateAndTimeInTimeZone,
  splitEventDateAndTime,
} from '@/helpers/eventDateTime';
import { getDeviceTimeZone } from '@/helpers/getDeviceTimeZone';
import { supabase } from '@/lib/supabase';
import type { Json, Tables, TablesInsert } from '@/types/database';

import { getMeasurementUnits, type MeasurementUnit } from './measurement-units';

export type EventListItem = {
  adults_count: number;
  checklist_items: {
    is_completed: boolean;
  }[];
  children_count: number;
  completed_at: string | null;
  duration_hours: number;
  event_type: string;
  id: string;
  is_owner: boolean;
  location: string;
  location_text: string | null;
  name: string;
  shopping_items: {
    is_purchased: boolean;
  }[];
  starts_at: string;
  status: string;
  time_zone: string;
};

export type EventPlanDetails = {
  adultsCount: number;
  childrenCount: number;
  completedAt: string | null;
  durationHours: number;
  id: string;
  location: string;
  locationText: string | null;
  name: string;
  season: string | null;
  startsAt: string;
  status: string;
  targets: {
    category: string;
    id: string;
    sortOrder: number;
    targetQuantity: number;
    unit: string;
  }[];
  timeZone: string;
  units: MeasurementUnit[];
};

export type BudgetOutcome = 'over_budget' | 'unknown' | 'within_budget';

export type EventCompletionDetails = {
  budgetAmount: number | null;
  completedAt: string | null;
  durationHours: number;
  startsAt: string;
  status: string;
  unfinishedChecklistItems: number;
  unfinishedShoppingItems: number;
};

const EVENT_TYPE_MAP: Record<CreateEventDraft['eventType'], CalculationEventType> = {
  birthday: 'birthday',
  bbq: 'bbq',
  homeParty: 'home_party',
  other: 'other',
};

const MENU_FORMAT_MAP: Record<CreateEventDraft['menuFormat'], CalculationMenuFormat> = {
  snacks: 'snacks',
  buffet: 'buffet',
  full: 'full_menu',
};

export class CreateEventPlanError extends Error {
  constructor() {
    super('Unable to create event plan');
    this.name = 'CreateEventPlanError';
  }
}

export class UpdateEventPlanError extends Error {
  constructor() {
    super('Unable to update event plan');
    this.name = 'UpdateEventPlanError';
  }
}

export async function getUserEvents() {
  const [eventsResult, sessionResult] = await Promise.all([
    supabase
    .from('events')
    .select(`
      id,
      owner_id:user_id,
      name,
      event_type,
      starts_at,
      time_zone,
      duration_hours,
      status,
      completed_at,
      location,
      location_text,
      adults_count,
      children_count,
      checklist_items!checklist_items_event_owner_fkey (
        is_completed
      ),
      shopping_items!shopping_items_event_owner_fkey (
        is_purchased
      )
    `)
      .order('starts_at', { ascending: true }),
    supabase.auth.getSession(),
  ]);
  const { data, error } = eventsResult;

  if (error) {
    throw error;
  }

  const userId = sessionResult.data.session?.user.id;

  return data.map(({ owner_id: ownerId, ...event }) => ({
    ...event,
    is_owner: ownerId === userId,
  })) satisfies EventListItem[];
}

export async function getEventPlan(eventId: string): Promise<EventPlanDetails> {
  const [eventResult, units] = await Promise.all([
    supabase
      .from('events')
      .select(`
        id,
        name,
        starts_at,
        time_zone,
        duration_hours,
        status,
        completed_at,
        location,
        location_text,
        adults_count,
        children_count,
        current_snapshot:calculation_snapshots!events_current_snapshot_fkey (
          result_snapshot,
          targets:plan_targets!plan_targets_snapshot_owner_fkey (
            id,
            category,
            target_quantity,
            unit,
            sort_order
          )
        )
      `)
      .eq('id', eventId)
      .single(),
    getMeasurementUnits(),
  ]);
  const { data, error } = eventResult;

  if (error || !data.current_snapshot) {
    throw error ?? new Error('Event calculation snapshot is missing');
  }

  const snapshot = data.current_snapshot;

  return {
    adultsCount: data.adults_count,
    childrenCount: data.children_count,
    completedAt: data.completed_at,
    durationHours: data.duration_hours,
    id: data.id,
    location: data.location,
    locationText: data.location_text,
    name: data.name,
    season: getSnapshotSeason(snapshot.result_snapshot),
    startsAt: data.starts_at,
    status: data.status,
    targets: snapshot.targets
      .map((target) => ({
        category: target.category,
        id: target.id,
        sortOrder: target.sort_order,
        targetQuantity: target.target_quantity,
        unit: target.unit,
      }))
      .sort((left, right) => left.sortOrder - right.sortOrder),
    timeZone: data.time_zone,
    units,
  };
}

export async function getEventCompletionDetails(
  eventId: string,
): Promise<EventCompletionDetails> {
  if (!UUID_PATTERN.test(eventId)) {
    throw new Error('Invalid event id');
  }

  const { data, error } = await supabase
    .from('events')
    .select(`
      starts_at,
      duration_hours,
      status,
      completed_at,
      budget_amount,
      checklist_items!checklist_items_event_owner_fkey (
        is_completed
      ),
      shopping_items!shopping_items_event_owner_fkey (
        is_purchased
      )
    `)
    .eq('id', eventId)
    .single();

  if (error) throw error;

  return {
    budgetAmount: data.budget_amount,
    completedAt: data.completed_at,
    durationHours: data.duration_hours,
    startsAt: data.starts_at,
    status: data.status,
    unfinishedChecklistItems: data.checklist_items.filter(
      (item) => !item.is_completed,
    ).length,
    unfinishedShoppingItems: data.shopping_items.filter(
      (item) => !item.is_purchased,
    ).length,
  };
}

export async function completeEvent(
  eventId: string,
  budgetOutcome: BudgetOutcome | null,
) {
  if (!UUID_PATTERN.test(eventId)) {
    throw new Error('Invalid event id');
  }

  const completedAt = new Date().toISOString();
  const { data, error } = await supabase
    .from('events')
    .update({
      budget_feedback_at: budgetOutcome ? completedAt : null,
      budget_outcome: budgetOutcome,
      completed_at: completedAt,
      status: 'completed',
    })
    .eq('id', eventId)
    .select('id, completed_at')
    .single();

  if (error) throw error;
  return data;
}

export async function reopenEvent(eventId: string) {
  if (!UUID_PATTERN.test(eventId)) {
    throw new Error('Invalid event id');
  }

  const { data, error } = await supabase
    .from('events')
    .update({
      budget_feedback_at: null,
      budget_outcome: null,
      completed_at: null,
      status: 'planned',
    })
    .eq('id', eventId)
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

export async function getEventRulesVersion(eventId: string) {
  if (!UUID_PATTERN.test(eventId)) {
    throw new Error('Invalid event id');
  }

  const { data, error } = await supabase
    .from('events')
    .select(`
      current_snapshot:calculation_snapshots!events_current_snapshot_fkey (
        rules_version
      )
    `)
    .eq('id', eventId)
    .single();

  if (error || !data.current_snapshot) {
    throw error ?? new Error('Event calculation snapshot is missing');
  }

  return data.current_snapshot.rules_version;
}

export async function getEventCalendarDetails(eventId: string) {
  if (!UUID_PATTERN.test(eventId)) {
    throw new Error('Invalid event id');
  }

  const { data, error } = await supabase
    .from('events')
    .select('name, starts_at, time_zone, duration_hours, location_text, notes')
    .eq('id', eventId)
    .single();

  if (error) throw error;

  return {
    durationHours: data.duration_hours,
    location: data.location_text,
    notes: data.notes,
    startsAt: data.starts_at,
    timeZone: data.time_zone,
    title: data.name,
  };
}

export async function getEventDraft(eventId: string): Promise<CreateEventDraft> {
  const { data, error } = await supabase
    .from('events')
    .select(`
      name,
      event_type,
      starts_at,
      time_zone,
      duration_hours,
      location,
      location_text,
      adults_count,
      children_count,
      alcohol_guests_count,
      menu_format,
      drink_categories,
      budget_amount,
      notes,
      current_snapshot:calculation_snapshots!events_current_snapshot_fkey (
        normalized_input
      )
    `)
    .eq('id', eventId)
    .single();

  if (error) throw error;

  const dateTime = splitEventDateAndTime(data.starts_at, data.time_zone);
  const usesPresetDuration = [3, 5, 8].includes(data.duration_hours);

  return {
    adults: data.adults_count,
    alcoholGuests: data.alcohol_guests_count,
    budget: data.budget_amount?.toString() ?? '',
    children: data.children_count,
    customDuration: usesPresetDuration ? '' : String(data.duration_hours),
    date: dateTime.date,
    drinks: data.drink_categories as CreateEventDraft['drinks'],
    duration: usesPresetDuration ? data.duration_hours : 'custom',
    eventType: reverseEventType(data.event_type),
    location: data.location as CreateEventDraft['location'],
    locationText: data.location_text ?? '',
    menuFormat: reverseMenuFormat(data.menu_format),
    name: data.name,
    note: data.notes ?? '',
    supplies: getDraftSupplies(data.current_snapshot?.normalized_input),
    time: dateTime.time,
  };
}

export async function createEventPlan(draft: CreateEventDraft) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new CreateEventPlanError();
  }

  const calculationInput = createCalculationInput(draft);
  const calculationResult = calculateEventPlan(calculationInput);
  const eventInsert = createEventInsert(draft, calculationInput, user.id);
  let eventId: string | undefined;

  try {
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert(eventInsert)
      .select('id')
      .single();

    if (eventError) throw eventError;
    eventId = event.id;
    const createdEventId = event.id;

    const { data: snapshot, error: snapshotError } = await supabase
      .from('calculation_snapshots')
      .insert({
        event_id: createdEventId,
        normalized_input: toJson({
          ...calculationInput,
          startsAt: calculationInput.startsAt.toISOString(),
        }),
        result_snapshot: toJson(calculationResult),
        rules_version: calculationResult.rulesVersion,
        sequence_number: 1,
        user_id: user.id,
      })
      .select('id')
      .single();

    if (snapshotError) throw snapshotError;

    const targetRows: TablesInsert<'plan_targets'>[] = calculationResult.targets.map(
      (target) => ({
        category: target.category,
        event_id: createdEventId,
        explanation: toJson(target.explanation),
        snapshot_id: snapshot.id,
        sort_order: target.sortOrder,
        target_quantity: target.targetQuantity,
        unit: target.unit,
        user_id: user.id,
      }),
    );
    const { error: targetsError } = await supabase.from('plan_targets').insert(targetRows);

    if (targetsError) throw targetsError;

    const checklistRows: TablesInsert<'checklist_items'>[] = calculationResult.checklistItems.map(
      (item) => ({
        event_id: createdEventId,
        item_key: item.key,
        snapshot_id: snapshot.id,
        sort_order: item.sortOrder,
        source: 'generated',
        timing_group: item.timingGroup,
        user_id: user.id,
      }),
    );
    if (checklistRows.length > 0) {
      const { error: checklistError } = await supabase
        .from('checklist_items')
        .insert(checklistRows);

      if (checklistError) throw checklistError;
    }

    const { data: updatedEvent, error: updateError } = await supabase
      .from('events')
      .update({ current_snapshot_id: snapshot.id })
      .eq('id', createdEventId)
      .select('id')
      .single();

    if (updateError) throw updateError;

    return {
      eventId: updatedEvent.id,
      result: calculationResult,
    };
  } catch {
    if (eventId) {
      await supabase.from('events').delete().eq('id', eventId);
    }

    throw new CreateEventPlanError();
  }
}

export async function updateEventPlan(eventId: string, draft: CreateEventDraft) {
  const { data: currentEvent, error: eventError } = await supabase
    .from('events')
    .select('time_zone')
    .eq('id', eventId)
    .single();

  if (eventError) throw new UpdateEventPlanError();

  const calculationInput = createCalculationInput(draft, currentEvent.time_zone);
  const calculationResult = calculateEventPlan(calculationInput);
  const eventData = createEventValues(draft, calculationInput);
  const { data, error } = await supabase.rpc('update_event_plan', {
    p_checklist_items: toJson(calculationResult.checklistItems.map((item) => ({
      item_key: item.key,
      sort_order: item.sortOrder,
      timing_group: item.timingGroup,
    }))),
    p_event_data: toJson(eventData),
    p_event_id: eventId,
    p_normalized_input: toJson({
      ...calculationInput,
      startsAt: calculationInput.startsAt.toISOString(),
    }),
    p_result_snapshot: toJson(calculationResult),
    p_rules_version: calculationResult.rulesVersion,
    p_targets: toJson(calculationResult.targets.map((target) => ({
      category: target.category,
      explanation: target.explanation,
      sort_order: target.sortOrder,
      target_quantity: target.targetQuantity,
      unit: target.unit,
    }))),
  });

  if (error || !data) throw new UpdateEventPlanError();

  return data;
}

export async function deleteEvent(eventId: string) {
  if (!UUID_PATTERN.test(eventId)) {
    throw new Error('Invalid event id');
  }

  const { data, error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId)
    .select('id')
    .single();

  if (error) throw error;

  return data.id;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function createCalculationInput(
  draft: CreateEventDraft,
  timeZone = getDeviceTimeZone(),
): EventCalculationInput {
  return {
    eventType: EVENT_TYPE_MAP[draft.eventType],
    startsAt: combineEventDateAndTimeInTimeZone(draft.date, draft.time, timeZone),
    timeZone,
    durationHours: draft.duration === 'custom'
      ? Number(draft.customDuration)
      : draft.duration,
    location: draft.location,
    adultsCount: draft.adults,
    childrenCount: draft.children,
    alcoholGuestsCount: draft.alcoholGuests,
    menuFormat: MENU_FORMAT_MAP[draft.menuFormat],
    drinkCategories: draft.drinks,
    supplyCategories: draft.supplies,
  };
}

function createEventInsert(
  draft: CreateEventDraft,
  calculationInput: EventCalculationInput,
  userId: string,
): TablesInsert<'events'> {
  return { ...createEventValues(draft, calculationInput), user_id: userId };
}

function createEventValues(
  draft: CreateEventDraft,
  calculationInput: EventCalculationInput,
): Omit<TablesInsert<'events'>, 'user_id'> {
  const normalizedBudget = draft.budget.replace(/\s/g, '');

  return {
    adults_count: calculationInput.adultsCount,
    alcohol_guests_count: calculationInput.alcoholGuestsCount,
    budget_amount: normalizedBudget ? Number(normalizedBudget) : null,
    children_count: calculationInput.childrenCount,
    drink_categories: calculationInput.drinkCategories,
    duration_hours: calculationInput.durationHours,
    event_type: calculationInput.eventType,
    location: calculationInput.location,
    location_text: draft.locationText.trim() || null,
    menu_format: calculationInput.menuFormat,
    name: draft.name.trim(),
    notes: draft.note.trim() || null,
    starts_at: calculationInput.startsAt.toISOString(),
    time_zone: calculationInput.timeZone,
  };
}

function reverseEventType(value: Tables<'events'>['event_type']): CreateEventDraft['eventType'] {
  if (value === 'home_party') return 'homeParty';
  return value as CreateEventDraft['eventType'];
}

function reverseMenuFormat(value: Tables<'events'>['menu_format']): CreateEventDraft['menuFormat'] {
  if (value === 'full_menu') return 'full';
  return value as CreateEventDraft['menuFormat'];
}

function toJson(value: unknown): Json {
  return JSON.parse(JSON.stringify(value)) as Json;
}

const SUPPLY_CATEGORIES: SupplyType[] = ['ice', 'plates', 'cups'];

function getDraftSupplies(input: Json | null | undefined): SupplyType[] {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return [...SUPPLY_CATEGORIES];
  }

  const categories = input.supplyCategories;
  if (!Array.isArray(categories)) {
    return [...SUPPLY_CATEGORIES];
  }

  return categories.filter(
    (category): category is SupplyType =>
      typeof category === 'string'
      && SUPPLY_CATEGORIES.includes(category as SupplyType),
  );
}

function getSnapshotSeason(snapshot: Json) {
  if (
    snapshot
    && typeof snapshot === 'object'
    && !Array.isArray(snapshot)
    && typeof snapshot.season === 'string'
  ) {
    return snapshot.season;
  }

  return null;
}
