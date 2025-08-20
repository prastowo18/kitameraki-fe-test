import { useEffect, useState } from 'react';
import { Button } from '@fluentui/react-button';

import { useTasks } from '@/config/queries';
import { useToast } from '@/providers/ToastProvider';
import { useBulkDeleteTask } from '@/config/mutators';

import { useTaskTableColumns } from './Columns';
import { DynamicTable } from '../../../components/DynamicTable';

export const TaskTable = () => {
  const { notify } = useToast();
  const [ids, setIds] = useState<string[]>([]);

  const { mutateAsync: performDeleteTask } = useBulkDeleteTask();
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  const { data: productData } = useTasks({
    params: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      organizationId: 'org-1',
    },
  });

  const handleBulkDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    try {
      await performDeleteTask({
        organizationId: 'org-1',
        data: { ids },
      });
      notify('Task deleted successfully', 'success');
      setIds([]);
    } catch (error) {
      notify('Failed to delete task', 'error');
      console.log('Error deleting task:', error);
    }
  };

  useEffect(() => {
    if (productData?.data?.meta.pagination?.total) {
      setPagination((prev) => ({
        ...prev,
        total: productData.data.meta.pagination.total,
      }));
    }
  }, [productData]);

  const columns = useTaskTableColumns();

  return (
    <>
      <Button onClick={handleBulkDelete}>Bulk Delete</Button>
      <DynamicTable
        selectable
        columns={columns}
        selectedRows={ids}
        items={productData?.data?.data ?? []}
        onSelectionChange={(ids: string[]) => setIds(ids)}
        pagination={productData?.data?.meta.pagination ?? pagination}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        onPageSizeChange={(pageSize) =>
          setPagination((prev) => ({ ...prev, page: 1, pageSize }))
        }
      />
    </>
  );
};
