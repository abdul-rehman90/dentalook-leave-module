'use client'
import axios from 'axios';
import Otpconfirmation from './otp-verification'
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import loader from "../../../common/assets/icons/loader.svg"
import Image from 'next/image';
import logo from "../../../common/assets/images/main-logo.svg"

const ForgotPasswordFlow = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
   const [otp, setOtp] = useState(Array(6).fill(''));
    const [otpValue, setOtpValue] = useState(''); 
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');    
    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);
    const [emailLoading, setEmailLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setEmailLoading(true);
        const payload = {
            email : email
        }
        try{
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/forgot-password/`, payload);
            if (res.status === 200) {
                toast.success(res.data.message);
                nextStep();
            } 
        }
        catch(error){
            toast.error(error.response?.data?.email[0]);
        }
        finally{
            setEmailLoading(false);
        }
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        setOtpValue(otp.join(''));
        nextStep();
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Passwords don't match!");
            return;
        }
        setIsLoading(true);
        const payload = {
            email: email,
            otp: parseInt(otpValue),
            new_password: newPassword,
            confirm_password: confirmPassword
        }
        try{
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/reset-password/`, payload);
                if (res.status === 200) {
                    toast.success(res.data.message);
                    router.push("/")
                } 
        }
        catch(error){
            toast.error(error.response?.data?.message);
        }
        finally{
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-xl rounded-xl mt-10">
            {/* <div className="flex justify-between mb-8">
                {['Email', 'OTP', 'New Password'].map((label, index) => (
                    <div
                        key={index}
                        className={`w-full text-center border-b-2 pb-2 ${step === index + 1 ? 'border-blue-500 font-bold text-blue-600' : 'border-gray-300 text-gray-400'
                            }`}
                    >
                        {label}
                    </div>
                ))}
            </div> */}
            <div>
                <Image src={logo} alt="" width={150} height={150} className='mx-auto' />
            </div>

            {step === 1 && (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <label className="block text-gray-700">Email address</label>
                    <input
                        type="email"
                        className="w-full border p-2 rounded"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit" disabled={emailLoading} className="w-full bg-[#00465F] disabled:opacity-[0.7] disabled:cursor-not-allowed text-white p-2 rounded">
                        {emailLoading ? <Image src={loader} alt="" width={24} height={24} className="mx-auto" /> : 'Send OTP'}
                    </button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                    <h6 className='text-center my-2 text-[18px]'>OTP Verification</h6>
                    <Otpconfirmation setOtp={setOtp} otp={otp} />
                    <div className="flex items-center justify-between">
                        <button type="button" onClick={prevStep} className="text-blue-500">Back</button>
                        <button type="submit" disabled={otp.some(digit => digit === '')} className="w-fit disabled:cursor-not-allowed cursor-pointer bg-[#00465F] text-white py-2 px-4 rounded">

                            Verify</button>

                    </div>
                </form>
            )}

            {step === 3 && (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                    <label className="block text-gray-700">New Password</label>
                    <input
                        type="password"
                        className="w-full border p-2 rounded"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <label className="block text-gray-700">Confirm Password</label>
                    <input
                        type="password"
                        className="w-full border p-2 rounded"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <div className="flex justify-between">
                        <button type="button" onClick={prevStep} className="text-blue-500">Back</button>
                        <button type="submit" disabled={isLoading} className="bg-[#00465F] cursor-pointer disabled:opacity-[0.7] disabled:cursor-not-allowed text-white px-4 py-2 rounded">
                            {isLoading ? <Image src={loader} alt="" width={24} height={24} className="mx-auto" /> : 'Reset Password'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ForgotPasswordFlow;
