import EventFormScreen from '@/components/CreateEventScreen/EventFormScreen';
import { createInitialEventDraft } from '@/constants/create-event';

export default function CreateEventScreen() {
  return (
    <EventFormScreen
      initialDraft={createInitialEventDraft()}
      mode="create"
    />
  );
}
