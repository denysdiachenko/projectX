import * as yup from 'yup';

type ChecklistItemValidationCopy = {
  titleMax: string;
  titleRequired: string;
};

export type ChecklistItemFormValues = {
  title: string;
};

export function createChecklistItemSchema(copy: ChecklistItemValidationCopy) {
  return yup.object({
    title: yup.string().trim().required(copy.titleRequired).max(200, copy.titleMax),
  });
}
