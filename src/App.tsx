
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { DrawerProvider } from './shared/contexts';
import { AppThemeProvider } from './shared/contexts';
import { MenuLateral } from './shared/components';

export const App = () => {
  return (
    <AppThemeProvider>
      <DrawerProvider>
        <BrowserRouter>
          <MenuLateral>
            <AppRoutes />
          </MenuLateral>

        </BrowserRouter>
      </DrawerProvider>
    </AppThemeProvider>
  );
}


