import React, { createContext, useCallback, useContext, useState } from "react";

interface IDrawerOptions{
icon: string
path: string
label: string
};


interface IDrawerContextData {
IsDrawerOpen: boolean;
toggleDrawerOpen: () => void;
drawerOptions: IDrawerOptions[];
setDrawerOptions: (newDrawerOptions: IDrawerOptions[]) => void;

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
    const[drawerOptions, setDrawerOptions] =useState<IDrawerOptions[]>([]);

    
    const toggleDrawerOpen = useCallback(() => {
        setisDrawerOpen(oldDrawerOpen => !oldDrawerOpen);

    },[]);
  
  
    const handleSetDrawerOptions = useCallback((newDrawerOptions: IDrawerOptions[]) => {
        setDrawerOptions(newDrawerOptions);

    },[]);


    return (
        <DrawerContext.Provider value={{setDrawerOptions: handleSetDrawerOptions , IsDrawerOpen, drawerOptions, toggleDrawerOpen}}>
              {children}
        </DrawerContext.Provider>


    );

}