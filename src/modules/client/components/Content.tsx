import { useEffect, useState } from 'react';

import { SearchBox } from '@fluentui/react-search';
import { AddRegular } from '@fluentui/react-icons';
import { Tab, TabList } from '@fluentui/react-tabs';
import { Button } from '@fluentui/react-components';

import { DynamicTable } from '@/components/DynamicTable';

import { useDebounce } from '@/hooks/useDebounce';
import { useFormConfig, useOrganizations, useTasks } from '@/config/queries';

import { TaskForm } from './TaskForm';
import { ModalDelete } from './ModalDelete';
import { useTaskTableColumns } from './Columns';
import { ModalBulkDelete } from './ModalBulkDelete';

import { ITask } from '@/types/task.types';

export const Content = () => {
  const [ids, setIds] = useState<string[]>([]);
  const [org, setOrg] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 500);

  const [item, setItem] = useState<ITask | null>(null);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalForm, setModalForm] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  const { data: formConfigData } = useFormConfig({
    enabled: modalForm,
  });
  const { data: organizationsData, isLoading } = useOrganizations();

  const { data: productData } = useTasks({
    params: org
      ? {
          page: pagination.page,
          pageSize: pagination.pageSize,
          organizationId: org,
          search: debouncedSearch,
        }
      : undefined,
  });

  useEffect(() => {
    if (organizationsData?.data?.data?.length && !org) {
      setOrg(organizationsData.data.data[0].id);
    }
  }, [organizationsData, org]);

  useEffect(() => {
    if (productData?.data?.meta.pagination?.total) {
      setPagination((prev) => ({
        ...prev,
        total: productData.data.meta.pagination.total,
      }));
    }
  }, [productData]);

  const columns = useTaskTableColumns({
    setOpenModalDelete(value, item) {
      setModalDelete(value);
      setItem(item);
    },
    setOpenModalForm(value, item) {
      setModalForm(value);
      setItem(item);
    },
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* Tabs */}
      {!isLoading && (
        <TabList
          selectedValue={org || organizationsData.data.data[0]?.id}
          onTabSelect={(_, data) => {
            setOrg(data.value.toString());
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
        >
          {organizationsData.data.data.map((e) => (
            <Tab key={e.id} value={e.id}>
              {e.name}
            </Tab>
          ))}
        </TabList>
      )}

      {/* Search & Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <SearchBox
          placeholder="Search Task"
          style={{ width: '300px' }}
          onChange={(_, data) => {
            setSearch(data.value ?? '');
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button
            onClick={() => {
              setModalForm(true);
              setItem(null);
            }}
            appearance="outline"
            icon={<AddRegular />}
          >
            Create Task
          </Button>

          {!!ids.length && (
            <ModalBulkDelete ids={ids} org={org} setIds={setIds} />
          )}
        </div>
      </div>

      {/* Task Table */}
      <DynamicTable
        selectable
        columns={columns}
        selectedRows={ids}
        items={productData?.data?.data ?? []}
        onSelectionChange={setIds}
        pagination={productData?.data?.meta.pagination ?? pagination}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        onPageSizeChange={(pageSize) =>
          setPagination((prev) => ({ ...prev, page: 1, pageSize }))
        }
      />

      {/* Task Form Modal */}
      <TaskForm
        task={item}
        open={modalForm}
        setItem={setItem}
        setOpen={setModalForm}
        formConfigData={formConfigData?.data?.data ?? []}
        organizations={organizationsData?.data?.data ?? []}
      />

      {/* Delete Modal */}
      <ModalDelete
        item={item}
        open={modalDelete}
        setOpen={setModalDelete}
        setItem={setItem}
      />
    </div>
  );
};
