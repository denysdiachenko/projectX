import { useMemo } from 'react';
import { Text } from 'react-native';

import MyEventsMonthSelector from '@/components/MyEventsScreen/MyEventsMonthSelector';
import MyEventsPeriodToggle, {
  type MyEventsPeriod,
} from '@/components/MyEventsScreen/MyEventsPeriodToggle';
import type { EventMonth } from '@/components/MyEventsScreen/month-helpers';
import { createMyEventsStyles } from '@/components/MyEventsScreen/styles';
import MyEventsViewToggle, {
  type MyEventsViewMode,
} from '@/components/MyEventsScreen/MyEventsViewToggle';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

type MyEventsHeaderProps = {
  activeMonth: EventMonth;
  displayName: string;
  eventCountLabel: string;
  eventYears: number[];
  hasEvents: boolean;
  onMonthChange: (value: EventMonth) => void;
  onPeriodChange: (value: MyEventsPeriod) => void;
  onViewModeChange: (value: MyEventsViewMode) => void;
  showControls: boolean;
  period: MyEventsPeriod;
  viewMode: MyEventsViewMode;
};

export default function MyEventsHeader({
  activeMonth,
  eventCountLabel,
  eventYears,
  onMonthChange,
  onPeriodChange,
  onViewModeChange,
  showControls,
  period,
  viewMode,
}: MyEventsHeaderProps) {
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const styles = useMemo(() => createMyEventsStyles(theme), [theme]);
  const copy = translations.myEvents;

  return (
    <>
      <Text style={styles.title}>{copy.title}</Text>
      {showControls ? (
        <>
          <MyEventsViewToggle onChange={onViewModeChange} value={viewMode} />
          {viewMode === 'calendar' ? (
            <MyEventsMonthSelector
              eventCountLabel={eventCountLabel}
              eventYears={eventYears}
              onChange={onMonthChange}
              value={activeMonth}
            />
          ) : (
            <MyEventsPeriodToggle onChange={onPeriodChange} value={period} />
          )}
        </>
      ) : null}
    </>
  );
}
