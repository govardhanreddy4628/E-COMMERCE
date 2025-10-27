import { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../ui/Loader';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { fetchUser } = useAuth(); // ✅ use AuthContext

 

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/v1/user/login", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      console.log("Login response:", result);

      if (res.ok && result.success) {
        toast.success(result.message || "Login successful!");
        await fetchUser(); // ✅ Set user in context
        navigate('/'); // ✅ redirect
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate(data.email ? `/forgot-password/${data.email}` : `/forgot-password/email`);
  };

  return isLoading ? <Loader />
    : (
      <section id='login'>
        <div className='mx-auto container p-4'>
          <div className='bg-white p-5 w-full max-w-sm mx-auto mt-8 shadow-md'>
            <h1 className='text-[18px] text-center font-bold'>Login</h1>

            <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
              {/* Email */}
              <div className='grid'>
                <label>Email:</label>
                <div className='bg-slate-100 p-2'>
                  <input
                    type='email'
                    name='email'
                    value={data.email}
                    onChange={handleOnChange}
                    placeholder='Enter email'
                    className='w-full h-full outline-none bg-transparent'
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label>Password:</label>
                <div className='bg-slate-100 p-2 flex'>
                  <input
                    type={showPassword ? "text" : "password"}
                    name='password'
                    value={data.password}
                    onChange={handleOnChange}
                    placeholder='Enter password'
                    className='w-full h-full outline-none bg-transparent'
                    required
                  />
                  <div className='cursor-pointer text-xl' onClick={() => setShowPassword(prev => !prev)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
                <div
                  className='block w-fit ml-auto hover:underline text-red-400 mt-2 cursor-pointer'
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </div>
              </div>

              {/* Submit */}
              <button
                type='submit'
                className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'
              >
                Submit
              </button>
            </form>

            <p className='my-5'>
              Don’t have an account?{" "}
              <Link to={"/signup"} className='text-red-600 hover:text-red-700 hover:underline'>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </section>
    );
};

export default Login;
