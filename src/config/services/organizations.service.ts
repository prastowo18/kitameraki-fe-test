import { ApiClient } from '../api';
import { OrganizationResources } from '../queries';

import { IOrganizations } from '@/types/task.types';

export const getOrganizations = () =>
  ApiClient<OrganizationResources<IOrganizations>>({
    method: 'GET',
    url: '/api/GetOrganizations',
  });
