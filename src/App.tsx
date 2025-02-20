//App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppRoutes } from './routes';
import { DrawerProvider } from './shared/contexts';
import { AppThemeProvider } from './shared/contexts';
import { MenuLateral } from './shared/components';
import Login from './pages/Login';

export const App = () => {
  const isAuthenticated = sessionStorage.getItem('token') !== null;
  //console.log("Token: ", sessionStorage.getItem('token'));

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
            {!isAuthenticated ? (
              // Renderize apenas a página de Login se o usuário não estiver autenticado
              <Route path="*" element={<Login />} />
            ) : (
              <>
                {/* Se o usuário estiver autenticado, redirecione para a página inicial */}
                <Route path="/" element={<Navigate to="/pagina-inicial" />} />
                {/* Abaixo, renderize o menu lateral junto com o conteúdo protegido */}
                <Route path="*" element={<MenuLateral> <AppRoutes /></MenuLateral>} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </DrawerProvider>
    </AppThemeProvider>
  );
};

export default App;







