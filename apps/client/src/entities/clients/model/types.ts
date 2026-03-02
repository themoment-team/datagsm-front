import { ApiResponse } from '@repo/shared/types';

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

export type ClientListResponse = ApiResponse<ClientListData>;

export interface CreateClientRequest {
  clientName: string;
  serviceName: string;
  scopes: string[];
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

export type CreateClientResponse = ApiResponse<CreateClientData>;

export interface UpdateClientRequest {
  clientName?: string;
  serviceName?: string;
  redirectUrls?: string[];
}

export interface UpdateClientData {
  id: string;
  clientName: string;
  serviceName: string;
  redirectUrl: string[];
  scopes: string[];
}

export type UpdateClientResponse = ApiResponse<UpdateClientData>;

export interface AvailableScopeData {
  scope: string;
  description: string;
}

export interface AvailableScopeGroupData {
  title: string;
  scopes: AvailableScopeData[];
}

export type AvailableScopesResponse = ApiResponse<{
  list: AvailableScopeGroupData[];
}>;
