import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  bulkDeleteTask,
  createTask,
  deleteTask,
  TaskRequest,
  updateTask,
} from './services/task.service';

import { ErrorResponse } from './api';
import { JsonResource, PaginatedResources } from './queries';

import { ITask } from '@/types/task.types';
import { IResponseBulkUpdate } from '@/types/form-config.types';
import { updateBulkFormConf } from './services/form-config.service';

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

export interface BulkUpdateFormConfig {
  id: string;
  name: string;
  label: string;
  order: number;
  options: string[];
  required: boolean;
  placeholder: string;
  type: string;
}

export const useCreateTask = () => {
  return useMutation<
    JsonResource<ITask>,
    AxiosError<ErrorResponse>,
    TaskRequest
  >({
    mutationFn: (data: TaskRequest) => createTask(data),
  });
};

export const useUpdateTask = () => {
  return useMutation<
    JsonResource<ITask>,
    AxiosError<ErrorResponse>,
    TaskRequest
  >({
    mutationFn: (data: TaskRequest) => updateTask(data),
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation<
    JsonResource<ITask>,
    AxiosError<ErrorResponse>,
    DeleteTaskParams
  >({
    mutationFn: (params: DeleteTaskParams) => deleteTask(params),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const [key] = query.queryKey as [string, any];
          return key === '/tasks';
        },
      });

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
      queryClient.invalidateQueries({
        predicate: (query) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const [key] = query.queryKey as [string, any];
          return key === '/tasks';
        },
      });

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

export const useBulkUpdateFormConf = () => {
  return useMutation<
    JsonResource<IResponseBulkUpdate>,
    AxiosError<ErrorResponse>,
    BulkUpdateFormConfig[]
  >({
    mutationFn: (data: BulkUpdateFormConfig[]) => updateBulkFormConf(data),
  });
};
