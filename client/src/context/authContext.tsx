// context/AuthContext.tsx

import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";

// --- Type Definitions ---
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  // Add other user fields as needed
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Provider Component ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL as string;

      if (!backendUrl) {
        console.error('Backend URL is not defined.');
        return;
      }
      const res = await fetch(backendUrl+"/api/v1/user/me", {
        credentials: "include", // required to send cookies
      });

      if (!res.ok) {
        setUser(null);
        setError("Unauthorized");
        return;
      }

      const data = await res.json();
      setUser(data.user);
      setError(null);
    } catch (err: any) {
      setUser(null);
      setError("Failed to fetch user");
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("http://localhost:8080/api/v1/user/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ user, loading, error, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


