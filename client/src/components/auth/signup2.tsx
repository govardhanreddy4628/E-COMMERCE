import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import signinGif from "../../assets/signin.gif";

interface SignupResponse {
  success?: boolean;
  error?: boolean;
  message: string;
  intentToken?: string;
}

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(30, "Name must be less than 30 characters")
    .required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Must be 6+ chars").required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("inviteToken");

  const navigate = useNavigate();

  const imageToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUploadPic = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const base64 = await imageToBase64(file);
    setImagePreview(base64);
    setSelectedFile(file);
  };

  const handleSubmit = async (
    values: {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    },
    { setSubmitting }: { setSubmitting: (v: boolean) => void }
  ) => {
    try {
      const formData = new FormData();
      formData.append("fullName", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("confirmPassword", values.confirmPassword);

      if (inviteToken) {
        formData.append("inviteToken", inviteToken);
      }

      if (selectedFile && !inviteToken) {
        formData.append("image", selectedFile);
      }

      const response = await fetch(
        "http://localhost:8080/api/v1/user/register",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const result: SignupResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Signup failed");
      }

      toast.success(result.message);

      // 👇 FLOW SPLIT
      if (inviteToken) {
        // Admin → go to login / MFA setup
        navigate("/login");
        return;
      }

      // Normal user → OTP verification
      if (result.intentToken) {
        localStorage.setItem("intentToken", result.intentToken);
        navigate("/otpverify");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const googleSignUp = () => {
    const API_BASE =
      import.meta.env.VITE_BACKEND_URL_LOCAL ||
      import.meta.env.VITE_BACKEND_URL_PRODUCTION ||
      "http://localhost:8080";

    window.location.href = `${API_BASE}/api/v1/auth/google`;
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-10">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        {/* Avatar (users only) */}
        {!inviteToken && (
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <img
                src={imagePreview || signinGif}
                alt="avatar"
                className="w-14 h-14 rounded-full object-cover border-4 border-gray-200 shadow-sm"
              />
              <label className="absolute bottom-0 left-0 w-full text-center bg-black/60 text-white text-xs py-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-b-full">
                Upload Photo
                <input
                  type="file"
                  className="hidden"
                  onChange={handleUploadPic}
                />
              </label>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold text-center mb-4">
          {inviteToken ? "Complete Admin Setup" : "Create Account"}
        </h2>

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-4">

              {/* Name */}
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Field
                  name="name"
                  type="text"
                  className="w-full border p-2 rounded-md"
                />
                {touched.name && errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium">Email</label>
                <Field
                  name="email"
                  type="email"
                  disabled={!!inviteToken}
                  className={`w-full border p-2 rounded-md ${
                    inviteToken ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                />
                {touched.email && errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium">Password</label>
                <div className="flex items-center border p-2 rounded-md">
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="flex-grow"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Confirm */}
              <div>
                <label className="text-sm font-medium">Confirm Password</label>
                <div className="flex items-center border p-2 rounded-md">
                  <Field
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="flex-grow"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 text-white py-2 rounded-md"
              >
                {isSubmitting ? (
                  <FaSpinner className="animate-spin mx-auto" />
                ) : inviteToken ? (
                  "Create Admin Account"
                ) : (
                  "Sign Up"
                )}
              </button>

              {!inviteToken && (
                <>
                  <div className="flex items-center gap-2">
                    <hr className="flex-grow" />
                    <span className="text-sm">OR</span>
                    <hr className="flex-grow" />
                  </div>

                  <button
                    type="button"
                    onClick={googleSignUp}
                    className="w-full border py-2 flex items-center justify-center gap-2"
                  >
                    <FcGoogle size={20} />
                    Sign up with Google
                  </button>
                </>
              )}

              {!inviteToken && (
                <p className="text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="text-red-600">
                    Login
                  </Link>
                </p>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
}
