// src/pages/PaginaInicial.tsx
import React from 'react';
import { MenuLateral } from '../shared/components/menu-lateral/MenuLateral';
import { Dashboard } from './dashboard/Dashboard';

export const PaginaInicial: React.FC = () => {
  return (
    <MenuLateral>
       <Dashboard />
    </MenuLateral>
  );
};

export default PaginaInicial;