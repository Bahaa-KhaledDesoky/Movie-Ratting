export interface UserRequest {
    username: string;
    password: string;
}

export interface User {
    id?: number;
    username: string;
    password?: string;
    refreshToken?: string;
    role?: string;
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

export interface LoginRespond {
    tokenResponse: TokenResponse;
    userRole: string;
}

export interface AuthResponse {
    accessToken?: string;
    user?: User;
    message?: string;
}