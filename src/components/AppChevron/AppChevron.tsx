import { Image } from 'expo-image';

export type AppChevronDirection = 'down' | 'left' | 'right' | 'up';

type AppChevronProps = {
  color: string;
  direction?: AppChevronDirection;
  size?: number;
};

const DIRECTION_ROTATION: Record<AppChevronDirection, string> = {
  down: '90deg',
  left: '180deg',
  right: '0deg',
  up: '-90deg',
};

export default function AppChevron({
  color,
  direction = 'right',
  size = 20,
}: AppChevronProps) {
  return (
    <Image
      accessibilityElementsHidden
      contentFit="contain"
      importantForAccessibility="no-hide-descendants"
      source={require('../../../assets/svg/ic_chevron.svg')}
      style={{
        width: size,
        height: size,
        transform: [{ rotate: DIRECTION_ROTATION[direction] }],
      }}
      tintColor={color}
    />
  );
}
