import { ApiClient } from '../api';
import { JsonResource, PaginatedResources, PaginationParams } from '../queries';

import { ITask } from '@/types/task.types';

export interface GetTaskParams extends PaginationParams {
  id?: string;
  search?: string;
  organizationId?: string;
}

export const getTasks = (params: GetTaskParams) =>
  ApiClient<PaginatedResources<ITask>>({
    method: 'GET',
    url: '/api/GetTasks',
    params,
  });

export const getTask = (id: string, params: GetTaskParams) =>
  ApiClient<JsonResource<ITask>>({
    method: 'GET',
    url: `/api/tasks/${id}`,
    params,
  });

export const deleteTask = (params: GetTaskParams) =>
  ApiClient<JsonResource<ITask>>({
    method: 'DELETE',
    url: `/api/DeleteTask`,
    params,
  });

export const bulkDeleteTask = (
  params: GetTaskParams,
  data: { ids: string[] }
) =>
  ApiClient<JsonResource<ITask>>({
    method: 'DELETE',
    url: `/api/BulkDeleteTasks`,
    params,
    data,
  });
