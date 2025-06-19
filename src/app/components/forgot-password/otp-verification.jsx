import React, { useRef, useEffect, useState } from "react";

const OtpInput = ({setOtp, otp}) => {
    const allowedOtpLength = 6;
    const [seconds, setSeconds] = useState(60);
    const [disable, setDisable] = useState(true);

    const otpInputs = Array.from({ length: allowedOtpLength }, () => useRef(null));

    const focusInput = (index) => {
        otpInputs[index]?.current?.focus();
    };

    const handleInputChange = (index, value) => {
        if (value.length > 1) {
            value = value.slice(-1); 
        }

        otpInputs[index].current.value = value;

        if (value && index < otpInputs.length - 1) {
            focusInput(index + 1);
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
    };
    useEffect(() => {
    }, [otp]);

    const handleKeyDown = (index, e) => {
        const key = e.key;

        if (key === "ArrowLeft" && index > 0) {
            focusInput(index - 1);
        } else if (key === "ArrowRight" && index < otpInputs.length - 1) {
            focusInput(index + 1);
        } else if (key === "Backspace") {
            e.preventDefault();
            otpInputs[index].current.value = "";
            if (index > 0) focusInput(index - 1);
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").trim();

        if (!pasted) return;

        const chars = pasted.split("").slice(0, allowedOtpLength);

        chars.forEach((char, idx) => {
            if (otpInputs[idx]?.current) {
                otpInputs[idx].current.value = char;
            }
        });

        if (chars.length < allowedOtpLength) {
            focusInput(chars.length);
        } else {
            otpInputs[allowedOtpLength - 1]?.current?.blur();
        }
    };

    useEffect(() => {
        focusInput(0);
    }, []);

    useEffect(() => {
        if (seconds === 0) return;
        const timer = setInterval(() => {
            setSeconds((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [seconds]);

    useEffect(() => {
        setDisable(seconds !== 0);
    }, [seconds]);

    const handleResend = () => {
        setSeconds(60);
        otpInputs.forEach((inputRef) => {
            if (inputRef.current) inputRef.current.value = "";
        });
        focusInput(0);
    };



    return (
        <div className="flex flex-col items-center gap-6 mt-8">
            {/* OTP Boxes */}
            <div className="flex gap-3 justify-center">
                {otpInputs.map((ref, index) => (
                    <input
                        key={index}
                        ref={ref}
                        type="text"
                        maxLength={1}
                        placeholder="•"
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onClick={() => focusInput(index)}
                        onPaste={handlePaste}
                        className="w-12 h-12 text-center border border-gray-300 rounded-md text-2xl outline-none focus:ring-2 focus:ring-[#00465F] shadow-sm"
                    />
                ))}
            </div>

            {/* Resend Button */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <button
                    type="button"
                    disabled={disable}
                    onClick={handleResend}
                    className={`font-semibold transition-opacity ${disable
                        ? "text[-#00465F] cursor-not-allowed opacity-40"
                        : "text-[#00465F] hover:text-[#00465F] cursor-pointer opacity-100"
                        }`}
                >
                    Resend OTP
                </button>
                <span>({seconds}s)</span>
            </div>
        </div>
    );
};

export default OtpInput;
