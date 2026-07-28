import AppSegmentedControl from '@/components/AppSegmentedControl/AppSegmentedControl';
import { useAppLocalization } from '@/hooks/app-localization';

export type MyEventsViewMode = 'calendar' | 'list';

export default function MyEventsViewToggle({
  onChange,
  value,
}: {
  onChange: (value: MyEventsViewMode) => void;
  value: MyEventsViewMode;
}) {
  const { translations } = useAppLocalization();
  const copy = translations.myEvents;

  return (
    <AppSegmentedControl
      onChange={onChange}
      options={[
        { icon: 'unordered-list', label: copy.listView, value: 'list' },
        { icon: 'calendar', label: copy.calendarView, value: 'calendar' },
      ]}
      value={value}
    />
  );
}
