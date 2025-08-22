/* eslint-disable @typescript-eslint/no-explicit-any */

import { FormFieldWrapper } from '@/components/FormFieldWrapper';
import { IFormConfig } from '@/types/form-config.types';
import { IOrganizations } from '@/types/task.types';
import {
  Input,
  Select,
  Tag,
  TagPicker,
  TagPickerControl,
  TagPickerGroup,
  TagPickerInput,
  TagPickerList,
  TagPickerOption,
  Textarea,
} from '@fluentui/react-components';
import { DatePicker } from '@fluentui/react-datepicker-compat';

export type FieldSchema = {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'tagpicker';
  required?: boolean;
  placeholder?: string;
  options?: string[];
  order?: number;
};

type DynamicFormProps = {
  schema: IFormConfig[];
  formik: any;
  showOrg: boolean;
  optionsOrg: IOrganizations[] | [];
};

export const DynamicForm: React.FC<DynamicFormProps> = ({
  schema,
  formik,
  showOrg,
  optionsOrg,
}) => {
  return (
    <>
      {schema
        .filter((field) => field.required)
        .filter((field) => !(showOrg && field.name === 'organizationId'))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((field) => (
          <FormFieldWrapper
            key={field.name}
            required={field.type === 'tagpicker' ? false : field.required}
            label={field.label}
            error={formik.errors[field.name] as string}
            touched={formik.touched[field.name] as boolean}
          >
            {field.type === 'text' && (
              <Input
                id={field.name}
                name={field.name}
                value={formik.values[field.name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={field.placeholder}
              />
            )}

            {field.type === 'textarea' && (
              <Textarea
                id={field.name}
                name={field.name}
                value={formik.values[field.name]}
                onBlur={formik.handleBlur}
                onChange={(_, data) =>
                  formik.setFieldValue(field.name, data.value)
                }
                placeholder={field.placeholder}
              />
            )}

            {field.type === 'select' && (
              <Select
                id={field.name}
                name={field.name}
                value={formik.values[field.name]}
                onChange={formik.handleChange}
              >
                {field.name === 'organizationId' && optionsOrg
                  ? optionsOrg.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))
                  : field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
              </Select>
            )}

            {field.type === 'date' && (
              <DatePicker
                placeholder={field.placeholder}
                value={formik.values[field.name]}
                onSelectDate={(e) => formik.setFieldValue(field.name, e)}
              />
            )}

            {field.type === 'tagpicker' && (
              <TagPicker
                onOptionSelect={(_, data) => {
                  formik.setFieldValue(
                    field.name,
                    data.selectedOptions as string[]
                  );
                }}
                selectedOptions={(formik.values[field.name] as string[]) ?? []}
                onOpenChange={(_, data) => {
                  if (!data.open) {
                    formik.handleBlur({ target: { name: field.name } });
                  }
                }}
              >
                <TagPickerControl>
                  <TagPickerGroup aria-label="Selected Tags">
                    {((formik.values[field.name] as string[]) ?? []).map(
                      (option) => (
                        <Tag key={option} shape="rounded" value={option}>
                          {option}
                        </Tag>
                      )
                    )}
                  </TagPickerGroup>
                  <TagPickerInput aria-label="Select Tags" />
                </TagPickerControl>
                <TagPickerList>
                  {field.options?.length ? (
                    field.options.map((opt) => (
                      <TagPickerOption value={opt} key={opt}>
                        {opt}
                      </TagPickerOption>
                    ))
                  ) : (
                    <TagPickerOption value="no-options">
                      No options available
                    </TagPickerOption>
                  )}
                </TagPickerList>
              </TagPicker>
            )}
          </FormFieldWrapper>
        ))}
    </>
  );
};
