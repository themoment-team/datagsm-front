import {
  ApiResponse,
  ClientAvailableScope,
  ClientAvailableScopesResponse as AvailableScopesResponse,
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

export interface CreateClientData {
  id: string;
  clientName: string;
  serviceName: string;
  redirectUrl: string[];
  scopes: string[];
}

export type CreateClientResponse = ApiResponse<CreateClientData>;

export interface UpdateClientRequest {
  clientName: string;
  serviceName: string;
  redirectUrls: string[];
}

export interface UpdateClientData {
  id: string;
  clientName: string;
  serviceName: string;
  redirectUrl: string[];
  scopes: string[];
}

export type UpdateClientResponse = ApiResponse<UpdateClientData>;

export type { ClientAvailableScope, AvailableScopesResponse };
