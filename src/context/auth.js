import React from "react";
import { isSignedIn } from "../helper";
import AuthContext from "./authContext";

const Auth = ({ children }) => {
  return (
    <AuthContext.Provider value={isSignedIn()}>{children}</AuthContext.Provider>
  );
};

export default Auth;
