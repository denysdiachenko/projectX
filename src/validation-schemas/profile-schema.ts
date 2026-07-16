import * as yup from 'yup';

type ProfileValidationCopy = {
  nameRequired: string;
  nameTooLong: string;
};

export type ProfileFormValues = {
  displayName: string;
};

export function createProfileSchema(copy: ProfileValidationCopy) {
  return yup.object({
    displayName: yup.string().trim().required(copy.nameRequired).max(120, copy.nameTooLong),
  });
}
