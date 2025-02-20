//src/routes/index.tsx
import React, { JSX, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDrawerContext } from '../shared/contexts';
import { ListagemDeClientes } from '../pages/clientes/ListagemDeClientes';
import { DetalheCliente } from '../pages/clientes/DetalheCliente';
import { Dashboard} from '../pages';
import Login from '../pages/Login';


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
  console.log("isAuthenticated: ", isAuthenticated);
  
  // Função para proteger as rotas que necessitam de autenticação
  // const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  //   return isAuthenticated ? element : <Navigate to="/login" />;
  // };

  return (
    <Routes>
      {/* Rota de Login (sempre acessível) */}
      <Route path="/login" element={<Login />} />
      
      {/* Rota protegida para a página inicial */}
      <Route path="/pagina-inicial" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
      
      {/* Outras rotas protegidas */}
      <Route path="/clientes" element={isAuthenticated ? <ListagemDeClientes /> : <Navigate to="/login" />} />
      
      {/* Rota para editar cliente, utilizando o id do cliente */}
      <Route path="clientes/detalhe/:idCliente" element={isAuthenticated ? <DetalheCliente /> : <Navigate to="/login" />} />
      
      {/* Redirecionamento para a página de login se o usuário tentar acessar outras rotas não autenticado */}
      {/* <Route path="*" element={isAuthenticated ? <Navigate to="/pagina-inicial" /> : <Navigate to="/login" />} /> */}


    </Routes>
  );
};
