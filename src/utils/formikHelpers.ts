/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormikErrors, FormikTouched } from 'formik';

export function getFirstError(
  error?: string | string[] | FormikErrors<any> | FormikErrors<any>[]
): string | undefined {
  if (!error) return undefined;

  if (typeof error === 'string') return error;

  if (Array.isArray(error)) {
    const first = error.find(Boolean);
    if (typeof first === 'string') return first;
    if (first && typeof first === 'object') {
      return getFirstError(Object.values(first)[0] as any);
    }
  }

  if (typeof error === 'object') {
    return getFirstError(Object.values(error)[0] as any);
  }

  return undefined;
}

export function isFieldTouched(
  touched?: boolean | boolean[] | FormikTouched<any> | FormikTouched<any>[]
): boolean {
  if (!touched) return false;

  if (typeof touched === 'boolean') return touched;

  if (Array.isArray(touched)) return touched.some(Boolean);

  if (typeof touched === 'object') {
    return Object.values(touched).some((v) => isFieldTouched(v as any));
  }

  return false;
}
