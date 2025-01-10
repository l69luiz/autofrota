import { ThemeProvider } from '@mui/material/styles';
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { LightTheme, DarkTheme } from './../themes';
import { light } from '@mui/material/styles/createPalette';
import { Box, Button } from '@mui/material';

interface IThemeContextData {
themeName: 'light' | 'dark';
toggleTheme: () => void;

}
interface ThemeProviderProps {
    children: React.ReactNode;
}

const ThemeContext = createContext({} as IThemeContextData); 
export const useAppThemeContext = () => {
    return useContext(ThemeContext);
}

export const AppThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
    const[themeName, setThemeName] =useState<'light'| 'dark'>('light');
    const toggleTheme = useCallback(() => {
        setThemeName(oldThemeName => oldThemeName === 'light' ? 'dark' : 'light');

    },[]);

    const theme = useMemo(() =>{
        if (themeName === 'light') return LightTheme;
        return DarkTheme;

    }, [themeName]);


    return (
        <ThemeContext.Provider value={{themeName, toggleTheme}}>
            <ThemeProvider theme={theme}>
                <Box width="100vw" height="100vw" bgcolor={theme.palette.background.default}>
                    {children}
                </Box>
            </ThemeProvider>      
        </ThemeContext.Provider>


    );

}