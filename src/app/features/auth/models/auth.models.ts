export interface LoginRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  token: string;
  password: string;
  firstName: string;
  lastName: string;
}
