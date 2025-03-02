//src/shared/components/menu-lateral/MenuLateral.tsx
import React from "react";
import { Avatar, Box, Divider, Drawer, Icon, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme } from "@mui/material";
//import InboxIcon from '@mui/icons-material/Inbox';
//import DraftsIcon from '@mui/icons-material/Drafts';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import { Navigate, useMatch, useNavigate, useResolvedPath } from 'react-router-dom';
import { useAppThemeContext, useDrawerContext } from "../../contexts";


interface IListItemLinksProps {
  //children: React.ReactNode;
  label: string;
  icon: React.ReactNode;
  to: string;
  onClick: (() => void) | undefined;
}

const ListItemLink: React.FC<IListItemLinksProps> = ({ label, icon, to, onClick }) => {
  const navigate = useNavigate();

  const resolvePath = useResolvedPath(to);
  const match = useMatch({ path: resolvePath.pathname, end: false });

  const handleclick = () => {
    navigate(to);
    onClick?.();
  };

  return (
    <ListItemButton selected={!!match} onClick={handleclick}>
      <ListItemIcon>
        <Icon>{icon}</Icon>
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>

  );

};

interface MenuLateralProviderProps {
  children: React.ReactNode;
}

//export default function NestedList() {
//  const [open, setOpen] = React.useState(true);

export const MenuLateral: React.FC<MenuLateralProviderProps> = ({ children }) => {
   const navigate = useNavigate();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const { isDrawerOpen, toggleDrawerOpen, drawerOptions } = useDrawerContext();
  const { isDrawerOpenSub, toggleDrawerOpenSub, drawerOptionsSub } = useDrawerContext();
  const [openVeiculos, setOpenVeic] = React.useState(false);
  const handleClickVeic = () => {
    setOpenVeic(!openVeiculos);
    navigate("/veiculos");
      
    };
  //const [openClientes, setOpenClien] = React.useState(false);
  const { toggleTheme } = useAppThemeContext();

  //const handleClickClien = () => { setOpenClien(!openClientes); };

  return (
    <>
      <Drawer open={isDrawerOpen} variant={smDown ? 'temporary' : 'permanent'} onClose={toggleDrawerOpen}>
        <Box width={theme.spacing(28)} height="100%" display="flex" flexDirection="column">
          <Box width="100%" height={theme.spacing(20)} display="flex" alignItems="center" justifyContent="center">
            <Avatar
              sx={{ height: theme.spacing(12), width: theme.spacing(12) }}
              src="https://yt3.ggpht.com/grfYgQadT8iNg9WPb-jkrKB-9224y_DBDXAOtV4Yt7cyQmtR47J_453uveQOTDsp_dRSH851TMM=s108-c-k-c0x00ffffff-no-rj"
            />
          </Box>
          <Divider />
          <Box flex={1}>
            <nav aria-label="Menu principal">

              <List>

                {drawerOptions.map(drawerOptions => (

                  <ListItem disablePadding>
                    <ListItemLink
                      key={drawerOptions.path}
                      icon={drawerOptions.icon}
                      to={drawerOptions.path}
                      label={drawerOptions.label}
                      onClick={smDown ? toggleDrawerOpen : undefined}
                    />
                  </ListItem>


                ))}

                <ListItemButton onClick={handleClickVeic}>
                  <ListItemIcon>
                    <Icon>directions_car</Icon>
                  </ListItemIcon>
                  <ListItemText primary="Frota" />
                  {openVeiculos ? <ExpandLess /> : <ExpandMore /> }
                </ListItemButton> 

                <Collapse in={openVeiculos} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                  {drawerOptionsSub.map(drawerOptionsSub => (
                    
                  <ListItem disablePadding>
                    <ListItemLink
                      key={drawerOptionsSub.path}
                      icon={drawerOptionsSub.icon}
                      to={drawerOptionsSub.path}
                      label={drawerOptionsSub.label}
                      onClick={smDown ? toggleDrawerOpen : undefined}
                    />
                    
                  </ListItem>
                  ))}
                  </ListItemButton>



                  </List>
                </Collapse>


                {/* <ListItemButton onClick={handleClickVeic}>
                  <ListItemIcon>
                    <Icon>directions_car</Icon>
                  </ListItemIcon>
                  <ListItemText primary="Frota" />
                  {openVeiculos ? <ExpandLess /> : <ExpandMore /> }
                </ListItemButton> 

                <Collapse in={openVeiculos} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemIcon>
                        <Icon>buildicon</Icon>
                      </ListItemIcon>
                      <ListItemText primary="Manutenções" />
                    </ListItemButton>
                  </List>
                </Collapse> */}


              </List>

            </nav>
          </Box>

        </Box>


        <Box>
          <nav aria-label="Menu principal">

            <List>

              <ListItemButton onClick={toggleTheme} sx={{ pl: 4 }}>
                <ListItemIcon>
                  <Icon>dark_mode</Icon>
                </ListItemIcon>
                <ListItemText primary="Tema" />
              </ListItemButton>
            </List>
          </nav>
        </Box>

      </Drawer>

      <Box height="100vh" marginLeft={smDown ? 0 : theme.spacing(14)}>
        {children}
      </Box>
    </>

  );
}