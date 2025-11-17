import { useState } from 'react';
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import signinGif from "../../assets/signin.gif";

interface SignupResponse {
  success?: boolean;
  error?: boolean;
  msg: string;
  intentToken?: string;
}

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .max(15, 'Name must be less than 15 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
    if (file) {
      const imageBase64 = await imageToBase64(file);
      setImagePreview(imageBase64);
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (
    values: { name: string; email: string; password: string; confirmPassword: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const formData = new FormData();
      formData.append('fullName', values.name);
      formData.append('email', values.email);
      formData.append('password', values.password);
      if (selectedFile) formData.append('avatar', selectedFile);

      const response = await fetch('http://localhost:8080/api/v1/user/register', {
        method: 'POST',
        body: formData,
        credentials: "include", // ✅ include cookies if needed later
      });

      const result: SignupResponse = await response.json();

      if (!response.ok) throw new Error(result.msg || 'Signup failed');

      localStorage.setItem('intentToken', result.intentToken || '');
      toast.success(result.msg);
      navigate('/otpverify');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const googleSignUp = () => {
  const API_BASE = import.meta.env.VITE_BACKEND_URL_LOCAL || import.meta.env.VITE_BACKEND_URL_PRODUCTION || "http://localhost:8080";
  window.location.href = `${API_BASE}/api/v1/auth/google`;
};


  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-10">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <img
              src={imagePreview || signinGif}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-sm"
            />
            <label className="absolute bottom-0 left-0 w-full text-center bg-black/60 text-white text-xs py-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-b-full">
              Upload Photo
              <input type="file" className="hidden" onChange={handleUploadPic} />
            </label>
          </div>
        </div>

        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched, values }) => (
            <Form className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <Field
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
                {touched.name && errors.name && (
                  <div className="text-sm text-red-500 mt-1">{errors.name}</div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <Field
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
                {touched.email && errors.email && (
                  <div className="text-sm text-red-500 mt-1">{errors.email}</div>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="flex items-center border border-gray-300 p-2 rounded-md">
                  <Field
                    name="password"
                    type={showPassword ? 'text' : 'password'}
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
                {touched.password && errors.password && (
                  <div className="text-sm text-red-500 mt-1">{errors.password}</div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="flex items-center border border-gray-300 p-2 rounded-md">
                  <Field
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm password"
                    className="flex-grow focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-600 hover:text-black"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <div className="text-sm text-red-500 mt-1">{errors.confirmPassword}</div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || Object.values(values).some((v) => !v)}
                className={`w-full py-2 rounded-md flex items-center justify-center gap-2 transition-all ${
                  isSubmitting
                    ? 'bg-black text-white cursor-wait'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Sign Up'
                )}
              </button>

              <div className="flex items-center gap-2 my-4">
                <hr className="flex-grow border-gray-300" />
                <span className="text-gray-500 text-sm">OR</span>
                <hr className="flex-grow border-gray-300" />
              </div>

              <button
                type="button"
                className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-md py-2 hover:bg-gray-50 transition"
                onClick= { googleSignUp }
              >
                <FcGoogle size={22} />
                <span>Sign up with Google</span>
              </button>

              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{' '}
                <Link to="/login" className="text-red-600 font-medium hover:underline">
                  Login
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
}
