import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import Container from "../Container";

const NotVerified = () => {
  const {
    authInfo: { isLoggedIn, profile },
  } = useAuth();
  const navigate = useNavigate();

  const isVerified = profile?.isVerified;

  const navigateToVerification = () => {
    navigate("/auth/verification", {
      state: {
        user: profile,
      },
    });
  };

  return (
    <Container>
      {isLoggedIn && !isVerified ? (
        <p className="text-lg text-center bg-blue-50 p-2">
          It looks like yo haven't verified your account,{" "}
          <button
            onClick={navigateToVerification}
            className="text-blue-500 font-semibold hover:underline"
          >
            Click here to verify your account.
          </button>
        </p>
      ) : null}
    </Container>
  );
};

export default NotVerified;
