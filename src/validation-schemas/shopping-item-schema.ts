import * as yup from 'yup';

type ShoppingItemValidationCopy = {
  nameMax: string;
  nameRequired: string;
  packageCountInteger: string;
  packagePair: string;
  positiveNumber: string;
  quantityRequired: string;
};

export type ShoppingItemFormValues = {
  name: string;
  packageCount: string;
  packageSize: string;
  quantity: string;
  unit: string;
};

const isPositiveNumber = (value?: string) => {
  if (!value?.trim()) return true;
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0;
};

export function createShoppingItemSchema(copy: ShoppingItemValidationCopy) {
  return yup.object({
    name: yup.string().trim().required(copy.nameRequired).max(120, copy.nameMax),
    quantity: yup
      .string()
      .trim()
      .required(copy.quantityRequired)
      .test('positive-number', copy.positiveNumber, isPositiveNumber),
    unit: yup.mixed<ShoppingItemFormValues['unit']>().required(),
    packageSize: yup
      .string()
      .trim()
      .default('')
      .defined()
      .test('positive-package-size', copy.positiveNumber, isPositiveNumber),
    packageCount: yup
      .string()
      .trim()
      .default('')
      .defined()
      .test('positive-package-count', copy.positiveNumber, isPositiveNumber)
      .test('integer-package-count', copy.packageCountInteger, (value) => {
        if (!value?.trim()) return true;
        return Number.isInteger(Number(value));
      }),
  }).test('package-pair', copy.packagePair, function validatePackagePair(values) {
    const hasSize = Boolean(values.packageSize?.trim());
    const hasCount = Boolean(values.packageCount?.trim());

    if (hasSize === hasCount) return true;

    return this.createError({
      message: copy.packagePair,
      path: hasSize ? 'packageCount' : 'packageSize',
    });
  });
}
