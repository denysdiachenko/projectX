import { Image } from 'expo-image';

type CalendarOutlinedProps = {
  color: string;
  size?: number;
};

export default function CalendarOutlined({
  color,
  size = 22,
}: CalendarOutlinedProps) {
  return (
    <Image
      accessibilityElementsHidden
      contentFit="contain"
      importantForAccessibility="no-hide-descendants"
      source={require('../../../assets/svg/ic_calendar_outlined.svg')}
      style={{ width: size, height: size }}
      tintColor={color}
    />
  );
}
