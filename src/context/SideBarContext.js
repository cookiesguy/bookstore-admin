import React, { useContext, useState } from 'react';

const SideBarContext = React.createContext();

export function useTransition() {
   return useContext(SideBarContext);
}

export default function SideBarProvider({ children }) {
   const [isVisible, setIsVisible] = useState(true);
   const [isClickFromNav, setIsClickFromNav] = useState(false);
   const toggleSideBarVisible = () => {
      setIsVisible(!isVisible);
   };
   const toggleClickFromNav = value => {
      setIsClickFromNav(value);
   };

   return (
      <SideBarContext.Provider
         displayName="sidebar"
         value={{
            isVisible,
            toggleSideBarVisible,
            isClickFromNav,
            toggleClickFromNav,
         }}
      >
         {children}
      </SideBarContext.Provider>
   );
}
