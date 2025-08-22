import { AxiosError } from 'axios';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ErrorResponse } from './api';
import { getTask, GetTaskParams, getTasks } from './services/task.service';

import { IOrganizations, ITask } from '@/types/task.types';
import { getOrganizations } from './services/organizations.service';
import { IFormConfig } from '@/types/form-config.types';
import { getFormConfig } from './services/form-config.service';

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

export interface OrganizationResources<T> {
  data: {
    data: T[];
  };
}

export interface FormConfigResources<T> {
  data: {
    data: T[];
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
  const enabled = !!options?.params?.organizationId;

  return useQuery<PaginatedResources<ITask>, AxiosError<ErrorResponse>>({
    queryKey: getTasksQueryKey(options?.params),
    queryFn: () => getTasks(options?.params),
    placeholderData: keepPreviousData,
    staleTime: 0,
    enabled,
  });
};

export const useTask = (options?: QueryOptions<GetTaskParams>) => {
  return useQuery<JsonResource<ITask>, AxiosError<ErrorResponse>>({
    queryKey: ['/tasks/' + options.params.id],
    queryFn: () => getTask(options.params.id, options?.params),
  });
};

export const useOrganizations = () => {
  return useQuery<
    OrganizationResources<IOrganizations>,
    AxiosError<ErrorResponse>
  >({
    queryKey: ['/organizations'],
    queryFn: () => getOrganizations(),
  });
};

export const useFormConfig = ({ enabled }: { enabled: boolean }) => {
  return useQuery<FormConfigResources<IFormConfig>, AxiosError<ErrorResponse>>({
    queryKey: ['/form-config'],
    queryFn: () => getFormConfig(),
    enabled,
  });
};
