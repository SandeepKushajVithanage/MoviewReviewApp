import React from "react";
import AuthProvider from "./AuthProvider";

import NotificationProvider from "./NotificationProvider";
import ThemeProvider from "./ThemeProvider";

const ContextProviders = ({ children }) => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </AuthProvider>
    </NotificationProvider>
  );
};

export default ContextProviders;
