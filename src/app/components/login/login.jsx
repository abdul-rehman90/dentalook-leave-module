'use client'
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { use, useState } from 'react';
import toast from 'react-hot-toast';
import loader from "../../../common/assets/icons/loader.svg"
import Image from 'next/image';
import Cookies from "js-cookie";
import logo from "../../../common/assets/images/main-logo.svg"
import { useAuth } from '../../utils/AuthContext';
import axiosInstance from "../../../utils/axios-instance"
 

const Login = () => {
    const { setUserData } = useAuth();
    const router = useRouter();
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const togglePassword = () => {
        setFormData(prev => ({ ...prev, showPassword: !prev.showPassword }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            return setIsError(true);
        }
        const paylaod = {
            email: formData.email.trim(),
            password: formData.password.trim(),
        }
        setIsLoading(true);
        try{
            const res = await axiosInstance.post(`api/v1/login/`, paylaod);
            if (res.status === 200) {
                toast.success('Login successful!');
                Cookies.set('access-token', res?.data?.access);
                Cookies.set('refresh-token', res?.data?.refresh);
                Cookies.set('role', res?.data?.user?.role);
                router.push('/select-role');
                setUserData(res.data.user); 
            } 
        }
        catch(error){
            toast.error(error.response?.data?.detail);
        }
        finally{
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-sm"
            >
                <Image src={logo} alt="" width={150} height={150} className='mx-auto' />
                <h2 className="text-2xl font-bold text-center mb-5 mt-5">Login</h2>

                {/* Email */}
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-1 text-sm font-medium">
                        Email
                    </label>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="you@example.com"
                    />
                    {
                        isError && !formData.email && (
                            <p className="text-red-500 text-sm mt-1">Name is required</p>
                        )
                    }
                </div>

                {/* Password */}
                <div className="mb-4 relative">
                    <label htmlFor="password" className="block mb-1 text-sm font-medium">
                        Password
                    </label>
                    <input
                        type={formData.showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="••••••••"
                    />
                    <span
                        onClick={togglePassword}
                        className="absolute right-3 top-9 text-sm cursor-pointer text-blue-600"
                    >
                        {formData.showPassword ? 'Hide' : 'Show'}
                    </span>
                    {
                        isError && !formData.password && (
                            <p className="text-red-500 text-sm mt-1">Password is required</p>
                        )
                    }
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#335679] disabled:opacity-50 disabled:cursor-not-allowed text-center text-white py-2 px-6 rounded-md hover:bg-[#334779] transition-all duration-300"
                >
                   {isLoading ? <Image src={loader} width={24} height={24} alt="" className='mx-auto' /> : 'Login'}
                </button>
                 <Link
                        href='/forgot-password'
                        className="mt-3 block"
                    >
                        Forgot Password?
                    </Link>
            </form>
        </div>
    );
};

export default Login;
