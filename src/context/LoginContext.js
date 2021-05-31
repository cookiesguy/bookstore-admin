import React, { useContext, useState } from "react";

const LoginContext = React.createContext();
const LoginUpdateContext = React.createContext();

export function useLogin() {
  return useContext(LoginContext);
}

export function useLoginUpdate() {
  return useContext(LoginUpdateContext);
}

export function LoginProvider({ children }) {
  const [login, setLogin] = useState({
    islogin: false,
  });
  const loggedIn = () => {
    setLogin(prevState => {
      return { ...prevState, islogin: !prevState.islogin };
    });
  };
  return (
    <LoginContext.Provider displayName="login" value={login}>
      <LoginUpdateContext.Provider displayName="loginUpdate" value={loggedIn}>
        {children}
      </LoginUpdateContext.Provider>
    </LoginContext.Provider>
  );
}
