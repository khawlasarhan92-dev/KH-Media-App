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
import { setAuthUser } from '@/store/authSlice';
import { useRouter } from 'next/navigation';

interface FormData {
    username: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

const Signup = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: '',
        passwordConfirm: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        // create our request
        const signupReq = async () => await axios.post(`${BASE_API_URL}/auth/signup`, formData, {
            withCredentials: true,
        });
        const result = await handleAuthRequest(signupReq, setIsLoading);
        if (result) {
            dispatch(setAuthUser(result.data.data.user));
            toast.success(result.data.data.message);
            router.push('/auth/verify');

        }

    };


    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br 
        from-blue-50 via-white to-yellow-50 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 w-full h-full">
                <div className="lg:col-span-2 min-h-screen hidden lg:block relative">
                    <Image
                        src="/images/signup-banner.jpg"
                        alt="Signup Banner"
                        layout="fill"
                        objectFit="cover"
                        priority
                        className="rounded-r-3xl shadow-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br
                     from-white/60 via-blue-100/40 to-yellow-100/40 rounded-r-3xl"></div>
                </div>
                {/* بطاقة التسجيل */}
                <div className="lg:col-span-3 flex flex-col items-center justify-center
                 min-h-screen p-2 sm:p-4 bg-transparent">
                    <div className="w-full max-w-xs sm:max-w-md p-4 sm:p-8 bg-white/90 
                    border border-blue-100 rounded-2xl shadow-xl transition-all duration-300">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-center uppercase
                         mb-4 sm:mb-6 text-blue-500 tracking-wide">
                            SIGN UP
                        </h1>
                        <p className="text-xs sm:text-sm text-center text-gray-500 mb-2 sm:mb-4">
                            Join KH Media App and start sharing your moments!
                        </p>
                        <form onSubmit={handleSubmit} className="block w-full space-y-3 sm:space-y-5">
                            <div>
                                <label htmlFor="username" className="block font-semibold mb-1 
                                sm:mb-2 text-xs sm:text-sm text-gray-700">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Choose a Username"
                                    className="px-3 py-2 sm:px-4 sm:py-3 bg-blue-50 border border-blue-200 
                                    rounded-lg w-full block outline-none focus:ring-2 focus:ring-blue-400 
                                    focus:border-blue-400 transition duration-200 text-sm"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block font-semibold mb-1 sm:mb-2 text-xs 
                                sm:text-sm text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter Email Address"
                                    className="px-3 py-2 sm:px-4 sm:py-3 bg-blue-50 border
                                     border-blue-200 rounded-lg w-full block outline-none focus:ring-2 
                                     focus:ring-blue-400 focus:border-blue-400 transition duration-200 text-sm"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <PasswordInput
                                    name="password"
                                    label="Password"
                                    placeholder="Create a Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <PasswordInput
                                    name="passwordConfirm"
                                    label="Confirm Password"
                                    placeholder="Confirm Your Password"
                                    value={formData.passwordConfirm}
                                    onChange={handleChange}
                                />
                            </div>
                            <LoadingButton
                                size={"lg"}
                                className="w-full mt-2 sm:mt-4 rounded-lg shadow-lg bg-blue-500 text-white font-bold hover:bg-blue-600 transition-all duration-300 text-base sm:text-lg"
                                type="submit"
                                isLoading={isLoading}
                            >
                                Sign Up
                            </LoadingButton>
                        </form>
                    </div>
                    <h1 className="mt-4 sm:mt-8 text-xs sm:text-base text-gray-600 text-center">
                        Already have an account?{" "}
                        <Link href="/auth/login">
                            <span className="text-blue-500 hover:text-blue-400 underline cursor-pointer font-bold transition-colors">Log In</span>
                        </Link>
                    </h1>
                </div>
            </div>
        </div>
    )
}

export default Signup;