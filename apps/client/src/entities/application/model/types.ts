export interface ApplicationScope {
  scopeId?: number;
  applicationScope: string;
  applicationDescription: string;
}

export interface Application {
  id: string;
  applicationName: string;
  accountId: number;
  applicationScopes: ApplicationScope[];
}

export interface ApplicationScopeResponse {
  id: number;
  scopeName: string;
  description: string;
}

export interface ApplicationItemResponse {
  id: string;
  name: string;
  accountId: number;
  scopes: ApplicationScopeResponse[];
}

export interface ApplicationsResponse {
  totalPages: number;
  totalElements: number;
  applications: ApplicationItemResponse[];
}

export interface CreateApplicationRequest {
  name: string;
  scopes: {
    scopeName: string;
    description: string;
  }[];
}

export interface UpdateApplicationRequest {
  name: string;
}

export interface UpdateApplicationScopeRequest {
  scopeName: string;
  description: string;
}

export interface GetApplicationsParams {
  name?: string;
  id?: string;
  page?: number;
  size?: number;
}
