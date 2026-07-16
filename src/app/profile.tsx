import { StatusBar } from 'expo-status-bar';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton/AppButton';
import ProfileAvatar from '@/components/ProfileAvatar/ProfileAvatar';
import DeleteAccountSheet from '@/components/ProfileScreen/DeleteAccountSheet';
import ProfileSettingSheet from '@/components/ProfileScreen/ProfileSettingSheet';
import { createProfileStyles } from '@/components/ProfileScreen/styles';
import ProfileRow from '@/components/ProfileRow/ProfileRow';
import { ROUTES } from '@/constants/routes';
import { useAppAuth } from '@/hooks/app-auth';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import type { SupportedLanguage } from '@/localization/types';
import type { ThemeMode } from '@/services/preferences-storage';
import { deleteCurrentAccount, signOutCurrentSession } from '@/services/auth';
import { getUserProfile, type UserProfile } from '@/services/profile';
import { showToast } from '@/services/toast';
import { getUserDisplayName } from '@/utils/user';

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAppAuth();
  const theme = useAppTheme();
  const { language, setLanguage, translations } = useAppLocalization();
  const copy = translations.profile;
  const styles = useMemo(() => createProfileStyles(theme), [theme]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [deleteSheetVisible, setDeleteSheetVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [settingSheet, setSettingSheet] = useState<'language' | 'theme' | null>(null);
  const [isSavingSetting, setIsSavingSetting] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      setProfile(await getUserProfile(user.id));
    } catch {
      showToast({
        message: copy.loadError,
        title: copy.loadErrorTitle,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [copy.loadError, copy.loadErrorTitle, user]);

  useFocusEffect(
    useCallback(() => {
      void loadProfile();
    }, [loadProfile]),
  );

  const displayName =
    profile?.display_name?.trim() || getUserDisplayName(user, copy.defaultName);
  const email = user?.email ?? copy.emailPlaceholder;

  const showUnavailableToast = () => {
    showToast({
      message: copy.unavailableMessage,
      title: copy.unavailableTitle,
      type: 'info',
    });
  };

  const handleLanguageSelect = async (nextLanguage: SupportedLanguage) => {
    if (nextLanguage === language) {
      setSettingSheet(null);
      return;
    }

    setIsSavingSetting(true);

    try {
      await setLanguage(nextLanguage);
      setSettingSheet(null);
    } catch {
      showToast({
        message: copy.settingSaveError,
        title: copy.settingSaveErrorTitle,
        type: 'error',
      });
    } finally {
      setIsSavingSetting(false);
    }
  };

  const handleThemeSelect = (nextMode: ThemeMode) => {
    theme.setThemeMode(nextMode);
    setSettingSheet(null);
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await signOutCurrentSession();
    } catch {
      showToast({
        message: copy.logoutError,
        title: copy.logoutErrorTitle,
        type: 'error',
      });
      setIsSigningOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    try {
      await deleteCurrentAccount();
      setDeleteSheetVisible(false);
    } catch {
      showToast({
        message: copy.deleteError,
        title: copy.deleteErrorTitle,
        type: 'error',
      });
      setIsDeleting(false);
    }
  };

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
    <SafeAreaView edges={['right', 'left']} style={styles.screen}>
      <StatusBar style={theme.statusBar} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.identity}>
          <ProfileAvatar
            accessibilityLabel={copy.editProfile}
            avatarUrl={profile?.avatar_url}
            displayName={displayName}
            onPress={() => router.push(ROUTES.editProfile)}
          />
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        <View style={styles.editButton}>
          <AppButton
            label={copy.editProfile}
            variant="secondary"
            onPress={() => router.push(ROUTES.editProfile)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{copy.settingsSection}</Text>
          <View style={styles.group}>
            <ProfileRow
              divider
              label={copy.language}
              value={copy.languageOptions[language]}
              onPress={() => setSettingSheet('language')}
            />
            <ProfileRow
              label={copy.theme}
              value={copy.themeOptions[theme.mode]}
              onPress={() => setSettingSheet('theme')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{copy.accountSection}</Text>
          <View style={styles.group}>
            <ProfileRow divider label={copy.changePassword} onPress={showUnavailableToast} />
            <ProfileRow
              danger
              label={isSigningOut ? copy.loggingOut : copy.logout}
              onPress={handleSignOut}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{copy.legalSection}</Text>
          <View style={styles.group}>
            <ProfileRow
              divider
              label={copy.privacyPolicy}
              onPress={() => router.push(ROUTES.privacyPolicy)}
            />
            <ProfileRow label={copy.terms} onPress={() => router.push(ROUTES.terms)} />
          </View>
        </View>

        <View style={styles.deleteButton}>
          <AppButton
            label={copy.deleteAccount}
            variant="destructive"
            onPress={() => setDeleteSheetVisible(true)}
          />
        </View>
      </ScrollView>

      <DeleteAccountSheet
        deleting={isDeleting}
        visible={deleteSheetVisible}
        onCancel={() => setDeleteSheetVisible(false)}
        onConfirm={handleDeleteAccount}
      />
      <ProfileSettingSheet
        busy={isSavingSetting}
        options={[
          { label: copy.languageOptions.uk, value: 'uk' },
          { label: copy.languageOptions.en, value: 'en' },
        ]}
        selectedValue={language}
        title={copy.language}
        visible={settingSheet === 'language'}
        onClose={() => setSettingSheet(null)}
        onSelect={handleLanguageSelect}
      />
      <ProfileSettingSheet
        options={[
          { label: copy.themeOptions.system, value: 'system' },
          { label: copy.themeOptions.light, value: 'light' },
          { label: copy.themeOptions.dark, value: 'dark' },
        ]}
        selectedValue={theme.mode}
        title={copy.theme}
        visible={settingSheet === 'theme'}
        onClose={() => setSettingSheet(null)}
        onSelect={handleThemeSelect}
      />
    </SafeAreaView>
  );
}
