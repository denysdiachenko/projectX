import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable } from 'react-native';

import { ROUTES } from '@/constants/routes';
import { getStringRouteParam } from '@/helpers/getStringRouteParam';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import {
  addEventToDeviceCalendar,
  type DeviceCalendarEvent,
} from '@/services/device-calendar';
import {
  deleteEvent,
  getEventCalendarDetails,
  getEventRulesVersion,
} from '@/services/event-plan';
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
  const [isAddingToCalendar, setIsAddingToCalendar] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [versionState, setVersionState] = useState<{
    eventId: string;
    loading: boolean;
    value: string | null;
  }>({
    eventId: '',
    loading: false,
    value: null,
  });
  const versionRequestId = useRef(0);
  const pendingCalendarEvent = useRef<DeviceCalendarEvent | null>(null);
  const calendarFallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCurrentVersionLoading = versionState.eventId === eventId && versionState.loading;
  const currentRulesVersion = versionState.eventId === eventId ? versionState.value : null;

  useEffect(() => () => {
    if (calendarFallbackTimer.current) {
      clearTimeout(calendarFallbackTimer.current);
    }
  }, []);

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

  const openPendingCalendarEvent = async () => {
    const event = pendingCalendarEvent.current;
    if (!event) return;

    pendingCalendarEvent.current = null;
    if (calendarFallbackTimer.current) {
      clearTimeout(calendarFallbackTimer.current);
      calendarFallbackTimer.current = null;
    }

    try {
      const result = await addEventToDeviceCalendar(event);

      if (result.saved) {
        showToast({
          message: copy.calendarSuccessMessage,
          title: copy.calendarSuccessTitle,
          type: 'success',
        });
      }
    } catch {
      showToast({
        message: copy.calendarErrorMessage,
        title: copy.calendarErrorTitle,
        type: 'error',
      });
    } finally {
      setIsAddingToCalendar(false);
    }
  };

  const addToCalendar = async () => {
    if (isAddingToCalendar || !eventId) return;

    setIsAddingToCalendar(true);

    try {
      pendingCalendarEvent.current = await getEventCalendarDetails(eventId);
      closeActions();
      calendarFallbackTimer.current = setTimeout(() => {
        void openPendingCalendarEvent();
      }, 350);
    } catch {
      setIsAddingToCalendar(false);
      showToast({
        message: copy.calendarErrorMessage,
        title: copy.calendarErrorTitle,
        type: 'error',
      });
    }
  };

  const openActions = () => {
    setShowDeleteConfirmation(false);
    setActionsVisible(true);

    if (!eventId || currentRulesVersion || isCurrentVersionLoading) return;

    const requestId = versionRequestId.current + 1;
    versionRequestId.current = requestId;
    setVersionState({ eventId, loading: true, value: null });

    void getEventRulesVersion(eventId)
      .then((version) => {
        if (versionRequestId.current === requestId) {
          setVersionState({ eventId, loading: false, value: version });
        }
      })
      .catch(() => {
        if (versionRequestId.current === requestId) {
          setVersionState({ eventId, loading: false, value: null });
        }
      });
  };

  return (
    <>
      <Pressable
        accessibilityLabel={copy.actionsLabel}
        accessibilityRole="button"
        onPress={openActions}
        style={({ pressed }) => [styles.headerButton, pressed && styles.actionPressed]}>
        <AntDesign color={theme.colors.text.primary} name="ellipsis" size={24} />
      </Pressable>
      <EventActionsSheet
        addingToCalendar={isAddingToCalendar}
        deleting={isDeleting}
        loadingRulesVersion={isCurrentVersionLoading}
        rulesVersion={currentRulesVersion}
        showDeleteConfirmation={showDeleteConfirmation}
        visible={actionsVisible}
        onAddToCalendar={() => void addToCalendar()}
        onClose={closeActions}
        onDismiss={() => void openPendingCalendarEvent()}
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
