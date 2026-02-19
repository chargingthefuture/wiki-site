export interface AuthState {
  userId: string | null;
  isAuthenticated: boolean;
}

export const getAuthState = (userId: string | null): AuthState => {
  return {
    userId,
    isAuthenticated: Boolean(userId),
  };
};
