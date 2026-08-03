import * as yup from 'yup';

import type { RsvpStatus } from '@/services/invitations';

export type InvitationResponseFormValues = {
  adultsCount: number;
  childrenCount: number;
  name: string;
  status: RsvpStatus;
};

export function createInvitationResponseSchema(messages: {
  name: string;
  partySize: string;
}) {
  return yup.object({
    name: yup.string().trim().required(messages.name).max(120, messages.name),
    adultsCount: yup.number().integer().min(0).max(20).required(),
    childrenCount: yup.number().integer().min(0).max(20).required(),
    status: yup
      .mixed<RsvpStatus>()
      .oneOf(['accepted', 'maybe', 'declined'])
      .required(),
  }).test('party-size', messages.partySize, (values) => (
    values.adultsCount + values.childrenCount >= 1
    && values.adultsCount + values.childrenCount <= 20
  ));
}
