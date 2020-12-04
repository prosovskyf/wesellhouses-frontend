import { createContext, useContext } from 'react';

/** Create user context */
export const UserContext = createContext();

/** Use user context by calling this in component */
export function useAuth() {
  return useContext(UserContext);
}
/** Remove all data and token from localStorage */
export function logout() {
  localStorage.removeItem("user");
}


