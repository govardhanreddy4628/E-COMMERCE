// context/AuthContext.tsx
import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useContext,
} from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// --- Type Definitions ---
export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  avatar?: string;
  [key: string]: any;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
  isLogin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// --- Provider Component ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

   const navigate = useNavigate();

  // FIXED: Proper fallback chaining (local → production)
  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL_LOCAL ||
    import.meta.env.VITE_BACKEND_URL_PRODUCTION;

  const fetchUser = useCallback(async () => {
    if (!API_BASE_URL) {
      console.error("❌ Backend URL is not defined.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/v1/user/me`, {
        credentials: "include",
      });

      if (!res.ok) {
        // Avoid leaving stale user
        setUser(null);

        const errData = await res.json().catch(() => null);
        setError(errData?.message || "Unauthorized");

        return;
      }

      const data = await res.json();
      setUser(data.user);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setUser(null);
      setError("Failed to fetch user");
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  const logout = useCallback(
    async () => {
      if (!API_BASE_URL) {
        toast.error("Backend URL missing");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/user/logout`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          toast.error(errData?.message || "Logout failed");
          return;
        }

        setUser(null);
        toast.success("Logged out");
        navigate("/");
      } catch (err: any) {
        console.error("Logout failed", err);
        toast.error(err?.message || "Logout failed");
      }
    },
    [API_BASE_URL]
  );

  // Fetch user on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Computed value
  const isLogin = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isLogin,
        fetchUser,
        logout,
      }}
    >
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
