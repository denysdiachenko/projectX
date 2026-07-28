import AppSegmentedControl, {
  type AppSegmentedControlOption,
} from '@/components/AppSegmentedControl/AppSegmentedControl';
import { useAppLocalization } from '@/hooks/app-localization';

export type ShoppingViewMode = 'grouped' | 'list';

type ShoppingViewToggleProps = {
  value: ShoppingViewMode;
  onChange: (value: ShoppingViewMode) => void;
};

export default function ShoppingViewToggle({ value, onChange }: ShoppingViewToggleProps) {
  const { translations } = useAppLocalization();
  const copy = translations.shopping;
  const options: AppSegmentedControlOption<ShoppingViewMode>[] = [
    { icon: 'appstore', label: copy.groupedView, value: 'grouped' },
    { icon: 'unordered-list', label: copy.listView, value: 'list' },
  ];

  return (
    <AppSegmentedControl onChange={onChange} options={options} value={value} />
  );
}
