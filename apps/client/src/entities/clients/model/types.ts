import { ApiResponse } from '@repo/shared/types';

export interface Client {
  id: string;
  name: string;
  redirectUrl: string[];
  scopes: string[];
}

export interface ClientListData {
  clients: Client[];
  totalElements: number;
}

export type ClientListResponse = ApiResponse<ClientListData>;

export interface CreateClientRequest {
  name: string;
  scopes: string[];
  redirectUrls: string[];
}

export interface CreateClientData {
  clientId: string;
  clientSecret: string;
  name: string;
  redirectUrls: string[];
}

export type CreateClientResponse = ApiResponse<CreateClientData>;

export interface UpdateClientRequest {
  name: string;
  redirectUrls: string[];
}

export interface UpdateClientData {
  id: string;
  name: string;
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
