//src/shared/contexts/DrawerContexr.tsx
import React, { createContext, useCallback, useContext, useState, ReactNode } from "react";

// Defina a interface para as opções do drawer
interface IDrawerOptions {
  icon: React.ReactNode; // Agora o ícone é um componente React
  path: string;
  label: string;
}
// Defina a interface para as opções do drawerSub
interface IDrawerOptionsSub {
  icon: React.ReactNode; // Agora o ícone é um componente React
  path: string;
  label: string;
}

// Defina a interface para o contexto do drawer
interface IDrawerContextData {
  isDrawerOpen: boolean;
  toggleDrawerOpen: () => void;
  drawerOptions: IDrawerOptions[];
  setDrawerOptions: (newDrawerOptions: IDrawerOptions[]) => void;
}

// Defina as props do provider
interface  ThemeProviderProps {
  children: ReactNode;
}

// Crie o contexto
const DrawerContext = createContext({} as IDrawerContextData);

// Hook personalizado para usar o contexto
export const useDrawerContext = () => {
  return useContext(DrawerContext);
};

// Provider do Drawer
export const DrawerProvider: React.FC< ThemeProviderProps> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerOptions, setDrawerOptions] = useState<IDrawerOptions[]>([]);

  // Função para alternar o estado do drawer (aberto/fechado)
  const toggleDrawerOpen = useCallback(() => {
    setIsDrawerOpen((oldDrawerOpen) => !oldDrawerOpen);
  }, []);
  
  // Função para definir as opções do drawer
  const handleSetDrawerOptions = useCallback((newDrawerOptions: IDrawerOptions[]) => {
    setDrawerOptions(newDrawerOptions);
  }, []);

  return (
    <DrawerContext.Provider
      value={{
        isDrawerOpen,
        drawerOptions,
        toggleDrawerOpen,
        setDrawerOptions: handleSetDrawerOptions,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};




//src/shared/contexts/DrawerContexr.tsx
// import React, { createContext, useCallback, useContext, useState } from "react";

// interface IDrawerOptions{
// icon: string
// path: string
// label: string
// };


// interface IDrawerContextData {
// IsDrawerOpen: boolean;
// toggleDrawerOpen: () => void;
// drawerOptions: IDrawerOptions[];
// setDrawerOptions: (newDrawerOptions: IDrawerOptions[]) => void;

// }
// interface ThemeProviderProps {
//     children: React.ReactNode;
// }

// const DrawerContext = createContext({} as IDrawerContextData); 
// export const useDrawerContext = () => {
//     return useContext(DrawerContext);
// }

// export const DrawerProvider: React.FC<ThemeProviderProps> = ({children}) => {
//     const[IsDrawerOpen, setisDrawerOpen] =useState(false);
//     const[drawerOptions, setDrawerOptions] =useState<IDrawerOptions[]>([]);

    
//     const toggleDrawerOpen = useCallback(() => {
//         setisDrawerOpen(oldDrawerOpen => !oldDrawerOpen);

//     },[]);
  
  
//     const handleSetDrawerOptions = useCallback((newDrawerOptions: IDrawerOptions[]) => {
//         setDrawerOptions(newDrawerOptions);

//     },[]);


//     return (
//         <DrawerContext.Provider value={{setDrawerOptions: handleSetDrawerOptions , IsDrawerOpen, drawerOptions, toggleDrawerOpen}}>
//               {children}
//         </DrawerContext.Provider>


//     );

// }