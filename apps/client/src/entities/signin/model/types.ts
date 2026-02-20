export interface OAuthCodeRequestInput {
  email: string;
  password: string;
  clientId: string;
  redirectUrl: string;
  isInternal: boolean;
}
