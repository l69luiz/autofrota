import React from "react";
import { Avatar, Box, Divider, Drawer, Icon, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme } from "@mui/material";
//import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';

interface MenuLateralProviderProps {
    children: React.ReactNode;
}


export const MenuLateral: React.FC<MenuLateralProviderProps> = ({children}) => {
const theme = useTheme();
const smDown = useMediaQuery(theme.breakpoints.down('sm'));

return (
    <>
    <Drawer open={true} variant ={smDown ? 'temporary' : 'permanent'}>
        <Box width={theme.spacing(28)} height="100%" display="flex" flexDirection="column">
        <Box width="100%" height={theme.spacing(20)} display="flex" alignItems="center" justifyContent="center">
        <Avatar
         sx={{height: theme.spacing(12), width: theme.spacing(12)}}
         src="https://yt3.ggpht.com/grfYgQadT8iNg9WPb-jkrKB-9224y_DBDXAOtV4Yt7cyQmtR47J_453uveQOTDsp_dRSH851TMM=s108-c-k-c0x00ffffff-no-rj" 
        />
        </Box> 
        <Divider/>
        <Box flex={1}>
        <nav aria-label="Menu principal">
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Icon>home</Icon>
              </ListItemIcon>
              <ListItemText primary="Página inicial" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Icon>directions_car</Icon>
                
              </ListItemIcon>
              <ListItemText primary="Veiculos" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
        </Box>   

        Teste
        </Box>
    </Drawer>
    <Box height="100vh" marginLeft={smDown ? 0 : theme.spacing(28)}>
        {children}
    </Box>
    </>

);
}