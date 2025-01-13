import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { useDrawerContext } from '../shared/contexts';
import { Dashboard } from '../pages/dashboard/Dashboard';


//export default function ButtonUsage() {
//  return <Button variant="contained">Hello world</Button>;
//}


export const AppRoutes: React.FC = () => {
  const{ toggleDrawerOpen, setDrawerOptions } = useDrawerContext();

  useEffect(() =>{
    setDrawerOptions([
      {
      label: 'Home',
      icon: 'home',
      path: '/pagina-inicial',
      },
            
    ]);
},[]);

  return (
    <Routes>
      <Route path="/pagina-inicial" element={<Dashboard /> } />
      <Route path="*" element={<Navigate to="/pagina-inicial" />} />
    </Routes>
  );


}
