import { ApiClient } from '../api';
import { JsonResource, PaginatedResources, PaginationParams } from '../queries';

import { ITask } from '@/types/task.types';

export interface GetTaskParams extends PaginationParams {
  id?: string;
  search?: string;
  organizationId?: string;
}

export interface TaskRequest {
  id?: string;
  organizationId: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: string;
  status: string;
  tags: string[];
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

export const createTask = (data: TaskRequest) =>
  ApiClient<JsonResource<ITask>>({
    method: 'POST',
    url: '/api/InsertTask',
    data,
  });

export const updateTask = (data: TaskRequest) =>
  ApiClient<JsonResource<ITask>>({
    method: 'PUT',
    url: '/api/UpdateTask',
    data,
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
