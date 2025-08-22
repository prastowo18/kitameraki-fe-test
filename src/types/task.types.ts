export type ITask = {
  id: string;
  _ts: number;
  _rid: string;
  tags: string[];
  _etag: string;
  _self: string;
  title: string;
  status: string;
  dueDate: Date;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
  description: string;
  organizationId: string;
};

export interface IOrganizations {
  id: string;
  _ts: number;
  _rid: string;
  name: string;
  _etag: string;
}
