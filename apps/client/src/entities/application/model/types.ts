export interface ApplicationScope {
  applicationScope: string;
  applicationDescription: string;
}

export interface Application {
  id: string;
  applicationName: string;
  applicationScopes: ApplicationScope[];
}

export interface CreateApplicationData extends Omit<Application, 'id'> {}

export type ApplicationFormType = {
  applicationName: string;
  applicationScopes: ApplicationScope[];
};
