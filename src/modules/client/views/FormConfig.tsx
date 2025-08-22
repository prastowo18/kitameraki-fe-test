import { useEffect, useMemo, useState } from 'react';

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbDivider,
  BreadcrumbButton,
  Button,
  Body1,
} from '@fluentui/react-components';
import { SettingsRegular } from '@fluentui/react-icons';

import { useFormConfig } from '@/config/queries';
import { IFormConfig } from '@/types/form-config.types';
import { FormConfigCard } from '../components/FormConfigCard';
import { useBulkUpdateFormConf } from '@/config/mutators';
import { useToast } from '@/providers/ToastProvider';
import { useQueryClient } from '@tanstack/react-query';
import { getResponseErrorMessage } from '@/utils/api';

export default function FormConfig() {
  const [fields, setFields] = useState<IFormConfig[]>();

  const { mutateAsync: performBulkUpdate, error: updatedError } =
    useBulkUpdateFormConf();

  const { notify } = useToast();
  const queryClient = useQueryClient();

  const { data: formConfigData } = useFormConfig({
    enabled: true,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 1 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.name === active.id);
      const newIndex = fields.findIndex((f) => f.name === over.id);

      const newFields = arrayMove(fields, oldIndex, newIndex);

      const updatedFields = newFields.map((f, idx) => ({
        ...f,
        order: idx + 1,
      }));

      setFields(updatedFields);
    }
  };

  const isDirty = useMemo(() => {
    if (!fields || !formConfigData) return false;

    const originalMap = Object.fromEntries(
      formConfigData.data.data.map((f) => [f.name, f])
    );

    return fields.some((f) => {
      const original = originalMap[f.name];
      return (
        f.label !== original.label ||
        f.placeholder !== original.placeholder ||
        f.required !== original.required ||
        f.type !== original.type ||
        f.options !== original.options ||
        f.order !== original.order
      );
    });
  }, [fields, formConfigData]);

  const handleSave = async () => {
    if (!fields || !formConfigData) return;

    const originalFields = formConfigData.data.data;

    const changedFields = fields.filter((f, index) => {
      const original = originalFields[index];
      return (
        f.label !== original.label ||
        f.placeholder !== original.placeholder ||
        f.required !== original.required ||
        f.type !== original.type ||
        f.options !== original.options ||
        f.order !== original.order
      );
    });

    const payload = changedFields.map((f) => ({
      id: f.id,
      name: f.name,
      label: f.label,
      order: f.order,
      required: f.required,
      placeholder: f.placeholder,
      type: f.type,
      options: f.options,
    }));

    await performBulkUpdate(payload);
    notify('Form config updated successfully', 'success');
    queryClient.invalidateQueries({
      queryKey: ['/form-config'],
    });
  };

  useEffect(() => {
    if (formConfigData) {
      setFields(formConfigData.data.data ?? []);
    }
  }, [formConfigData]);

  const error = updatedError;

  return (
    <div
      className=""
      style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Breadcrumb aria-label="Breadcrumb default example">
          <BreadcrumbItem>
            <BreadcrumbButton href="/">Home</BreadcrumbButton>
          </BreadcrumbItem>
          <BreadcrumbDivider />
          <BreadcrumbItem>
            <BreadcrumbButton
              href="/form-config"
              icon={<SettingsRegular />}
              current
            >
              Form Config
            </BreadcrumbButton>
          </BreadcrumbItem>
        </Breadcrumb>
        <div className="">
          <Button
            appearance="primary"
            onClick={handleSave}
            icon={<SettingsRegular />}
            disabled={!isDirty}
          >
            Save Config
          </Button>
        </div>
      </div>
      {fields && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((f) => f.name)}
            strategy={rectSortingStrategy}
          >
            {error && (
              <Body1 style={{ color: '#D6474A' }}>
                {getResponseErrorMessage(error)}
              </Body1>
            )}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '16px',
                minHeight: '400px',
                border: '1px solid #E4E7EB',
                borderRadius: '12px',
              }}
            >
              {fields
                .slice()
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((field, index) => (
                  <FormConfigCard
                    key={field.name}
                    field={field}
                    index={index}
                    onChangePlaceholder={(i, val) => {
                      setFields((prev) =>
                        prev.map((f, idx) =>
                          idx === i ? { ...f, placeholder: val } : f
                        )
                      );
                    }}
                    onChangeLabel={(i, val) => {
                      setFields((prev) =>
                        prev.map((f, idx) =>
                          idx === i ? { ...f, label: val } : f
                        )
                      );
                    }}
                    onChangeType={(i, val) => {
                      setFields((prev) =>
                        prev.map((f, idx) =>
                          idx === i ? { ...f, type: val } : f
                        )
                      );
                    }}
                    onToggleRequired={(fieldName) => {
                      setFields((prev) =>
                        prev.map((f) =>
                          f.name === fieldName
                            ? { ...f, required: !f.required }
                            : f
                        )
                      );
                    }}
                    onChangeOptions={(i, opts) => {
                      setFields((prev) =>
                        prev.map((f, idx) =>
                          idx === i ? { ...f, options: opts } : f
                        )
                      );
                    }}
                  />
                ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
