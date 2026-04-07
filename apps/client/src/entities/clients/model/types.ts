import {
  ApiResponse,
  ClientAvailableScopesResponse as AvailableScopesResponse,
  ClientAvailableScope,
} from '@repo/shared/types';

export interface Client {
  id: string;
  clientName: string;
  serviceName: string;
  redirectUrl: string[];
  scopes: string[];
}

export interface ClientListData {
  totalPages: number;
  totalElements: number;
  clients: Client[];
}

export interface CreateClientRequest {
  clientName: string;
  serviceName: string;
  redirectUrls: string[];
  scopes: string[];
}

export interface UpdateClientRequest {
  clientName: string;
  serviceName: string;
  redirectUrls: string[];
}

export interface CreateClientData {
  clientId: string;
  clientSecret: string;
  clientName: string;
  serviceName: string;
  redirectUrls: string[];
  scopes: string[];
}

export type UpdateClientData = Client;

export type CreateClientResponse = ApiResponse<CreateClientData>;
export type UpdateClientResponse = ApiResponse<UpdateClientData>;
export type ClientListResponse = ApiResponse<ClientListData>;

export type { ClientAvailableScope, AvailableScopesResponse };

export type { ClientFormType } from './schema';
