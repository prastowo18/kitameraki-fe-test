import * as React from 'react';

import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Button,
  Checkbox,
  CheckboxOnChangeData,
} from '@fluentui/react-components';
import { DeleteRegular } from '@fluentui/react-icons';

import { ITask } from '@/types/task.types';
import { useDeleteTask } from '@/config/mutators';
import { useToast } from '@/providers/ToastProvider';

type Props = {
  item: ITask;
};

export const ModalDelete = ({ item }: Props) => {
  const { mutateAsync: performDeleteTask } = useDeleteTask();

  const { notify } = useToast();
  const [checked, setChecked] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    data: CheckboxOnChangeData
  ) => {
    setChecked(Boolean(data.checked));
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    try {
      await performDeleteTask({
        id: item.id,
        organizationId: item.organizationId,
      });
      notify('Task deleted successfully', 'success');
      setOpen(false);
    } catch (error) {
      notify('Failed to delete task', 'error');
      console.log('Error deleting task:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => setOpen(data.open)}>
      <DialogTrigger disableButtonEnhancement>
        <Button icon={<DeleteRegular />} aria-label="Delete" />
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle> Delete this task?</DialogTitle>
          <DialogContent>
            <p>
              You're about to delete the task "{item.title} that goes up to
              lines". This will also delete all associated resources, including
              files, subtasks, comments, and so forth. Please back up any
              content you need before proceeding.
            </p>
            <Checkbox
              checked={checked}
              onChange={handleChange}
              label="Yes, delete this task and all its associated resources"
            />
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button
                disabled={!checked}
                appearance="primary"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </DialogTrigger>
            <DialogTrigger disableButtonEnhancement>
              <Button onClick={() => setOpen(false)} appearance="secondary">
                Cancel
              </Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
