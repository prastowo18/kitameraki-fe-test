import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ErrorResponse } from './api';
import { JsonResource, PaginatedResources } from './queries';
import { bulkDeleteTask, deleteTask } from './services/task.service';

import { ITask } from '@/types/task.types';

interface DeleteTaskParams {
  id: string;
  organizationId: string;
}

interface DeleteRequest {
  ids: string[];
}
interface BulkDeleteTaskParams {
  organizationId: string;
  data: DeleteRequest;
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation<
    JsonResource<ITask>,
    AxiosError<ErrorResponse>,
    DeleteTaskParams
  >({
    mutationFn: (params: DeleteTaskParams) => deleteTask(params),
    onSuccess: (_, variables) => {
      // invalidate semua query yg key utamanya '/tasks'
      queryClient.invalidateQueries({
        predicate: (query) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const [key] = query.queryKey as [string, any];
          return key === '/tasks';
        },
      });

      // update cache lokal biar UI langsung reflect
      queryClient.setQueriesData<PaginatedResources<ITask>>(
        {
          predicate: (query) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [key] = query.queryKey as [string, any];
            return key === '/tasks';
          },
        },
        (old) =>
          old
            ? {
                ...old,
                data: {
                  ...old.data,
                  data: old.data.data.filter((t) => t.id !== variables.id),
                },
              }
            : old
      );
    },
  });
};

export const useBulkDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation<
    JsonResource<ITask>,
    AxiosError<ErrorResponse>,
    BulkDeleteTaskParams
  >({
    mutationFn: ({ organizationId, data }: BulkDeleteTaskParams) =>
      bulkDeleteTask({ organizationId }, data),
    onSuccess: (_, variables) => {
      // invalidate semua query yg key utamanya '/tasks'
      queryClient.invalidateQueries({
        predicate: (query) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const [key] = query.queryKey as [string, any];
          return key === '/tasks';
        },
      });

      // update cache lokal biar UI langsung reflect
      queryClient.setQueriesData<PaginatedResources<ITask>>(
        {
          predicate: (query) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [key] = query.queryKey as [string, any];
            return key === '/tasks';
          },
        },
        (old) =>
          old
            ? {
                ...old,
                data: {
                  ...old.data,
                  data: old.data.data.filter(
                    (t) => !variables.data.ids.includes(t.id)
                  ),
                },
              }
            : old
      );
    },
  });
};
