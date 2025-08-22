/* eslint-disable @typescript-eslint/no-explicit-any */

import { PropsWithChildren } from 'react';
import { FormikErrors, FormikTouched } from 'formik';

import { Field } from '@fluentui/react-field';
import { Body1 } from '@fluentui/react-text';

import { getFirstError, isFieldTouched } from '@/utils/formikHelpers';

interface Props extends PropsWithChildren {
  label: string;

  error?: string | string[] | FormikErrors<any> | FormikErrors<any>[];
  touched?: boolean | boolean[] | FormikTouched<any> | FormikTouched<any>[];
  required?: boolean;
}

export const FormFieldWrapper = ({
  label,
  error,
  touched,
  children,
  required = false,
}: Props) => {
  const normalizedError = getFirstError(error);
  const touchedFlag = isFieldTouched(touched);

  return (
    <Field
      label={label}
      required={required}
      hint={
        normalizedError && touchedFlag ? (
          <Body1 style={{ marginTop: '5px', color: '#D6474A' }}>{error}</Body1>
        ) : (
          ''
        )
      }
    >
      {children}
    </Field>
  );
};
