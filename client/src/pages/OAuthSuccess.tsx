import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function OAuthSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      setAccessToken(token);
      // Navigate to where you want (home)
      navigate("/home", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, []);

  return <div className="min-h-screen flex items-center justify-center">Logging in...</div>;
}
