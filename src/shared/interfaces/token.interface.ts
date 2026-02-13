export interface TokenPayload {
  id: string;
  username: string;
  email: string;
}
export interface Tokens {
  access_token: string;
  refresh_token: string;
}
