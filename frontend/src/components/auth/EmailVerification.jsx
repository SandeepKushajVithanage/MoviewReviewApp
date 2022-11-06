import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Container from "../Container";
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import CustomLink from "../CustomLink";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import FormContainer from "../form/FormContainer";
import { commonModalClasses } from "../../util/theme";
import { resendEmailVerificationToken, veriyUserEmail } from "../../api/auth";
import { useAuth, useNotification } from "../../hooks";

const OTP_LENGTH = 6;

const isValidOTP = (otp) => {
  let valid = false;

  for (let val of otp) {
    if (isNaN(parseInt(val))) {
      valid = true;
      break;
    }
  }

  return !valid;
};

const EmailVerification = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { updateNotification } = useNotification();

  const user = state?.user;

  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);

  const inputRef = useRef();

  const { isAuth, authInfo } = useAuth();
  const { isLoggedIn, profile } = authInfo;

  const isVerified = profile?.isVerified;

  const focusNextInputField = (index) => {
    setActiveOtpIndex(index + 1);
  };

  const focusPrevInputField = (index) => {
    let nextIndex = index === 0 ? 0 : index - 1;
    setActiveOtpIndex(nextIndex);
  };

  const handleOtpChange = ({ target }, index) => {
    const { value } = target;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1, value.length);
    setOtp(newOtp);
    if (!value) focusPrevInputField(index);
    else focusNextInputField(index);
  };

  const handleKeyDown = ({ key, target }, index) => {
    const { value } = target;
    if (!value && key === "Backspace") {
      focusPrevInputField(index);
    }
  };

  const handleOnFocus = (index) => {
    setActiveOtpIndex(index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidOTP(otp)) return updateNotification("Invalid OTP!", "error");

    const {
      error,
      message,
      user: userResponse,
    } = await veriyUserEmail({
      OTP: otp.join(""),
      userId: user.id,
    });

    if (error) return updateNotification(error, "error");
    updateNotification(message, "success");
    localStorage.setItem("auth-token", userResponse.token);
    isAuth();
  };

  const handleOTPResend = async () => {
    const { error, message } = await resendEmailVerificationToken(user.id);
    if (error) return updateNotification(error, "error");
    updateNotification(message, "success");
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  useEffect(() => {
    if (!user) navigate("/not-found");
    if (isLoggedIn && isVerified) navigate("/");
  }, [user, isLoggedIn, isVerified]);

  // if (!user) return null;

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses}>
          <div>
            <Title>Please enter the OTP to verify your account</Title>
            <p className="text-center dark:text-dark-subtle text-light-subtle">
              OTP has been sent to your email
            </p>
          </div>
          <div className="flex justify-center items-center space-x-4">
            {otp.map((_, index) => {
              return (
                <input
                  ref={activeOtpIndex === index ? inputRef : null}
                  key={index}
                  type="number"
                  value={otp[index] || ""}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={(e) => handleOnFocus(index)}
                  className="spin-button-none w-12 h-12 border-2 rounded dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary bg-transparent outline-none text-center dark:text-white text-primary font-semibold text-xl"
                />
              );
            })}
          </div>
          <div>
            <Submit value="Verify Account" />
            <button
              onClick={handleOTPResend}
              type="button"
              className="dark:text-white text-blue-500 font-semibold hover:underline mt-2"
            >
              I don't have OTP
            </button>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
};

export default EmailVerification;
