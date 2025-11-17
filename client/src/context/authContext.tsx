// context/AuthContext.tsx
import { createContext, useEffect, useState, ReactNode, useCallback, useContext,} from "react";

// --- Type Definitions ---
export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  avatar?: string;
  [key: string]: any;
  // Add other user fields as needed
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
  isLogin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Provider Component ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL_LOCAL || import.meta.env.VITE_BACKEND_URL_PRODUCTION;


  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);

      if (!API_BASE_URL) {
        console.error('Backend URL is not defined.');
        return;
      }
      const res = await fetch(API_BASE_URL+"/api/v1/user/me", {
        credentials: "include", // required to send cookies
      });

      if (!res.ok) {
        setUser(null);
        setError("Unauthorized");
        return;
      }

      const data = await res.json();
      console.log(data)
      setUser(data.user);
      setError(null);
    } catch (err: any) {
      console.log(err)
      setUser(null);
      setError("Failed to fetch user");
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);


  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/api/v1/user/logout`, {
        method: "GET",
        credentials: "include",
      });
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

   // ✅ Computed value
  const isLogin = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, error, isLogin, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


// Custom hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};