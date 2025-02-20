//App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppRoutes } from './routes';
import { DrawerProvider } from './shared/contexts';
import { AppThemeProvider } from './shared/contexts';
import { MenuLateral } from './shared/components';
import Login from './pages/Login';
import { Dashboard } from './pages';

export const App = () => {
  const isAuthenticated = sessionStorage.getItem('token') !== null;

  useEffect(() => {
    const isFirstVisit = sessionStorage.getItem('firstVisit');
    if (!isFirstVisit) {
      sessionStorage.clear();
      sessionStorage.setItem('firstVisit', 'true');
    }
  }, []);

  return (
    <AppThemeProvider>
    <DrawerProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota para login */}
          <Route path="/login" element={<Login />} />
          
          {/* Rota para a página inicial (Dashboard) */}
          <Route path="/pagina-inicial" element={<MenuLateral><AppRoutes/></MenuLateral>} />
          
          {/* Redirecionamento para login para qualquer rota desconhecida */}
          <Route path="*" element={<Navigate to="/login" />} />
          
          {/* Renderização do Menu Lateral com as rotas autenticadas */}
          {/* <Route path="*" element={<MenuLateral><AppRoutes /></MenuLateral>} /> */}
        
        </Routes>
      </BrowserRouter>
    </DrawerProvider>
  </AppThemeProvider>
  );
};

export default App;
