import React from "react";

import Container from "../Container";
import Title from "../form/Title";
import CustomLink from "../CustomLink";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import FormContainer from "../form/FormContainer";
import { commonModalClasses } from "../../util/theme";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { ImSpinner3 } from "react-icons/im";
import { resetPassword, verifyPasswordResetToken } from "../../api/auth";
import { useNotification } from "../../hooks";
import { useEffect } from "react";

const ConfirmPassword = () => {
  const [searchParams] = useSearchParams();
  const { updateNotification } = useNotification();
  const navigate = useNavigate();

  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [password, setPassword] = useState({
    one: "",
    two: "",
  });

  const token = searchParams.get("token");
  const id = searchParams.get("id");

  const handleChange = ({ target }) => {
    const { name, value } = target;

    setPassword({ ...password, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.one.trim())
      return updateNotification("Password is missing!", "error");
    if (password.one.trim().length < 8)
      return updateNotification("Password must be 8 characters long!", "error");
    if (password.one !== password.two)
      return updateNotification("Password do not match!", "error");

    const { error, message } = await resetPassword({
      newPassword: password.one,
      userId: id,
      token,
    });

    if (error) return updateNotification(error, "error");

    updateNotification(message, "success");
    navigate("/auth/signin", { replace: true });
  };

  const isValidToken = async () => {
    const { error, valid } = await verifyPasswordResetToken(token, id);

    setIsVerifying(false);

    if (error) {
      navigate("/auth/reset-password", { replace: true });
      return updateNotification(error, "error");
    }

    if (!valid) {
      setIsValid(false);
      return navigate("/auth/reset-password", { replace: true });
    }

    setIsValid(true);
  };

  useEffect(() => {
    isValidToken();
  }, []);

  if (isVerifying) {
    return (
      <FormContainer>
        <Container>
          <div className="flex space-x-2 items-center">
            <h1 className="text-4xl font-semibold dark:text-white text-primary">
              Please wait, we are verifying your token!
            </h1>
            <ImSpinner3 className="animate-spin text-4xl dark:text-white text-primary" />
          </div>
        </Container>
      </FormContainer>
    );
  }

  if (!isValid) {
    return (
      <FormContainer>
        <Container>
          <div className="flex space-x-2 items-center">
            <h1 className="text-4xl font-semibold dark:text-white text-primary">
              Sorry, the token is invalid!
            </h1>
            <ImSpinner3 className="animate-spin text-4xl dark:text-white text-primary" />
          </div>
        </Container>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses + " w-96"}>
          <Title>Enter New Password</Title>
          <FormInput
            value={password.one}
            onChange={handleChange}
            label="New Password"
            placeholder="********"
            name="one"
            type="password"
          />
          <FormInput
            value={password.two}
            onChange={handleChange}
            label="Confirm Password"
            placeholder="********"
            name="two"
            type="password"
          />
          <Submit value="Confirm Password" />
        </form>
      </Container>
    </FormContainer>
  );
};

export default ConfirmPassword;
