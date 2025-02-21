// src/pages/PaginaInicial.tsx
import React from 'react';
import { MenuLateral } from '../shared/components/menu-lateral/MenuLateral';
import { Dashboard } from './dashboard/Dashboard';

export const PaginaInicial: React.FC = () => {
  return (
    <MenuLateral>
      {/* O Dashboard será passado como children para o MenuLateral */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Dashboard />
      </div>
    </MenuLateral>
  );
};

export default PaginaInicial;