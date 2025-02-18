//App.tsx

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppRoutes } from './routes';
import { DrawerProvider } from './shared/contexts';
import { AppThemeProvider } from './shared/contexts';
import { MenuLateral } from './shared/components';
import Login from './pages/Login'; // Certifique-se de que o Login está importado
import { EditarCliente } from './pages/clientes/editarCliente';

export const App = () => {
  const isAuthenticated = localStorage.getItem('token') !== null; // Verifique se o token está presente

  useEffect(() => {
    // Verifica se é a primeira vez que o usuário está acessando o site
    const isFirstVisit = localStorage.getItem('firstVisit');

    if (!isFirstVisit) {
      // Limpa o localStorage ao detectar a primeira visita
      localStorage.clear();
      // Marca no localStorage que o usuário já acessou
      localStorage.setItem('firstVisit', 'true');
    }
  }, []);

  return (
    <AppThemeProvider>
      <DrawerProvider>
        <BrowserRouter>
          <Routes>
            {/* Se não estiver autenticado, vai para a tela de login */}
            {!isAuthenticated ? (
              <Route path="/" element={<Login />} />
            ) : (
              <>
                {/* Caso esteja autenticado, renderiza o MenuLateral e as outras páginas */}
                <Route path="/" element={<Navigate to="/pagina-inicial" />} />
                <Route path="*" element={<MenuLateral><AppRoutes /></MenuLateral>} />
              
           
              </>
            )}
          </Routes>
        </BrowserRouter>
      </DrawerProvider>
    </AppThemeProvider>
  );
};

export default App;






// import React from 'react';
// import { BrowserRouter, Route } from 'react-router-dom';
// import { AppRoutes } from './routes';
// import { DrawerProvider } from './shared/contexts';
// import { AppThemeProvider } from './shared/contexts';
// import { MenuLateral } from './shared/components';

// export const App = () => {
//   return (
//     <AppThemeProvider>
//       <DrawerProvider>
//         <BrowserRouter>
//           <MenuLateral>
//             <AppRoutes/>
             
//           </MenuLateral>

//         </BrowserRouter>
//       </DrawerProvider>
//     </AppThemeProvider>
//   );
// }

// export default App;
