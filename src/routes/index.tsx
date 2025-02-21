//src/routes/index.tsx

import React, { JSX, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDrawerContext } from '../shared/contexts';
import { ListagemDeClientes } from '../pages/clientes/ListagemDeClientes';
import { DetalheCliente } from '../pages/clientes/DetalheCliente';
import { Dashboard} from '../pages';
import Login from '../pages/Login';
import PaginaInicial from '../pages/PaginaInicial';


export const AppRoutes: React.FC = () => {
  const { setDrawerOptions } = useDrawerContext();
  
  useEffect(() => {
    setDrawerOptions([
      {
        label: 'Home',
        icon: 'home',
        path: '/pagina-inicial',
      },
      {
        label: 'Clientes',
        icon: 'people',
        path: '/clientes',
      },
    ]);
  }, [setDrawerOptions]);

  const isAuthenticated = sessionStorage.getItem('token') !== null;
  console.log("isd: ", isAuthenticated);
  
  // Função para proteger as rotas que necessitam de autenticação
  // const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  //   return isAuthenticated ? element : <Navigate to="/login" />;
  // };

  return (
    <Routes>
      {/* Rota de Login (sempre acessível) */}
      {/* <Route path="/login" element={<Login />} /> */}
      
      {/* Rota protegida para a página inicial */}
      <Route path="/pagina-inicial" element={isAuthenticated === true ? <PaginaInicial /> : <Navigate to="/login" />} />
      
      {/* Outras rotas protegidas */}
      <Route path="/clientes" element={isAuthenticated === true ? <ListagemDeClientes /> : <Navigate to="/login" />} />
      
      {/* Rota para editar cliente, utilizando o id do cliente */}
      <Route path="clientes/detalhe/:idCliente" element={isAuthenticated === true ? <DetalheCliente /> : <Navigate to="/login" />} />
      
      {/* Redirecionamento para a página de login se o usuário tentar acessar outras rotas não autenticado */}
      <Route path="*" element={isAuthenticated === true ? <Navigate to="/pagina-inicial" /> : <Navigate to="/login" />} />


    </Routes>
  );
};



// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import Login from '../pages/Login';
// import { Dashboard } from '../pages/dashboard/Dashboard';
// import { DetalheCliente } from '../pages/clientes/DetalheCliente';
// import { ListagemDeClientes } from '../pages/clientes/ListagemDeClientes';


// // Função para verificar se o usuário está autenticado
// const isAuthenticated = () => {
//   const token = sessionStorage.getItem('token');
//   return !!token;
// };

// const AppRoutes: React.FC = () => {
//   const { setDrawerOptions } = useDrawerContext();
//   return (
//     <Routes>
//       <Route
//         path="/login"
//         element={
//           isAuthenticated()  ? <Navigate to="/pagina-inicial" replace /> : <Login />
//         }
//       />
//       <Route
//         path="/pagina-inicial"
//         element={
//           isAuthenticated() ? <Dashboard /> : <Navigate to="/login" replace />
//         }
//       />

      
      
//       {/* Outras rotas protegidas */}
//        <Route path="/clientes" element={isAuthenticated() ? <ListagemDeClientes /> : <Navigate to="/login" />} />
      
//        {/* Rota para editar cliente, utilizando o id do cliente */}
//       <Route path="clientes/detalhe/:idCliente" element={isAuthenticated() ? <DetalheCliente /> : <Navigate to="/login" />} />
      
//        {/* Redirecionamento para a página de login se o usuário tentar acessar outras rotas não autenticado */}
//        <Route path="*" element={isAuthenticated() ? <Navigate to="/pagina-inicial" /> : <Navigate to="/login" />} />
//     </Routes>
//   );
// };

// export default AppRoutes;