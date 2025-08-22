export interface IFormConfig {
  id: string;
  _ts: number;
  _rid: string;
  name: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'tagpicker';
  _etag: string;
  _self?: string;
  label: string;
  order: number;
  options: string[];
  required: boolean;
  placeholder: string;
}
export interface IResponseBulkUpdate {
  data: Datum[];
  message: string;
}

export interface Datum {
  id: string;
  status: string;
  item: Item;
}

export interface Item {
  id: string;
  _ts: number;
  _rid: string;
  name: string;
  type: string;
  _etag: string;
  _self: string;
  label: string;
  order: number;
  options: string[];
  required: boolean;
  placeholder: string;
}
