export const ROUTES = {
  welcome: '/',
  login: '/login',
  createAccount: '/create-account',
  myEvents: '/my-events',
  createEvent: '/create-event',
  eventPlan: (eventId: string) => ({
    pathname: '/events/[eventId]' as const,
    params: { eventId },
  }),
  eventShopping: (eventId: string) => ({
    pathname: '/events/[eventId]/shopping' as const,
    params: { eventId },
  }),
  eventChecklist: (eventId: string) => ({
    pathname: '/events/[eventId]/checklist' as const,
    params: { eventId },
  }),
  editEvent: (eventId: string) => ({
    pathname: '/edit-event/[eventId]' as const,
    params: { eventId },
  }),
  profile: '/profile',
  editProfile: '/edit-profile',
  privacyPolicy: '/privacy-policy',
  terms: '/terms',
} as const;
