import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../api/auth";
import { useAuth, useNotification } from "../../hooks";
import { isValidEmail } from "../../util/helper";
import { commonModalClasses } from "../../util/theme";
import Container from "../Container";
import CustomLink from "../CustomLink";
import FormContainer from "../form/FormContainer";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import Title from "../form/Title";

const validateUserInfo = ({ name, email, password }) => {
  const isValidName = /^[a-z A-Z]+$/;

  if (!name.trim()) return { ok: false, error: "Name is missing!" };
  if (!isValidName.test(name)) return { ok: false, error: "Invalid name!" };
  if (!email.trim()) return { ok: false, error: "Email is missing!" };
  if (!isValidEmail(email)) return { ok: false, error: "Invalid email!" };
  if (!password.trim()) return { ok: false, error: "Password is missing!" };
  if (password.length < 8)
    return { ok: false, error: "Password must be 8 characters long!" };

  return { ok: true };
};

const Signup = () => {
  const navigate = useNavigate();

  const { updateNotification } = useNotification();
  const { authInfo } = useAuth();
  const { isLoggedIn } = authInfo;

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ok, error } = validateUserInfo(userInfo);

    if (!ok) return updateNotification(error, "error");

    const response = await createUser(userInfo);
    if (response.error) return updateNotification(response.error, "error");
    navigate("/auth/verification", {
      state: { user: response.user },
      replace: true,
    });
  };

  const { name, email, password } = userInfo;

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn]);

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses + " w-72"}>
          <Title>Sign up</Title>
          <FormInput
            value={name}
            onChange={handleChange}
            label="Name"
            placeholder="Sandeep Vithanage"
            name="name"
          />
          <FormInput
            value={email}
            onChange={handleChange}
            label="Email"
            placeholder="sandeep@email.com"
            name="email"
            // type="email"
          />
          <FormInput
            value={password}
            onChange={handleChange}
            label="Password"
            placeholder="********"
            name="password"
            type="password"
          />
          <Submit value="Sign up" />
          <div className="flex justify-between">
            <CustomLink to="/auth/forget-password">Forget password</CustomLink>
            <CustomLink to="/auth/signin">Sign in</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
};

export default Signup;
