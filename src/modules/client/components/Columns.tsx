import { format } from 'date-fns';

import { DeleteRegular, EditRegular } from '@fluentui/react-icons';
import { TableCellLayout } from '@fluentui/react-table';
import { Badge, Button, makeStyles } from '@fluentui/react-components';

import { DynamicColumn } from '../../../components/DynamicTable';

import { ITask } from '@/types/task.types';

const useStyles = makeStyles({
  wrapper: { columnGap: '10px', display: 'flex', minWidth: 'min-content' },
});

interface Props {
  setOpenModalDelete: (value: boolean, item: ITask) => void;
  setOpenModalForm: (value: boolean, item: ITask) => void;
}

export const useTaskTableColumns = ({
  setOpenModalDelete,
  setOpenModalForm,
}: Props): DynamicColumn<ITask>[] => {
  const styles = useStyles();

  return [
    {
      id: 'title',
      header: 'Title',
      sizing: { idealWidth: 300, minWidth: 150 },
      render: (item) => (
        <TableCellLayout truncate>{item.title}</TableCellLayout>
      ),
    },
    {
      id: 'description',
      header: 'Description',
      sizing: { idealWidth: 350, minWidth: 150 },
      render: (item) => (
        <TableCellLayout truncate>{item.description}</TableCellLayout>
      ),
    },
    {
      id: 'priority',
      header: 'Priority',
      sizing: { idealWidth: 150, minWidth: 100 },
      render: (item) => {
        let color: 'danger' | 'warning' | 'success' | 'brand' = 'brand';
        switch (item.priority?.toLowerCase()) {
          case 'high':
            color = 'danger';
            break;
          case 'medium':
            color = 'warning';
            break;
          case 'low':
            color = 'success';
            break;
        }

        return (
          <TableCellLayout truncate>
            <Badge appearance="tint" color={color}>
              {item.priority}
            </Badge>
          </TableCellLayout>
        );
      },
    },
    {
      id: 'status',
      header: 'Status',
      sizing: { idealWidth: 150, minWidth: 100 },
      render: (item) => (
        <TableCellLayout truncate>{item.status}</TableCellLayout>
      ),
    },
    {
      id: 'tag',
      header: 'Tags',
      sizing: { idealWidth: 350, minWidth: 100 },
      render: (item) => (
        <TableCellLayout truncate>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              padding: '10px 0px',
            }}
          >
            {item.tags.map((e, i) => (
              <span
                key={i}
                style={{
                  background: '#f3f2f1',
                  borderRadius: '12px',
                  padding: '2px 8px',
                  fontSize: '12px',
                  lineHeight: 1.5,
                }}
              >
                {e}
              </span>
            ))}
          </div>
        </TableCellLayout>
      ),
    },
    {
      id: 'due_date',
      header: 'Due Date',
      sizing: { idealWidth: 150, minWidth: 100 },
      render: (item) => (
        <TableCellLayout truncate>
          {item.dueDate
            ? format(new Date(item.dueDate), 'dd-MM-yyyy HH:mm')
            : ''}
        </TableCellLayout>
      ),
    },
    {
      id: 'actions',
      header: '',
      render: (item: ITask) => (
        <TableCellLayout>
          <div className={styles.wrapper}>
            <Button
              icon={<EditRegular />}
              aria-label="Edit"
              onClick={() => setOpenModalForm(true, item)}
            />
            <Button
              icon={<DeleteRegular />}
              aria-label="Delete"
              onClick={() => setOpenModalDelete(true, item)}
            />
          </div>
        </TableCellLayout>
      ),
    },
  ];
};
