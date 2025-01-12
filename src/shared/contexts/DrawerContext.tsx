import React, { createContext, useCallback, useContext, useState } from "react";



interface IDrawerContextData {
IsDrawerOpen: boolean;
toggleDrawerOpen: () => void;

}
interface ThemeProviderProps {
    children: React.ReactNode;
}

const DrawerContext = createContext({} as IDrawerContextData); 
export const useDrawerContext = () => {
    return useContext(DrawerContext);
}

export const DrawerProvider: React.FC<ThemeProviderProps> = ({children}) => {
    const[IsDrawerOpen, setisDrawerOpen] =useState(false);
    
    const toggleDrawerOpen = useCallback(() => {
        setisDrawerOpen(oldDrawerOpen => !oldDrawerOpen);

    },[]);


    return (
        <DrawerContext.Provider value={{IsDrawerOpen, toggleDrawerOpen}}>
              {children}
        </DrawerContext.Provider>


    );

}