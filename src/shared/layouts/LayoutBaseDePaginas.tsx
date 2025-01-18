import React, { ReactNode } from "react";
import { Box, useMediaQuery } from '@mui/system';
import { Icon, IconButton, Theme, Typography, useTheme } from "@mui/material";
import { useDrawerContext } from "../contexts";

interface ILayoutBaseDePaginaProps {
    titulo: string;
    barraDeFerramentas?:ReactNode;


};

export const LayoutBaseDePagina: React.FC<ILayoutBaseDePaginaProps> = ({ titulo, barraDeFerramentas }) => {
    const theme = useTheme();
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const {toggleDrawerOpen} = useDrawerContext();
    
    
    return (

        <Box height='100%' display='flex' flexDirection='column' gap={0.5}>
            <Box padding={1} display='flex' alignItems='center' gap={1}height={theme.spacing(smDown ? 6 : mdDown ? 8 : 12)} >
                
                {smDown && (
                <IconButton onClick={toggleDrawerOpen} >
                    <Icon>menu</Icon>
                </IconButton>)}

                
                <Typography
                    overflow='hidden'
                    whiteSpace='nowrap'
                    textOverflow='ellipsis'
                    variant={smDown ? 'h5' : mdDown ? 'h4' : 'h3'}
                >
                   {titulo}
                </Typography>
                
            </Box>

            {barraDeFerramentas && (
            <Box>
                {barraDeFerramentas}
            </Box>)}
            
            <Box flex={1} overflow='auto'>
                
            </Box>
            
        </Box>



    );
};
