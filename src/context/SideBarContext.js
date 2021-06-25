import React, { useContext, useState } from 'react';

const SideBarContext = React.createContext();

export function useTransition() {
   return useContext(SideBarContext);
}

export default function SideBarProvider({ children }) {
   const [isVisible, setIsVisible] = useState(false);
   const toggleSideBarVisible = value => {
      setIsVisible(value);
   };

   return (
      <SideBarContext.Provider
         displayName="sidebar"
         value={{
            isVisible,
            toggleSideBarVisible,
         }}
      >
         {children}
      </SideBarContext.Provider>
   );
}
