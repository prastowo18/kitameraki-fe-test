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
import { useBulkDeleteTask } from '@/config/mutators';
import { useToast } from '@/providers/ToastProvider';

type Props = {
  ids: string[];
  org: string;
  setIds: (value: string[]) => void;
};

export const ModalBulkDelete = ({ ids, org, setIds }: Props) => {
  const { mutateAsync: performBulkDeleteTask } = useBulkDeleteTask();

  const { notify } = useToast();
  const [checked, setChecked] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    data: CheckboxOnChangeData
  ) => {
    setChecked(Boolean(data.checked));
  };

  const handleBulkDelete = async () => {
    try {
      await performBulkDeleteTask({
        organizationId: org,
        data: { ids },
      });
      notify('Task deleted successfully', 'success');
      setIds([]);
    } catch (error) {
      notify('Failed to delete task', 'error');
      console.log('Error deleting task:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(_, data) => setOpen(data.open)}>
      <DialogTrigger disableButtonEnhancement>
        <Button appearance="outline" icon={<DeleteRegular />}>
          Bulk Delete
        </Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Delete all task?</DialogTitle>
          <DialogContent>
            <p>
              You're about to delete all task " that goes up to lines". This
              will also delete all associated resources, including files,
              subtasks, comments, and so forth. Please back up any content you
              need before proceeding.
            </p>
            <Checkbox
              checked={checked}
              onChange={handleChange}
              label="Yes, delete all task and its associated resources"
            />
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button
                disabled={!checked}
                appearance="primary"
                onClick={handleBulkDelete}
              >
                Delete All Task
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
