export interface Client {
  id: number;
  name: string;
  clientId: string;
  redirectUrls: string[];
  scopes: string[];
}

export interface CreatedClient {
  name: string;
  clientId: string;
  clientSecret: string;
}
