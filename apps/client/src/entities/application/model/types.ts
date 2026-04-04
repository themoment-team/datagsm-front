export interface ApplicationScope {
  applicationScope: string;
  applicationDescription: string;
}

export interface Application {
  id: string;
  applicationName: string;
  accountId: number;
  applicationScopes: ApplicationScope[];
}

export interface CreateApplicationData extends Omit<Application, 'id'> {}

export type ApplicationFormType = {
  applicationName: string;
  applicationScopes: ApplicationScope[];
};

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

export interface GetApplicationsParams {
  name?: string;
  id?: string;
  page?: number;
  size?: number;
}
