'use client'
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { use, useState } from 'react';
import toast from 'react-hot-toast';

const Login = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        // showPassword: false,
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
        // if (!formData.email || !formData.password) {
        //     alert('Please enter email and password 🥺');
        //     return;
        // }

        try{
                const res = await axios.post('https://6da8-39-53-116-251.ngrok-free.app/api/v1/login/', formData);
                if (res.status === 200) {
                    toast.success('Login successful!');
                    router.push('/view-request');
                } 
        }
        catch{
            console.log(error)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-sm"
            >
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

                {/* Email */}
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-1 text-sm font-medium">
                        Email
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="you@example.com"
                    />
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
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="••••••••"
                    />
                    <span
                        onClick={togglePassword}
                        className="absolute right-3 top-9 text-sm cursor-pointer text-blue-600"
                    >
                        {formData.showPassword ? 'Hide' : 'Show'}
                    </span>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full bg-[#335679] text-white py-2 px-6 rounded-md hover:bg-[#334779] transition-all duration-300"
                >
                    Log In
                </button>
            </form>
        </div>
    );
};

export default Login;
