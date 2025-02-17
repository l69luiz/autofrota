//src/routes/index.tsx
import React, { JSX, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDrawerContext } from '../shared/contexts';
import { ListagemDeClientes } from '../pages/pessoas/ListagemDeClientes';
import { Dashboard } from '../pages';
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
        label: 'Pessoas',
        icon: 'people',
        path: '/pessoas',
      },
      {
        label: 'Clientes',
        icon: 'people',
        path: '/clientes',
      },
    ]);
  }, [setDrawerOptions]);

  const isAuthenticated = localStorage.getItem('token') !== null;
  
  // Função para proteger as rotas que necessitam de autenticação
  const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <Routes>
      {/* Rota de Login (sempre acessível) */}
      <Route path="/login" element={<Login />} />
      
      {/* Rota protegida para a página inicial */}
      <Route path="/pagina-inicial" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
      
      {/* Outras rotas protegidas */}
      <Route path="/clientes" element={isAuthenticated ? <ListagemDeClientes /> : <Navigate to="/login" />} />
      <Route path="/clientes/detalhe:id" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
      
      {/* Redirecionamento para a página de login se o usuário tentar acessar outras rotas não autenticado */}
      <Route path="*" element={isAuthenticated ? <Navigate to="/pagina-inicial" /> : <Navigate to="/login" />} />
    </Routes>
  );
};




// import React, { useEffect } from 'react';
// import { Routes, Route, Navigate } from "react-router-dom";
// import Button from '@mui/material/Button';
// import { useDrawerContext } from '../shared/contexts';
// import { ListagemDeClientes } from '../pages/pessoas/ListagemDeClientes';
// import {Dashboard, ListagemDePessoas} from '../pages';
// import Login from '../pages/Login';


// //export default function ButtonUsage() {
// //  return <Button variant="contained">Hello world</Button>;
// //}


// export const AppRoutes: React.FC = () => {
//   const{ toggleDrawerOpen, setDrawerOptions } = useDrawerContext();
  

//   useEffect(() =>{
//     setDrawerOptions([
//       {
//       label: 'Home',
//       icon: 'home',
//       path: '/pagina-inicial',
//       },
//       {
//       label: 'Pessoas',
//       icon: 'people',
//       path: '/pessoas',
//       },
//       {
//       label: 'Clientes',
//       icon: 'people',
//       path: '/clientes',
//       },
            
//     ]);
// },[]);

// const isAuthenticated = localStorage.getItem('token') !== null;

//   return (
//     <Routes>
      
//       <Route path="/pagina-inicial" element={isAuthenticated ? <Dashboard /> : <Login />} />
      
//       {/* <Route path="/pessoas" element={<ListagemDePessoas /> } />
//       <Route path="/pessoas/detalhe:id" element={<Dashboard /> } /> */}
      
//       {/* <Route path="/clientes" element={<ListagemDeClientes /> } /> */}
//       <Route path="/clientes/detalhe:id" element={isAuthenticated ? <Dashboard /> : <Login />} />

//       <Route path="/clientes" element={isAuthenticated ? <ListagemDeClientes /> : <Login />} />

      
//       <Route path="*" element={isAuthenticated ? <Navigate to="/pagina-inicial" /> : <Login />} />
        
//         {/* <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />
//         <Route path="/clientes" element={isAuthenticated ? <Clientes /> : <Login />} />
//         <Route path="/veiculos" element={isAuthenticated ? <Veiculos /> : <Login />} />
//         <Route path="/vendas" element={isAuthenticated ? <Vendas /> : <Login />} />
//         <Route path="/financiamentos" element={isAuthenticated ? <Financiamentos /> : <Login />} />
//         <Route path="/contratos" element={isAuthenticated ? <Contratos /> : <Login />} />
//         <Route path="/usuarios" element={isAuthenticated ? <Usuarios /> : <Login />} /> */}



      
//     </Routes>
//   );


// }
