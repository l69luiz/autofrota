import React from "react";
import { LayoutBaseDePagina } from '../../shared/layouts/LayoutBaseDePaginas';
import { FerramentasDeDetalhe } from "../../shared/components";





export const Dashboard: React.FC = () => {
    
    return(

      <LayoutBaseDePagina 
      titulo='Pagina inicial' 
      barraDeFerramentas={(
        
        <FerramentasDeDetalhe/>

        

      )}>
            Testando...
      </LayoutBaseDePagina>   


    );




}