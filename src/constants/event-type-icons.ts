import type { AntDesignIconName } from '@react-native-vector-icons/ant-design';

const EVENT_TYPE_ICONS: Record<string, AntDesignIconName> = {
  bbq: 'fire',
  birthday: 'gift',
  home_party: 'home',
};

export function getEventTypeIcon(eventType: string): AntDesignIconName {
  return EVENT_TYPE_ICONS[eventType] ?? 'calendar';
}
