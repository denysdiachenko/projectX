import { useMemo, useState, type ReactNode } from 'react';
import { Pressable, Text, TextInput, type TextInputProps, View } from 'react-native';

import { useAppTheme } from '@/hooks/app-theme';

import createStyles from './styles';

type AppInputProps = Omit<TextInputProps, 'style'> & {
  label: string;
  actionLabel?: string;
  actionIcon?: ReactNode;
  error?: string;
  onActionPress?: () => void;
};

export default function AppInput({
  label,
  actionLabel,
  actionIcon,
  error,
  onActionPress,
  onBlur,
  onFocus,
  ...inputProps
}: AppInputProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, focused && styles.focusedField, error && styles.errorField]}>
        <TextInput
          {...inputProps}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          placeholderTextColor={theme.colors.text.muted}
          selectionColor={theme.colors.border.brand}
          style={[styles.input, actionLabel && styles.inputWithAction]}
        />
        {actionLabel ? (
          <Pressable
            accessibilityLabel={actionLabel}
            accessibilityRole="button"
            hitSlop={theme.spacing.x3}
            onPress={onActionPress}
            style={styles.action}>
            {actionIcon ?? <Text style={styles.actionLabel}>{actionLabel}</Text>}
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.errorLabel}>{error}</Text> : null}
    </View>
  );
}
