import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { createContext } from 'react';
export const MobileResponsivenessContext = createContext();
const MobileResponsiveness = ({children}) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth<=768);
     useEffect(() => {
         const handleResize = () => {
           setIsMobile(window.innerWidth <=768);
         };
     
         window.addEventListener("resize", handleResize);
         handleResize(); // Ensure it runs on mount
     
         return () => window.removeEventListener("resize", handleResize);
       }, []);
  return (
    <div >
        <MobileResponsivenessContext.Provider value={{isMobile}}>
            {children}
        </MobileResponsivenessContext.Provider>
    </div>
  )
}

export default MobileResponsiveness