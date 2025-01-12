import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { useDrawerContext } from '../shared/contexts';


//export default function ButtonUsage() {
//  return <Button variant="contained">Hello world</Button>;
//}


export const AppRoutes: React.FC = () => {
  const{ toggleDrawerOpen, setDrawerOptions } = useDrawerContext();

  useEffect(() =>{
    setDrawerOptions([
      {
      label: 'Página Inicial',
      icon: 'home',
      path: '/pagina-inicial',
      },
      
      {
      label: 'Clientes',
      icon: 'personicon',
      path: '/clientes',
      }
    ]);
},[]);

  return (
    <Routes>
      <Route path="/pagina-inicial" element={<Button variant="contained" color='primary' onClick={toggleDrawerOpen}>Menu</Button> } />
      <Route path="/clientes" element={<Button variant="contained" color='primary' onClick={toggleDrawerOpen}>Menu</Button> } />
      <Route path="*" element={<Navigate to="/pagina-inicial" />} />
    </Routes>
  );


}
