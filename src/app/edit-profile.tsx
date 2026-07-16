import { AntDesign } from '@react-native-vector-icons/ant-design';
import { yupResolver } from '@hookform/resolvers/yup';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton/AppButton';
import AppInput from '@/components/AppInput/AppInput';
import ProfileAvatar from '@/components/ProfileAvatar/ProfileAvatar';
import { createProfileEditStyles } from '@/components/ProfileEditScreen/styles';
import { useAppAuth } from '@/hooks/app-auth';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import { getUserProfile, saveUserProfile, type UserProfile } from '@/services/profile';
import { showToast } from '@/services/toast';
import { getUserDisplayName } from '@/utils/user';
import {
  createProfileSchema,
  type ProfileFormValues,
} from '@/validation-schemas/profile-schema';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useAppAuth();
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const copy = translations.profile;
  const styles = useMemo(() => createProfileEditStyles(theme), [theme]);
  const schema = useMemo(() => createProfileSchema(copy.validation), [copy.validation]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [avatarAsset, setAvatarAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    defaultValues: { displayName: '' },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    let active = true;

    void getUserProfile(user.id)
      .then((nextProfile) => {
        if (!active) {
          return;
        }

        setProfile(nextProfile);
        reset({
          displayName:
            nextProfile.display_name?.trim() || getUserDisplayName(user, copy.defaultName),
        });
      })
      .catch(() => {
        showToast({
          message: copy.loadError,
          title: copy.loadErrorTitle,
          type: 'error',
        });
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [copy.defaultName, copy.loadError, copy.loadErrorTitle, reset, user]);

  const pickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      showToast({
        message: copy.avatarPermissionError,
        title: copy.avatarPermissionTitle,
        type: 'warning',
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      mediaTypes: ['images'],
      quality: 0.8,
      selectionLimit: 1,
    });

    if (!result.canceled) {
      setAvatarAsset(result.assets[0]);
    }
  };

  const submitProfile = handleSubmit(async ({ displayName }) => {
    if (!user) {
      return;
    }

    try {
      await saveUserProfile({
        avatarAsset,
        currentAvatarUrl: profile?.avatar_url ?? null,
        displayName,
        userId: user.id,
      });
      showToast({
        message: copy.saveSuccess,
        title: copy.saveSuccessTitle,
        type: 'success',
      });
      router.back();
    } catch {
      showToast({
        message: copy.saveError,
        title: copy.saveErrorTitle,
        type: 'error',
      });
    }
  });

  const displayName =
    profile?.display_name?.trim() || getUserDisplayName(user, copy.defaultName);

  if (isLoading) {
    return (
      <SafeAreaView edges={['right', 'bottom', 'left']} style={styles.screen}>
        <View style={styles.loading}>
          <ActivityIndicator color={theme.colors.background.brand} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['right', 'bottom', 'left']} style={styles.screen}>
      <StatusBar style={theme.statusBar} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.avatarBlock}>
            <ProfileAvatar
              accessibilityLabel={copy.changePhoto}
              avatarUrl={profile?.avatar_url}
              displayName={displayName}
              localUri={avatarAsset?.uri}
              size={96}
              onPress={pickAvatar}
            />
            <Pressable
              accessibilityRole="button"
              disabled={isSubmitting}
              onPress={pickAvatar}
              style={({ pressed }) => pressed && styles.pressed}>
              <Text style={styles.changePhoto}>{copy.changePhoto}</Text>
            </Pressable>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="displayName"
              render={({ field: { onBlur, onChange, value } }) => (
                <AppInput
                  autoCapitalize="words"
                  editable={!isSubmitting}
                  error={errors.displayName?.message}
                  label={copy.nameLabel}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  returnKeyType="done"
                  value={value}
                />
              )}
            />
            <AppInput
              editable={false}
              endAdornment={
                <AntDesign name="lock" color={theme.colors.text.secondary} size={18} />
              }
              label={copy.emailLabel}
              value={user?.email ?? copy.emailPlaceholder}
            />
          </View>

          <View style={styles.saveButton}>
            <AppButton
              disabled={isSubmitting}
              label={isSubmitting ? copy.saving : copy.save}
              loading={isSubmitting}
              onPress={submitProfile}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
