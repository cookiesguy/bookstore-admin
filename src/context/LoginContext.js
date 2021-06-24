import React, { useContext, useState } from 'react';

const LoginContext = React.createContext();

export function useLogin() {
   return useContext(LoginContext);
}

export default function LoginProvider({ children }) {
   const [login, setLogin] = useState(false);

   const changeLoginState = () => {
      setLogin(!login);
   };

   return (
      <LoginContext.Provider
         displayName="login"
         value={{ login, changeLoginState }}
      >
         {children}
      </LoginContext.Provider>
   );
}
