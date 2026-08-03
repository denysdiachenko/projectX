import { AntDesign } from '@react-native-vector-icons/ant-design';
import { useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Share, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton/AppButton';
import { EventGuestsSkeleton } from '@/components/Skeletons';
import { EVENT_TAB_BAR_HEIGHT } from '@/constants/event-tabs';
import { useAppLocalization } from '@/hooks/app-localization';
import { useAppTheme } from '@/hooks/app-theme';
import { useEventGuests } from '@/hooks/use-event-guests';
import {
  getOrCreateInvitation,
  type EventGuest,
} from '@/services/invitations';
import { showToast } from '@/services/toast';

import InvitationQrModal from './InvitationQrModal';
import InviteGuestsSheet from './InviteGuestsSheet';
import { createEventGuestsStyles } from './styles';

type EventGuestsContentProps = { eventId: string };

export default function EventGuestsContent({ eventId }: EventGuestsContentProps) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const copy = useAppLocalization().translations.eventPlan.guests;
  const bottomSpacing = EVENT_TAB_BAR_HEIGHT + insets.bottom + theme.spacing.x6;
  const styles = useMemo(
    () => createEventGuestsStyles(theme, bottomSpacing),
    [bottomSpacing, theme],
  );
  const {
    eventName,
    guests,
    hasError,
    isLoading,
    isRefreshing,
    refresh,
    retry,
  } = useEventGuests(eventId);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [invitationUrl, setInvitationUrl] = useState<string | null>(null);

  const prepareInvitation = async () => {
    if (invitationUrl) return invitationUrl;
    setPreparing(true);

    try {
      const invitation = await getOrCreateInvitation(eventId);
      setInvitationUrl(invitation.url);
      return invitation.url;
    } catch {
      showToast({
        message: copy.invitationErrorMessage,
        title: copy.invitationErrorTitle,
        type: 'error',
      });
      return null;
    } finally {
      setPreparing(false);
    }
  };

  const openInvite = () => {
    setSheetVisible(true);
    void prepareInvitation();
  };

  const shareInvitation = async () => {
    const url = await prepareInvitation();
    if (!url) return;

    await Share.share({
      message: `${interpolate(copy.shareMessage, { eventName })}\n${url}`,
    });
    setSheetVisible(false);
  };

  const openQr = async () => {
    const url = await prepareInvitation();
    if (!url) return;
    setSheetVisible(false);
    setQrVisible(true);
  };

  if (isLoading) return <EventGuestsSkeleton />;

  if (hasError) {
    return (
      <View style={[styles.screen, styles.state]}>
        <Text style={styles.stateText}>{copy.loadError}</Text>
        <AppButton label={copy.retry} onPress={retry} style={styles.retryButton} />
      </View>
    );
  }

  const summary = summarizeGuests(guests);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={(
          <RefreshControl
            onRefresh={refresh}
            refreshing={isRefreshing}
            tintColor={theme.colors.background.accent}
          />
        )}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{copy.title}</Text>
          <Pressable onPress={openInvite} style={styles.inviteAction}>
            <AntDesign color={theme.colors.text.brand} name="plus" size={20} />
            <Text style={styles.inviteActionText}>{copy.invite}</Text>
          </Pressable>
        </View>

        {guests.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <AntDesign color={theme.colors.text.brand} name="team" size={44} />
            </View>
            <Text style={styles.emptyTitle}>{copy.emptyTitle}</Text>
            <Text style={styles.emptyMessage}>{copy.emptyMessage}</Text>
            <View style={styles.emptyHint}>
              <Text style={styles.emptyHintText}>{copy.emptyHint}</Text>
            </View>
            <AppButton label={copy.inviteButton} onPress={openInvite} style={styles.emptyButton} />
          </View>
        ) : (
          <>
            <View style={styles.summary}>
              <SummaryItem label={copy.total} styles={styles} value={summary.total} />
              <SummaryItem label={copy.accepted} styles={styles} value={summary.accepted} />
              <SummaryItem label={copy.waiting} styles={styles} value={summary.waiting} />
              <SummaryItem label={copy.declined} styles={styles} value={summary.declined} />
            </View>
            <Text style={styles.listTitle}>{copy.listTitle}</Text>
            <View style={styles.guestList}>
              {guests.map((guest) => (
                <GuestCard guest={guest} key={guest.id} styles={styles} theme={theme} />
              ))}
            </View>
          </>
        )}
      </ScrollView>
      <InviteGuestsSheet
        loading={preparing}
        onClose={() => setSheetVisible(false)}
        onOpenQr={() => void openQr()}
        onShare={() => void shareInvitation()}
        visible={sheetVisible}
      />
      <InvitationQrModal
        eventName={eventName}
        onClose={() => setQrVisible(false)}
        url={invitationUrl}
        visible={qrVisible}
      />
    </View>
  );
}

type ComponentStyles = ReturnType<typeof createEventGuestsStyles>;

function SummaryItem({ label, styles, value }: { label: string; styles: ComponentStyles; value: number }) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

function GuestCard({
  guest,
  styles,
  theme,
}: {
  guest: EventGuest;
  styles: ComponentStyles;
  theme: ReturnType<typeof useAppTheme>;
}) {
  const copy = useAppLocalization().translations.eventPlan.guests;
  const status = getGuestStatus(guest.rsvp_status, copy, theme);
  const people = guest.adults_count > 0 && guest.children_count > 0
    ? interpolate(copy.adultsAndChildren, {
      adults: guest.adults_count,
      children: guest.children_count,
    })
    : guest.children_count > 0
      ? interpolate(copy.children, { count: guest.children_count })
      : interpolate(copy.adults, { count: guest.adults_count });

  return (
    <View style={styles.guestCard}>
      <View style={styles.guestHeader}>
        <View style={[styles.guestDot, { backgroundColor: status.color }]} />
        <View style={styles.guestCopy}>
          <Text style={styles.guestName}>{guest.name}</Text>
          <Text style={styles.guestPeople}>{people}</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: status.background }]}>
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>
    </View>
  );
}

function summarizeGuests(guests: EventGuest[]) {
  return guests.reduce((summary, guest) => {
    const partySize = guest.adults_count + guest.children_count;
    summary.total += partySize;

    if (guest.rsvp_status === 'accepted') summary.accepted += partySize;
    else if (guest.rsvp_status === 'declined') summary.declined += partySize;
    else summary.waiting += partySize;
    return summary;
  }, { accepted: 0, declined: 0, total: 0, waiting: 0 });
}

function getGuestStatus(
  status: string,
  copy: ReturnType<typeof useAppLocalization>['translations']['eventPlan']['guests'],
  theme: ReturnType<typeof useAppTheme>,
) {
  if (status === 'accepted') {
    return { background: theme.colors.status.successBackground, color: theme.colors.status.successForeground, label: copy.statusAccepted };
  }
  if (status === 'declined') {
    return { background: theme.colors.background.accentSubtle, color: theme.colors.background.accent, label: copy.statusDeclined };
  }
  if (status === 'maybe') {
    return { background: theme.colors.status.infoBackground, color: theme.colors.status.infoForeground, label: copy.statusMaybe };
  }
  return { background: theme.colors.status.warningBackground, color: theme.colors.status.warningForeground, label: copy.statusPending };
}

function interpolate(
  template: string,
  values: Record<string, number | string>,
) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, String(value)),
    template,
  );
}
