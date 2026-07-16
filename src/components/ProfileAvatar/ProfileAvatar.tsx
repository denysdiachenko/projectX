import {AntDesign} from '@react-native-vector-icons/ant-design';
import {Image} from 'expo-image';
import {useMemo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {useAppTheme} from '@/hooks/app-theme';
import {getAvatarUri} from '@/services/profile';
import {getUserInitial} from '@/utils/user';

type ProfileAvatarProps = {
  avatarUrl?: string | null;
  localUri?: string | null;
  displayName: string;
  size?: 72 | 96;
  onPress?: () => void;
  accessibilityLabel?: string;
};

export default function ProfileAvatar({
  avatarUrl,
  localUri,
  displayName,
  size = 72,
  onPress,
  accessibilityLabel,
}: ProfileAvatarProps) {
  const theme = useAppTheme();
  const imageUri = localUri ?? getAvatarUri(avatarUrl);
  const styles = useMemo(
    () =>
      StyleSheet.create({
        pressable: {
          width: size + theme.spacing.x1,
          height: size + theme.spacing.x1,
        },
        avatar: {
          width: size,
          height: size,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: size / 2,
          backgroundColor: theme.colors.background.accent,
        },
        image: {
          width: size,
          height: size,
        },
        initial: {
          ...(size === 96 ? theme.typography.heading2 : theme.typography.heading3),
          color: theme.colors.text.onBrand,
        },
        editBadge: {
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: 28,
          height: 28,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: theme.colors.border.brand,
          borderRadius: 14,
          backgroundColor: theme.colors.background.surface,
        },
        pressed: {
          opacity: 0.76,
        },
      }),
    [size, theme],
  );

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={onPress ? 'button' : 'image'}
      disabled={!onPress}
      onPress={onPress}
      style={({pressed}) => [styles.pressable, pressed && styles.pressed]}>
      <View style={styles.avatar}>
        {imageUri ? (
          <Image contentFit="cover" source={{uri: imageUri}} style={styles.image}/>
        ) : (
          <Text style={styles.initial}>{getUserInitial(displayName)}</Text>
        )}
      </View>
      {onPress ? (
        <View pointerEvents="none" style={styles.editBadge}>
          <AntDesign name="edit" color={theme.colors.text.brand} size={15}/>
        </View>
      ) : null}
    </Pressable>
  );
}
