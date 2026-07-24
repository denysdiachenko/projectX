import EventTabPlaceholder from '@/components/EventPlanScreen/EventTabPlaceholder';
import { useAppLocalization } from '@/hooks/app-localization';

export default function EventGuestsScreen() {
  const { translations } = useAppLocalization();
  const copy = translations.eventPlan.guestsPlaceholder;

  return (
    <EventTabPlaceholder
      icon="team"
      message={copy.message}
      title={copy.title}
    />
  );
}
