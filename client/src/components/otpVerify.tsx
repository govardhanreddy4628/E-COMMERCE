import { useEffect, useRef, useState, ChangeEvent, KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const OTP_LENGTH = 6;

const OtpVerify = () => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  console.log(inputRefs)


  const handleOtpSubmit = async (combinedOtp: string) => {
    const formData = { "otp": combinedOtp, "intentToken": intentToken };
    const response = await fetch('http://localhost:8080/api/v1/user/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const result = await response.json();
    console.log(response);
    console.log(result);
    if (result.success) {
      alert("OTP verified successfully!");
      localStorage.removeItem("intentToken");
      //window.location.href = '/login';  // dont use this because it is Native browser navigation. it Forces a full page reload. Breaks React’s single-page behavior. The entire app reloads from scratch.
      navigate('/login'); // Performs in-app navigation without reloading the page or without reloading the app.
    } else {
      alert("OTP verification failed: " + result.message);
    }
  };

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value.slice(-1); // only keep the last digit
    setOtp(updatedOtp);

    const combinedOtp = updatedOtp.join("");
    if (combinedOtp.length === OTP_LENGTH && !updatedOtp.includes("")) {
      handleOtpSubmit(combinedOtp);
    }

    // Move to next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleClick = (index: number) => {
    inputRefs.current[index]?.setSelectionRange(1, 1);

    // Optional: focus on the first empty input
    if (index > 0 && !otp[index - 1]) {
      const firstEmptyIndex = otp.findIndex(val => val === "");
      if (firstEmptyIndex !== -1) {
        inputRefs.current[firstEmptyIndex]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (inputRefs.current[0]) (inputRefs.current[0]?.focus())
  }, []
  );

  const intentToken = localStorage.getItem("intentToken");

  if (!intentToken) {
    console.error("Intend token not found in localStorage");
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
                id={`otp-input-${index + 1}`}
                value={value}
                onChange={(e) => handleChange(index, e)}
                onClick={() => handleClick(index)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>
          <button className="verifyButton mt-8" type="submit">Verify</button>
          <p className="resendNote mt-3">
            Didn't receive the code? <button type="button" className="resendBtn">Resend Code</button>
          </p>
        </form>
      </StyledWrapper>
    </div>
  );
};


const StyledWrapper = styled.div`
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
    color: rgb(15, 15, 15);
    font-weight: 700;
  }

  .otpSubheading {
    font-size: 1.1em;
    color: black;
    line-height: 20px;
    text-align: center;
    word-spacing: 1px
  }

  .inputContainer {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 14px;
    align-items: center;
    justify-content: center;
  }

  .otp-input {
    background-color: rgb(228, 228, 228);
    width: 40px;
    height: 40px;
    text-align: center;
    border: none;
    border-radius: 7px;
    caret-color: rgb(127, 129, 255);
    color: rgb(44, 44, 44);
    outline: none;
    font-weight: 600;
  }

  .otp-input:focus,
  .otp-input:valid {
    background-color: rgba(225, 129, 127, 0.199);
    transition-duration: .3s;
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
    transition-duration: .2s;
  }

  .verifyButton:hover {
    background-color: rgb(0, 0, 0);
    transition-duration: .2s;
  }

  .resendNote {
    font-size: 1.0em;
    color: black;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }

  .resendBtn {
    background-color: transparent;
    border: none;
    color: rgb(225, 60, 85);
    cursor: pointer;
    font-size: 1.2em;
    font-weight: 700;
  }`;

export default OtpVerify;
