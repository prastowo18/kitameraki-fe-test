import { ApiClient } from '../api';
import { BulkUpdateFormConfig } from '../mutators';
import { FormConfigResources, JsonResource } from '../queries';

import { IFormConfig, IResponseBulkUpdate } from '@/types/form-config.types';

export const getFormConfig = () =>
  ApiClient<FormConfigResources<IFormConfig>>({
    method: 'GET',
    url: '/api/GetFormConfig',
  });

export const updateBulkFormConf = (data: BulkUpdateFormConfig[]) =>
  ApiClient<JsonResource<IResponseBulkUpdate>>({
    method: 'POST',
    url: '/api/BulkUpdateFormConfig',
    data,
  });
