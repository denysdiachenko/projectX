import AppSegmentedControl from '@/components/AppSegmentedControl/AppSegmentedControl';
import { useAppLocalization } from '@/hooks/app-localization';

export type MyEventsPeriod = 'past' | 'upcoming';

export default function MyEventsPeriodToggle({
  onChange,
  value,
}: {
  onChange: (value: MyEventsPeriod) => void;
  value: MyEventsPeriod;
}) {
  const { translations } = useAppLocalization();
  const copy = translations.myEvents;

  return (
    <AppSegmentedControl
      onChange={onChange}
      options={[
        { icon: 'calendar', label: copy.upcomingEvents, value: 'upcoming' },
        { icon: 'history', label: copy.pastEvents, value: 'past' },
      ]}
      value={value}
    />
  );
}
