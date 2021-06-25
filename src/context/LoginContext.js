import React, { useContext, useState, useEffect } from 'react';
import { isUndefined } from 'lodash';

const LoginContext = React.createContext();

export function useLogin() {
   return useContext(LoginContext);
}

export default function LoginProvider({ children }) {
   const [login, setLogin] = useState(false);

   const changeLoginState = () => {
      setLogin(!login);
      localStorage.setItem('isLogin', !login);
   };

   useEffect(() => {
      const isLogin = localStorage.getItem('isLogin');
      if (!isUndefined(isLogin)) {
         setLogin(Boolean(isLogin));
      } else localStorage.setItem('isLogin', isLogin);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return (
      <LoginContext.Provider
         displayName="login"
         value={{ login, changeLoginState }}
      >
         {children}
      </LoginContext.Provider>
   );
}
