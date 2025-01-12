import React from "react";
import { Box, useMediaQuery } from '@mui/system';
import { Icon, IconButton, Typography, useTheme } from "@mui/material";
import { ThemeContext } from "@emotion/react";
import { useDrawerContext } from "../contexts";

interface ILayoutBaseDePaginaProps {
    children: React.ReactNode
    titulo: string;


};

export const LayoutBaseDePagina: React.FC<ILayoutBaseDePaginaProps> = ({ children, titulo }) => {
    const theme = useTheme();
    const smDown = useMediaQuery(theme.breakpoints.down('sm'));
    const {toggleDrawerOpen} = useDrawerContext();
    
    
    return (

        <Box height='100%' display='flex' flexDirection='column' gap={0.5}>
            <Box padding={1} display='flex' alignItems='center' height={theme.spacing(12)} gap={1}>
                
                {smDown && (
                <IconButton onClick={toggleDrawerOpen} >
                    <Icon>menu</Icon>
                </IconButton>)}

                
                <Typography variant='h5'>
                    {titulo}
                </Typography>
                
            </Box>
            <Box>
                Barra ferramentas
            </Box>
            <Box>
                {children}
            </Box>
            
        </Box>



    );
};
