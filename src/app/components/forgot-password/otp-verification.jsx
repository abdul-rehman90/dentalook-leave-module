import React, { useRef, useEffect, useState } from "react";

const OtpInput = ({ setOtp, otp }) => {
  const allowedOtpLength = 6;
  const [seconds, setSeconds] = useState(60);
  const [disable, setDisable] = useState(true);

  const otpInputs = Array.from({ length: allowedOtpLength }, () =>
    useRef(null)
  );

  const focusInput = (index) => {
    otpInputs[index]?.current?.focus();
  };

  const inputs = useRef([]);

  const handleInputChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value entered
    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  useEffect(() => {}, [otp]);

  const handleKeyDown = (e, idx) => {
    // Example: Move to previous input on Backspace
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputs.current[idx - 1].focus();
    }
  };

  const handleClick = (idx) => {
    // Example: Select the input value on click
    inputs.current[idx].select();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = pasted.split("");
    while (newOtp.length < 6) newOtp.push("");
    setOtp(newOtp);
    // Focus last filled input
    const lastIdx = newOtp.findIndex((v) => v === "");
    if (lastIdx === -1) {
      inputs.current[5].focus();
    } else {
      inputs.current[lastIdx].focus();
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
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputs.current[idx] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="w-10 h-10 border text-center text-xl rounded"
            value={digit}
            onKeyDown={(e) => handleKeyDown(e, idx)} // <-- Add this
            onClick={() => handleClick(idx)}
            onPaste={handlePaste}
            onChange={(e) =>
              handleInputChange(idx, e.target.value.replace(/\D/g, ""))
            }
          />
        ))}
      </div>

      {/* Resend Button */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <button
          type="button"
          disabled={disable}
          onClick={handleResend}
          className={`font-semibold transition-opacity ${
            disable
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
