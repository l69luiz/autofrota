import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { useAppThemeContext } from '../shared/contexts';


//export default function ButtonUsage() {
//  return <Button variant="contained">Hello world</Button>;
//}


export const AppRoutes: React.FC = () => {
  const{ toggleTheme} = useAppThemeContext();

  return (
    <Routes>
      <Route path="/Pagina-inicial" element={<Button variant="contained" color='primary' onClick={toggleTheme}> Trocar tema</Button> } />
      <Route path="*" element={<Navigate to="/pagina-inicial" />} />
    </Routes>
  );


}
