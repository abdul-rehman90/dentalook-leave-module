'use client'
import Otpconfirmation from './otp-verification'
import React, { useState } from 'react';

const ForgotPasswordFlow = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        nextStep();
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        nextStep();
    };

    const handlePasswordReset = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        alert('Password reset successfully! 🎉');
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-xl rounded-xl mt-10">
            <div className="flex justify-between mb-8">
                {['Email', 'OTP', 'New Password'].map((label, index) => (
                    <div
                        key={index}
                        className={`w-full text-center border-b-2 pb-2 ${step === index + 1 ? 'border-blue-500 font-bold text-blue-600' : 'border-gray-300 text-gray-400'
                            }`}
                    >
                        {label}
                    </div>
                ))}
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
                    <button type="submit" className="w-full bg-[#00465F] text-white p-2 rounded">
                        Send OTP
                    </button>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                    {/* <label className="block text-gray-700">Enter OTP</label>
                    <input
                        type="text"
                        className="w-full border p-2 rounded"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <div className="flex justify-between">
                        <button type="button" onClick={prevStep} className="text-blue-500">Back</button>
                        <button type="submit" className="bg-[#00465F] text-white px-4 py-2 rounded">Verify OTP</button>
                    </div> */}
                    <Otpconfirmation />
                    <div className="flex items-center justify-between">
                        <button type="button" onClick={prevStep} className="text-blue-500">Back</button>
                        <button type="submit" className="w-fit bg-[#00465F] text-white py-2 px-4 rounded">

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
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Reset Password</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ForgotPasswordFlow;
