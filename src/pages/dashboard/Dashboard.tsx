import React from "react";
import { LayoutBaseDePagina } from '../../shared/layouts/LayoutBaseDePaginas';
import { BarraDeFerramentas } from '../../shared/components';




export const Dashboard: React.FC = () => {
    
    return(

      <LayoutBaseDePagina 
      titulo='Pagina inicial' 
      barraDeFerramentas={(
        <BarraDeFerramentas
        mostrarInputBusca
        textoBotaoNovo='Nova' 
        
        />
      )}>
            Testando...
      </LayoutBaseDePagina>   


    );




}