import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../ui/Loader";
import { useAuth } from "../../context/authContext";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  role: Yup.string().oneOf(["user", "admin"]).required("Role is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    role: "user",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  // -----------------------
  // Validate Form
  // -----------------------
  const validate = async () => {
    try {
      await LoginSchema.validate(form, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err: any) {
      const formErrors: any = {};
      err.inner.forEach((e: any) => {
        formErrors[e.path] = e.message;
      });
      setErrors(formErrors);
      return false;
    }
  };

  // -----------------------
  // Controlled Input
  // -----------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // -----------------------
  // Submit Handler
  // -----------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await validate();
    if (!isValid) return;

    setIsLoading(true);
    const API_BASE =
      import.meta.env.VITE_BACKEND_URL_LOCAL ||
      import.meta.env.VITE_BACKEND_URL_PRODUCTION;

    try {
      const res = await fetch(`${API_BASE}/api/v1/user/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Login failed");
      toast.success(result.message || "Login successful!");
      await fetchUser();
      navigate("/home");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
console.log(form)
  // -----------------------
  // Forgot Password
  // -----------------------
  const handleForgotPassword = () => {
    navigate(`/forgot-password/${form.email || "email"}`);
  };

  return isLoading ? (
    <Loader />
  ) : (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-2">Welcome Back 👋</h2>
        <p className="text-center text-gray-500 mb-6">Login to your account</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* ROLE SWITCH */}
          <div className="relative w-64 mx-auto bg-gray-100 dark:bg-gray-800 rounded-xl flex p-1 shadow-inner">
            <div
              className={`absolute h-10 w-1/2 bg-white dark:bg-gray-700 rounded-lg shadow-md transition-all duration-300 ease-out ${
                form.role === "user" ? "translate-x-0" : "translate-x-full"
              }`}
            />

            <button
              type="button"
              onClick={() => setForm({ ...form, role: "user" })}
              className={`flex-1 z-10 py-2.5 font-semibold text-sm rounded-lg transition-colors duration-200 ${
                form.role === "user"
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              User
            </button>

            <button
              type="button"
              onClick={() => setForm({ ...form, role: "admin" })}
              className={`flex-1 z-10 py-2.5 font-semibold text-sm rounded-lg transition-colors duration-200 ${
                form.role === "admin"
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Admin
            </button>
          </div>
          {errors.role && (
            <p className="text-red-500 text-sm text-center">{errors.role}</p>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="flex items-center border border-gray-300 p-2 rounded-md">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="flex-grow focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-600 hover:text-black"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Forgot password */}
          <div
            onClick={handleForgotPassword}
            className="text-sm text-red-500 text-right cursor-pointer hover:underline"
          >
            Forgot password?
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 rounded-md flex items-center justify-center gap-2 transition-all bg-red-600 hover:bg-red-700 text-white font-semibold"
          >
            Login
          </button>

          {/* Signup link */}
          <p className="text-center text-sm text-gray-600 mt-2">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-red-600 font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
