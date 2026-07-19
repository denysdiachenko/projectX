import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ChoiceChip } from '@/components/CreateEventScreen/CreateEventControls';
import {
  CREATE_EVENT_DRINK_OPTIONS,
  CREATE_EVENT_MENU_OPTIONS,
} from '@/constants/create-event';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';

import { createCreateEventStyles } from '../styles';
import type {
  CreateEventDraft,
  DrinkType,
  UpdateCreateEventDraft,
} from '../types';

type MenuStepProps = {
  draft: Pick<CreateEventDraft, 'menuFormat' | 'drinks'>;
  onUpdate: UpdateCreateEventDraft;
};

export default function MenuStep({ draft, onUpdate }: MenuStepProps) {
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const copy = translations.createEvent.menu;
  const styles = useMemo(() => createCreateEventStyles(theme), [theme]);

  const toggleDrink = (drink: DrinkType) => {
    if (drink === 'water') return;

    onUpdate(
      'drinks',
      draft.drinks.includes(drink)
        ? draft.drinks.filter((item) => item !== drink)
        : [...draft.drinks, drink],
    );
  };

  return (
    <>
      <View style={styles.intro}>
        <Text style={styles.title}>{copy.title}</Text>
        <Text style={styles.subtitle}>{copy.subtitle}</Text>
      </View>
      <Text style={styles.fieldLabel}>{copy.format}</Text>
      <View style={styles.menuOptions}>
        {CREATE_EVENT_MENU_OPTIONS.map((format) => {
          const selected = draft.menuFormat === format;

          return (
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              key={format}
              onPress={() => onUpdate('menuFormat', format)}
              style={({ pressed }) => [
                styles.menuOption,
                selected && styles.menuOptionSelected,
                pressed && styles.pressed,
              ]}>
              <AntDesign
                name={format === 'buffet' ? 'star' : format === 'full' ? 'profile' : 'ellipsis'}
                color={selected ? theme.colors.background.brand : theme.colors.text.secondary}
                size={18}
              />
              <Text style={[styles.menuOptionLabel, selected && styles.menuOptionLabelSelected]}>
                {copy[format]}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.menuDescription}>
        <Text style={styles.menuDescriptionText}>{copy.descriptions[draft.menuFormat]}</Text>
      </View>
      <View style={styles.drinksSection}>
        <Text style={styles.fieldLabel}>{copy.drinks}</Text>
        <View style={styles.chips}>
          {CREATE_EVENT_DRINK_OPTIONS.map((drink) => (
            <ChoiceChip
              key={drink}
              label={copy[drink]}
              selected={draft.drinks.includes(drink)}
              onPress={() => toggleDrink(drink)}
            />
          ))}
        </View>
        <Text style={styles.drinksHint}>{copy.waterHint}</Text>
      </View>
    </>
  );
}
