import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Formik, Form, Field, } from 'formik';
import * as Yup from 'yup';
import { Button } from '@mui/material';
import { FaSpinner } from 'react-icons/fa';
import signinGif from "../../assets/signin.gif"


interface SignupResponse {
    success?: boolean;
    error?: boolean;
    msg: string;
    intentToken?: string;
}



// Validation schema using Yup
const SignupSchema = Yup.object().shape({
    name: Yup.string()
        .min(3, 'name must be at least 3 characters')
        .max(15, 'name must be less than 15 characters')
        .required('name is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm Password is required'),
});





const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const navigate = useNavigate()

    // const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = e.target;
    //     setData(prev => ({ ...prev, [name]: value }));
    // };


    const imageTobase64 = async (image: File): Promise<string | ArrayBuffer | null> => {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        return new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleUploadPic = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e?.target?.files?.[0]
        console.log(file);
        if (file) {
            const imagePic = await imageTobase64(file);
            setImagePreview(imagePic as string || null);
            setSelectedFile(file);
        }
    }

    const handleSubmit = async (
        values: { name: string; email: string; password: string; confirmPassword: string },
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        try {
            const formData = new FormData();
            formData.append('fullName', values.name);
            formData.append('email', values.email);
            formData.append('password', values.password);
            if (selectedFile) { formData.append('avatar', selectedFile); }

            const response = await fetch('http://localhost:8080/api/v1/user/register', { method: 'POST', body: formData });
            const result: SignupResponse = await response.json();
            console.log(response)
            console.log(result)
            localStorage.setItem('intentToken', result.intentToken || '');

            if (response?.ok) {
                toast.success(result.msg);
                navigate('/otpverify');
            } else {
                toast.error(result.msg || 'Signup failed');
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Something went wrong!');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>

            <section id="signup">
                <div className="mx-auto container p-4 mt-8">
                    <div className="bg-white p-5 w-full max-w-sm mx-auto shadow-lg rounded-lg">
                        <div className="w-20 h-20 mx-auto relative overflow-hidden rounded-full">
                            <img src={imagePreview || signinGif } alt="Profile" />
                            <label>
                                <div className="text-xs bg-opacity-80 bg-slate-200 pb-4 pt-2 cursor-pointer text-center absolute bottom-0 w-full">
                                    Upload Photo
                                </div>
                                <input type="file" className="hidden" onChange={handleUploadPic} />  {/*add multiple attribute if u want to select to multiple images*/}
                            </label>
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
                            {({ isSubmitting, touched, errors, values }) => (
                                <Form className="pt-6 flex flex-col gap-2">
                                    {/* Name Field */}
                                    <div className="grid">
                                        <label>Name:</label>
                                        <div className="bg-slate-100 p-2">
                                            <Field
                                                type="text"
                                                name="name"
                                                placeholder="Enter your name"
                                                className="w-full h-full outline-none bg-transparent"
                                            />
                                        </div>
                                        {touched.name && errors.name && (
                                            <div className="text-red-500 text-sm">{errors.name}</div>
                                        )}
                                    </div>

                                    {/* Email Field */}
                                    <div className="grid">
                                        <label>Email:</label>
                                        <div className="bg-slate-100 p-2">
                                            <Field
                                                type="email"
                                                name="email"
                                                placeholder="Enter email"
                                                className="w-full h-full outline-none bg-transparent"
                                                required
                                            />
                                        </div>
                                        {touched.email && errors.email && (
                                            <div className="text-red-500 text-sm">{errors.email}</div>
                                        )}
                                    </div>

                                    {/* Password Field */}
                                    <div>
                                        <label>Password:</label>
                                        <div className="bg-slate-100 p-2 flex">
                                            <Field
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                placeholder="Enter password"
                                                className="w-full h-full outline-none bg-transparent"
                                            />
                                            <div
                                                className="cursor-pointer text-xl"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </div>
                                        </div>
                                        {touched.password && errors.password && (
                                            <div className="text-red-500 text-sm">{errors.password}</div>
                                        )}
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div>
                                        <label>Confirm Password:</label>
                                        <div className="bg-slate-100 p-2 flex">
                                            <Field
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                placeholder="Confirm password"
                                                className="w-full h-full outline-none bg-transparent"
                                            />
                                            <div
                                                className="cursor-pointer text-xl"
                                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            >
                                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                            </div>
                                        </div>
                                        {touched.confirmPassword && errors.confirmPassword && (
                                            <div className="text-red-500 text-sm">{errors.confirmPassword}</div>
                                        )}
                                    </div>


                                    <button
                                        type="submit"
                                        disabled={isSubmitting || Object.values(values).some(val => !val)}
                                        className={`${isSubmitting
                                                ? 'bg-black text-white cursor-wait'
                                                : 'bg-red-600 hover:bg-red-700 text-white'
                                            } px-6 py-2 w-full max-w-[180px] rounded-[8px] transition-all mx-auto mt-6 flex items-center justify-center gap-2`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <FaSpinner className="animate-spin text-white !text-[18px]" />
                                                <span>Submitting...</span>
                                            </>
                                        ) : (
                                            'Sign Up'
                                        )}
                                    </button>




                                </Form>
                            )}
                        </Formik>


                        <p className="my-5">
                            Already have an account?{' '}
                            <Link to="/login" className="text-red-600 hover:text-red-700 hover:underline">
                                Login
                            </Link>
                        </p>

                        <Button className='flex gap-3 w-full !bg-[#f1f1f1] btn-lg !text-black'>
                            <FcGoogle className="!text-[20px]" />Login with Google
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}

export default SignUp;






