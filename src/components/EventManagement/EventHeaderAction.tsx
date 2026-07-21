import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable } from 'react-native';

import { ROUTES } from '@/constants/routes';
import { getStringRouteParam } from '@/helpers/getStringRouteParam';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import { deleteEvent } from '@/services/event-plan';
import { showToast } from '@/services/toast';

import EventActionsSheet from './EventActionsSheet';
import { createEventManagementStyles } from './styles';

export default function EventHeaderAction() {
  const params = useGlobalSearchParams<{ eventId?: string | string[] }>();
  const eventId = getStringRouteParam(params.eventId);
  const router = useRouter();
  const theme = useAppTheme();
  const { translations } = useAppLocalization();
  const copy = translations.eventManagement;
  const styles = useMemo(() => createEventManagementStyles(theme, 0), [theme]);
  const [actionsVisible, setActionsVisible] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const closeActions = () => {
    setActionsVisible(false);
    setShowDeleteConfirmation(false);
  };

  const confirmDelete = async () => {
    if (isDeleting) return;

    if (!eventId) {
      showToast({
        message: copy.deleteErrorMessage,
        title: copy.deleteErrorTitle,
        type: 'error',
      });
      return;
    }

    setIsDeleting(true);

    try {
      await deleteEvent(eventId);
      closeActions();
      showToast({
        message: copy.deleteSuccessMessage,
        title: copy.deleteSuccessTitle,
        type: 'success',
      });
      router.dismissTo(ROUTES.myEvents);
    } catch {
      showToast({
        message: copy.deleteErrorMessage,
        title: copy.deleteErrorTitle,
        type: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Pressable
        accessibilityLabel={copy.actionsLabel}
        accessibilityRole="button"
        onPress={() => {
          setShowDeleteConfirmation(false);
          setActionsVisible(true);
        }}
        style={({ pressed }) => [styles.headerButton, pressed && styles.actionPressed]}>
        <AntDesign color={theme.colors.text.primary} name="ellipsis" size={24} />
      </Pressable>
      <EventActionsSheet
        deleting={isDeleting}
        showDeleteConfirmation={showDeleteConfirmation}
        visible={actionsVisible}
        onClose={closeActions}
        onConfirmDelete={() => void confirmDelete()}
        onDelete={() => setShowDeleteConfirmation(true)}
        onEdit={() => {
          if (!eventId) {
            showToast({
              message: copy.updateErrorMessage,
              title: copy.updateErrorTitle,
              type: 'error',
            });
            return;
          }

          closeActions();
          router.push(ROUTES.editEvent(eventId));
        }}
      />
    </>
  );
}
