import { useMemo } from 'react';
import { useFormik } from 'formik';
import { useQueryClient } from '@tanstack/react-query';

import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Button,
  makeStyles,
  Body1,
} from '@fluentui/react-components';

import { DynamicForm } from './DynamicForm';

import { IOrganizations, ITask } from '@/types/task.types';
import { useToast } from '@/providers/ToastProvider';
import { getResponseErrorMessage } from '@/utils/api';
import { useCreateTask, useUpdateTask } from '@/config/mutators';
import { CreateTaskSchema, UpdateTaskSchema } from '@/schema/task.schema';
import { IFormConfig } from '@/types/form-config.types';

const useStyles = makeStyles({
  content: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '10px',
  },
});

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  setItem: (value: null) => void;
  task: ITask | null;
  organizations: IOrganizations[] | [];
  formConfigData: IFormConfig[] | [];
}

export const TaskForm = ({
  task,
  organizations,
  formConfigData,
  open,
  setItem,
  setOpen,
}: Props) => {
  const styles = useStyles();
  const { notify } = useToast();
  const queryClient = useQueryClient();

  const today = useMemo(() => new Date(), []);

  const { mutateAsync: performCreateTask, error: createdError } =
    useCreateTask();
  const { mutateAsync: performUpdateTask, error: updatedError } =
    useUpdateTask();

  const schema = useMemo(
    () => (task ? UpdateTaskSchema : CreateTaskSchema),
    [task]
  );

  const formik = useFormik({
    initialValues: {
      id: task?.id ?? '',
      title: task?.title ?? '',
      dueDate: task?.dueDate ? new Date(task.dueDate) : today,
      organizationId: task?.organizationId ?? organizations[0]?.id,
      description: task?.description ?? '',
      priority: task?.priority ?? 'low',
      status: task?.status ?? 'todo',
      tags: task?.tags ?? [],
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (task) {
          await performUpdateTask({
            ...values,
          });
          notify('Task updated successfully', 'success');
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, ...rest } = values;
          await performCreateTask(rest);
          notify('Task created successfully', 'success');
        }

        formik.resetForm();
        setOpen(false);
        setItem(null);

        queryClient.invalidateQueries({
          queryKey: ['/tasks'],
        });
      } catch (error) {
        console.error('Error creating task:', error);
      }
    },
    validationSchema: schema,
  });

  const error = createdError || updatedError;

  return (
    <Dialog open={open} onOpenChange={(_, data) => setOpen(data.open)}>
      <DialogSurface>
        <form onSubmit={formik.handleSubmit}>
          <DialogBody>
            <DialogTitle>{task ? 'Edit' : 'Add'} Task</DialogTitle>
            <DialogContent className={styles.content}>
              {error && (
                <Body1 style={{ color: '#D6474A' }}>
                  {getResponseErrorMessage(error)}
                </Body1>
              )}
              <DynamicForm
                schema={formConfigData}
                formik={formik}
                showOrg={task ? true : false}
                optionsOrg={organizations}
              />
            </DialogContent>
            <DialogActions style={{ marginTop: '20px' }}>
              <Button type="submit" appearance="primary">
                Submit
              </Button>
              <DialogTrigger disableButtonEnhancement>
                <Button
                  onClick={() => {
                    setOpen(false);
                    formik.resetForm();
                  }}
                  appearance="secondary"
                >
                  Close
                </Button>
              </DialogTrigger>
            </DialogActions>
          </DialogBody>
        </form>
      </DialogSurface>
    </Dialog>
  );
};
