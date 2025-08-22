import { useState } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
  CardHeader,
  CardPreview,
  Input,
  Switch,
  Button,
  Select,
  Text,
  Field,
} from '@fluentui/react-components';
import { DismissRegular } from '@fluentui/react-icons';

import { FieldSchema } from '../components/DynamicForm';

export function FormConfigCard({
  field,
  index,
  onChangePlaceholder,
  onToggleRequired,
  onChangeLabel,
  onChangeType,
  onChangeOptions,
}: {
  field: FieldSchema;
  index: number;
  onChangePlaceholder: (index: number, value: string) => void;
  onChangeLabel: (index: number, value: string) => void;
  onChangeType: (
    index: number,
    value: 'text' | 'textarea' | 'select' | 'date' | 'tagpicker'
  ) => void;
  onToggleRequired: (fieldName: string) => void;
  onChangeOptions: (index: number, options: string[]) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    boxShadow: isDragging
      ? '0 12px 24px rgba(34,197,94,0.5)'
      : '0 2px 6px rgba(0,0,0,0.1)',
    border: isDragging ? '2px solid #22C55E' : '1px solid #E5E7EB',
    backgroundColor: isDragging ? '#ECFDF5' : '#FFFFFF',
    borderRadius: '12px',
    padding: '16px',
    cursor: 'grab',
    zIndex: isDragging ? 100 : 'auto',
  };

  const isNotEditable = ['title', 'organizationId', 'status', 'tags'].includes(
    field.name
  );
  const placeholderTypes = ['text', 'textarea'];
  const optionsTypes = ['select', 'tagpicker'];

  const [optionsValue, setOptionsValue] = useState('');

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CardHeader
        header={
          <Text style={{ fontWeight: 600, marginBottom: '20px' }}>
            Field {field.label}
          </Text>
        }
      />
      <CardPreview>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Field label="Label">
            <Input
              value={field.label ?? ''}
              onChange={(_, data) => onChangeLabel(index, data.value)}
            />
          </Field>

          {placeholderTypes.includes(field.type) && (
            <Field label="Placeholder">
              <Input
                value={field.placeholder ?? ''}
                onChange={(_, data) => onChangePlaceholder(index, data.value)}
              />
            </Field>
          )}

          <Field label="Type">
            <Select
              id={field.type}
              name={field.type}
              value={field.type}
              disabled={isNotEditable}
              onChange={(_, data) => {
                onChangeType(
                  index,
                  data.value as
                    | 'text'
                    | 'textarea'
                    | 'select'
                    | 'date'
                    | 'tagpicker'
                );
              }}
            >
              {['text', 'select', 'textarea', 'date', 'tagpicker'].map(
                (val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                )
              )}
            </Select>
          </Field>

          {optionsTypes.includes(field.type) &&
            field.name !== 'organizationId' && (
              <div>
                <div className="">
                  <Field label="Options">
                    <Input
                      value={optionsValue}
                      onChange={(_, data) => setOptionsValue(data.value)}
                    />
                  </Field>
                  <Button
                    style={{ marginTop: '10px' }}
                    onClick={() => {
                      if (!optionsValue) return;
                      const newOptions = [...field.options, optionsValue];
                      onChangeOptions(index, newOptions);
                      setOptionsValue('');
                    }}
                  >
                    Add
                  </Button>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '4px',
                  }}
                >
                  {field.options.map((e, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '5px 10px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        marginTop: '30px',
                      }}
                    >
                      <span>{e}</span>
                      <DismissRegular
                        style={{ marginTop: '1.5px', cursor: 'pointer' }}
                        onClick={() => {
                          const newOptions = field.options.filter(
                            (_, idx) => idx !== i
                          );
                          onChangeOptions(index, newOptions);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

          <div
            style={{
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Switch
              checked={field.required}
              onChange={() => onToggleRequired(field.name)}
              disabled={isNotEditable}
            />
            <span style={{ fontSize: '0.875rem' }}>Required</span>
          </div>
        </div>
      </CardPreview>
    </div>
  );
}
