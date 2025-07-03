import { HttpMethod } from './http';

export interface RequestOptions {
  method?: HttpMethod;
  headers?: HeadersInit;
  body?: BodyInit;
}
