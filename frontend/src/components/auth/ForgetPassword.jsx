import React from "react";

import Container from "../Container";
import Title from "../form/Title";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import CustomLink from "../CustomLink";
import FormContainer from "../form/FormContainer";
import { commonModalClasses } from "../../util/theme";
import { useState } from "react";
import { forgetPassword } from "../../api/auth";
import { isValidEmail } from "../../util/helper";
import { useNotification } from "../../hooks";

const ForgetPassword = () => {
  const { updateNotification } = useNotification();

  const [email, setEmail] = useState("");

  const handleChange = ({ target }) => {
    const { value } = target;
    setEmail(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email))
      return updateNotification("Invalid email!", "error");
    const { error, message } = await forgetPassword(email);

    if (error) return updateNotification(error, "error");

    updateNotification(message, "success");
  };

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses + " w-96"}>
          <Title>Please Enter Your Email</Title>
          <FormInput
            value={email}
            onChange={handleChange}
            label="Email"
            placeholder="sandeep@gmail.com"
            name="email"
          />
          <Submit value="Send Link" />
          <div className="flex justify-between">
            <CustomLink to="/auth/signin">Sign in</CustomLink>
            <CustomLink to="/auth/signup">Sign up</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
};

export default ForgetPassword;
