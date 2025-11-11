import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../ui/Loader";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  // ✅ Controlled Input Handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value.trimStart() }));
  };

  // ✅ Submit Handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/v1/user/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Login failed");
      }

      toast.success(result.message || "Login successful!");
      await fetchUser();
      navigate("/");
    } catch (error: any) {
      console.error("❌ Login error:", error);
      toast.error(error.message || "Something went wrong, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Forgot Password Navigation
  const handleForgotPassword = () => {
    if (form.email) {
      navigate(`/forgot-password/${form.email}`);
    } else {
      navigate(`/forgot-password/email`);
    }
  };

  // ✅ UI
  return isLoading ? (
    <Loader />
  ) : (
    <section id="login" className="py-10">
      <div className="container mx-auto p-4">
        <div className="bg-white shadow-md rounded-2xl p-6 max-w-sm mx-auto">
          <h1 className="text-xl font-bold text-center mb-2">Welcome Back 👋</h1>
          <p className="text-center text-gray-500 mb-6 text-sm">
            Please sign in to continue
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="grid gap-1">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="bg-slate-100 p-2 rounded-md w-full outline-none focus:ring-2 focus:ring-red-400"
                required
              />
            </div>

            {/* Password */}
            <div className="grid gap-1">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="bg-slate-100 p-2 rounded-md w-full pr-10 outline-none focus:ring-2 focus:ring-red-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div
                onClick={handleForgotPassword}
                className="text-sm text-red-500 mt-1 text-right cursor-pointer hover:underline"
              >
                Forgot password?
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-full transition-all mt-4"
            >
              Login
            </button>
          </form>

          {/* Signup */}
          <p className="text-center mt-5 text-sm">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-red-600 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
