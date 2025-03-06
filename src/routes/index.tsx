//src/routes/index.tsx

import React, { JSX, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDrawerContext } from '../shared/contexts';
import { ListagemDeClientes } from '../pages/clientes/ListagemDeClientes';
import { DetalheCliente } from '../pages/clientes/DetalheCliente';
import { Dashboard} from '../pages';
import Login from '../pages/Login';
import PaginaInicial from '../pages/PaginaInicial';
import { DetalheVeiculo } from '../pages/Veiculos/detalheVeiculo';
import { ListagemDeVeiculos } from '../pages/Veiculos/ListagemDeVeiculos';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { ListagemDeEstoques } from '../pages/estoques/ListagemDeEstoques';
import { DetalheEstoque } from '../pages/estoques/DetalheEstoque';
import { ListagemDeContasBancarias } from '../pages/contasbancarias/ListagemDeContasBancarias';
import { DetalheContaBancaria } from '../pages/contasbancarias/DetalheContaBancaria';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';


export const AppRoutes: React.FC = () => {
  const { setDrawerOptions } = useDrawerContext();
  
  useEffect(() => {
    setDrawerOptions([

      { icon: <HomeIcon />,
        path: "/pagina-inicial", 
        label: "Home" },

      { icon: <PersonIcon />, 
        path: "/clientes", 
        label: "Clientes" },

      { icon: <DirectionsCarIcon />,
        path: "/veiculos", 
        label: "Veiculos" },
      
        { icon: <DirectionsCarIcon />,
        path: "/vendas", 
        label: "Vendas" },


        { icon: <AddBusinessIcon />,
        path: "/empresas", 
        label: "Empresa" },
        
        // { icon: <AccountBalanceIcon />,
        // path: "/contasbancarias", 
        // label: "Contas Bancarias" },
      
     
    ]);
  }, [setDrawerOptions]);


  const isAuthenticated = sessionStorage.getItem('token') !== null;
   
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

      {/* Outras rotas protegidas */}
      <Route path="/veiculos" element={isAuthenticated === true ? <ListagemDeVeiculos /> : <Navigate to="/login" />} />
      
      {/* Rota para editar cliente, utilizando o id do cliente */}
      <Route path="veiculos/detalhe/:idVeiculo" element={isAuthenticated === true ? <DetalheVeiculo /> : <Navigate to="/login" />} />
      
      {/* Outras rotas protegidas */}
      {/* <Route path="/empresas" element={isAuthenticated === true ? <ListagemDeEstoques /> : <Navigate to="/login" />} /> */}
      
      {/* Rota para editar cliente, utilizando o id do cliente */}
      {/* <Route path="empresas/detalhe/:idEmpresa" element={isAuthenticated === true ? <DetalheEmpresa /> : <Navigate to="/login" />} /> */}
     
      {/* Outras rotas protegidas */}
      <Route path="/contasbancarias" element={isAuthenticated === true ? <ListagemDeContasBancarias /> : <Navigate to="/login" />} />
      
      {/* Rota para editar contasbancarias, utilizando o id da contasbancarias */}
      <Route path="contasbancarias/detalhe/:idContaBancaria" element={isAuthenticated === true ? <DetalheContaBancaria /> : <Navigate to="/login" />} />
      
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


// {
//   icon: 'home',
//   path: '/pagina-inicial',
//   label: 'Home',
// },
// {
//   label: 'Clientes',
//   icon: 'people',
//   path: '/clientes',
// },
// {
//   label: 'Veiculos',
//   icon: 'directions_car',
//   path: '/veiculos',
// },