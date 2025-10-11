// components/Auth/Login.tsx 

'use client';
import Image from 'next/image';
import { ChangeEvent, FormEvent } from 'react';
import PasswordInput from './PasswordInput'; 
import LoadingButton from '../Helper/LoadingButton';
import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { BASE_API_URL } from '@/server';
import { handleAuthRequest } from '../utils/apiRequest';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setAuthUser ,setToken } from '@/store/authSlice';
import { useRouter } from 'next/navigation';

interface FormData {
    email: string;
    password: string;
}

const Login = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        // create our request
        const loginReq = async () => await axios.post(`${BASE_API_URL}/auth/login`, formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
        });
        const result = await handleAuthRequest(loginReq, setIsLoading);
        if (result) {
             const receivedToken = result.data.token;
            dispatch(setAuthUser(result.data.data.user));
              if (receivedToken) {
                 dispatch(setToken(receivedToken));
             }
            toast.success(result.data.message);
            router.push('/');
        }
    };


    return (
        <div className="w-full min-h-screen flex items-center justify-center
         bg-gradient-to-br from-blue-50 via-white to-yellow-50 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 w-full h-full">
                {/*صورة جانبية*/}
                <div className="lg:col-span-2 min-h-screen hidden lg:block relative">
                    <Image
                        src="/images/signup-banner3.jpg"
                        alt="Login Banner"
                        layout="fill"
                        objectFit="cover"
                        priority
                        className="rounded-r-3xl shadow-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60
                     via-blue-100/40 to-yellow-100/40 rounded-r-3xl"></div>
                </div>
                {/* بطاقة تسجيل الدخول */}
                <div className="lg:col-span-3 flex flex-col items-center justify-center
                 min-h-screen p-2 sm:p-4 bg-transparent">
                    <div className="w-full max-w-xs sm:max-w-md p-4 sm:p-8 bg-white/90 
                    border border-blue-100 rounded-2xl shadow-xl transition-all duration-300">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-center uppercase 
                        mb-4 sm:mb-6 text-blue-500 tracking-wide">
                            LOGIN
                        </h1>
                        <p className="text-xs sm:text-sm text-center text-gray-500 mb-2 sm:mb-4">
                            Log in to KH Media App and continue connecting!
                        </p>
                        <form onSubmit={handleSubmit} className="block w-full space-y-3 sm:space-y-5">
                            {/* حقل الإيميل */}
                            <div>
                                <label htmlFor="email" className="block font-semibold mb-1 sm:mb-2 text-xs
                                 sm:text-sm text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter Email Address"
                                    className="px-3 py-2 sm:px-4 sm:py-3 bg-blue-50 border border-blue-200 
                                    rounded-lg w-full block outline-none focus:ring-2 focus:ring-blue-400 
                                    focus:border-blue-400 transition duration-200 text-sm"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            {/* حقل كلمة المرور */}
                            <div>
                                <PasswordInput
                                    name="password"
                                    label="Password"
                                    placeholder="Enter Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <Link href="/auth/forget-password"
                                    className="text-xs sm:text-sm text-blue-500 hover:text-blue-400 
                                    mt-1 sm:mt-2 block cursor-pointer font-medium text-right transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
                            {/* زر الدخول */}
                            <LoadingButton
                                size={"lg"}
                                className="w-full mt-2 sm:mt-4 rounded-lg shadow-lg bg-blue-500 
                                text-white font-bold hover:bg-blue-600 transition-all duration-300 text-base sm:text-lg"
                                type="submit"
                                isLoading={isLoading}
                            >
                                Log In
                            </LoadingButton>
                        </form>
                    </div>
                    {/* رابط التسجيل */}
                    <h1 className="mt-4 sm:mt-8 text-xs sm:text-base text-gray-600 text-center">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/signup">
                            <span className="text-blue-500 hover:text-blue-400 underline cursor-pointer font-bold transition-colors">Sign Up Here</span>
                        </Link>
                    </h1>
                </div>
            </div>
        </div>
    )
}

export default Login;