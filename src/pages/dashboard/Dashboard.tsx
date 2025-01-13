import React from "react";
import { LayoutBaseDePagina } from '../../shared/layouts/LayoutBaseDePaginas';
import { FerramentasDaListagem } from '../../shared/components';




export const Dashboard: React.FC = () => {
    
    return(

      <LayoutBaseDePagina 
      titulo='Pagina inicial' 
      barraDeFerramentas={(
        <FerramentasDaListagem
        mostrarInputBusca
        textoBotaoNovo='Inserir' 
        
        />
      )}>
            Testando...
      </LayoutBaseDePagina>   


    );




}