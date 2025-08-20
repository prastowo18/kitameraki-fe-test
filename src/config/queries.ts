import { AxiosError } from 'axios';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ErrorResponse } from './api';
import { getTask, GetTaskParams, getTasks } from './services/task.service';

import { ITask } from '@/types/task.types';

export interface PaginatedResources<T> {
  data: {
    data: T[];
    meta: {
      pagination: {
        page: number;
        pageSize: number;
        total: number;
      };
    };
  };
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface JsonResource<T> {
  data: T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface QueryOptions<T extends Record<string, any>> {
  params?: T;
}

export const getTasksQueryKey = (params?: GetTaskParams) => {
  return ['/tasks', params];
};

export const useTasks = (options?: QueryOptions<GetTaskParams>) => {
  return useQuery<PaginatedResources<ITask>, AxiosError<ErrorResponse>>({
    queryKey: getTasksQueryKey(options?.params),
    queryFn: () => getTasks(options?.params),
    placeholderData: keepPreviousData,
  });
};

export const useTask = (options?: QueryOptions<GetTaskParams>) => {
  return useQuery<JsonResource<ITask>, AxiosError<ErrorResponse>>({
    queryKey: ['/tasks/' + options.params.id],
    queryFn: () => getTask(options.params.id, options?.params),
  });
};
