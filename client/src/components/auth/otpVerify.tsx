import { useEffect, useRef, useState, ChangeEvent, KeyboardEvent } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const OTP_LENGTH = 6;
const TIME_GAP = 45

const OtpVerify = () => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(TIME_GAP); // 1 minute
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const intentToken = localStorage.getItem("intentToken");

  // --------------------------
  // TIMER COUNTDOWN
  // --------------------------
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // --------------------------
  // SUBMIT OTP ON BUTTON CLICK
  // --------------------------
  const handleOtpSubmit = async () => {
    const combinedOtp = otp.join("");

    if (combinedOtp.length !== OTP_LENGTH) {
      toast.error("Please enter complete 6-digit OTP");
      return;
    }

    const formData = { otp: combinedOtp, intentToken };
    const response = await fetch('http://localhost:8080/api/v1/user/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    console.log(result);

    if (result.success) {
      toast.success("OTP verified successfully!");
      localStorage.removeItem("intentToken");
      navigate('/login');
    } else {
      toast.error("OTP verification failed: " + result.message);
    }
  };

  // --------------------------
  // HANDLE RESEND OTP
  // --------------------------
  const handleResend = async () => {
    if (!intentToken) return;

    setIsResending(true);

    const response = await fetch('http://localhost:8080/api/v1/user/resend-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intentToken })
    });

    const data = await response.json();
    setIsResending(false);

    if (data.success) {
      toast.success("OTP resent successfully!");
      setTimer(TIME_GAP);  // reset timer
      setOtp(Array(OTP_LENGTH).fill("")); // clear inputs
      inputRefs.current[0]?.focus();
    } else {
      toast.error("Failed to resend OTP.");
    }
  };

  // --------------------------
  // INPUT LOGIC
  // --------------------------
  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value.slice(-1);
    setOtp(updatedOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleClick = (index: number) => {
    inputRefs.current[index]?.setSelectionRange(1, 1);
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  if (!intentToken) {
    console.error("Intent token not found");
    return null;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <StyledWrapper>
        <form className="otp-Form" onSubmit={(e) => e.preventDefault()}>
          <span className="mainHeading">Enter OTP</span>
          <p className="otpSubheading mb-6">Please enter verification code sent to your email</p>

          <div className="inputContainer">
            {otp.map((value, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                required
                maxLength={1}
                type="text"
                className="otp-input"
                value={value}
                onChange={(e) => handleChange(index, e)}
                onClick={() => handleClick(index)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>

          <button className="verifyButton mt-8" type="button" onClick={handleOtpSubmit}>
            Verify
          </button>

          <p className="resendNote mt-3">
            Didn’t receive the code?
            <button
              type="button"
              className="resendBtn"
              disabled={timer > 0 || isResending}
              onClick={handleResend}
            >
              {timer > 0 ? `Resend in ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, "0")}` :
                isResending ? "Resending..." : "Resend Code"}
            </button>
          </p>
        </form>
      </StyledWrapper>
    </div>
  );
};

const StyledWrapper = styled.div`
  /* your existing styles */
  .otp-Form {
    width: 400px;
    height: 500px;
    background-color: rgb(255, 255, 255);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 30px;
    gap: 20px;
    position: relative;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.082);
    border-radius: 5px;
  }
  .mainHeading {
    font-size: 1.5em;
    font-weight: 700;
  }
  .otpSubheading {
    font-size: 1.1em;
    text-align: center;
  }
  .inputContainer {
    width: 100%;
    display: flex;
    gap: 14px;
    justify-content: center;
  }
  .otp-input {
    background-color: rgb(228, 228, 228);
    width: 40px;
    height: 40px;
    text-align: center;
    border: none;
    border-radius: 7px;
    outline: none;
    font-weight: 600;
  }
  .verifyButton {
    width: 80%;
    height: 40px;
    border: none;
    background-color: rgb(255, 80, 100);
    color: white;
    font-weight: 600;
    cursor: pointer;
    border-radius: 10px;
  }
  .resendBtn {
    background-color: transparent;
    border: none;
    color: rgb(225, 60, 85);
    cursor: pointer;
    font-size: 1.1em;
    margin-top: 6px;
  }
  .resendBtn:disabled {
    color: grey;
    cursor: not-allowed;
  }
`;

export default OtpVerify;
