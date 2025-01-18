import React, { useMemo } from "react";
import { LayoutBaseDePagina } from "../../shared/layouts/LayoutBaseDePaginas";
import { FerramentasDaListagem } from "../../shared/components";
import { useSearchParams } from "react-router-dom";

export const ListagemDeCidade: React.FC =() => {
    
    const [searchParams, setSearchParams] = useSearchParams();
   
    const busca = useMemo(() => {
        return searchParams.get('busca') || '';

    },[searchParams]);

    return (
        
        <LayoutBaseDePagina 
            titulo='Listagem de cidades'
            barraDeFerramentas={
                <FerramentasDaListagem
                    mostrarInputBusca
                    textoBotaoNovo='Nova'
                    textoDaBusca={busca}
                    aoMudarTextoDeBusca={texto => setSearchParams({busca: texto}, {replace: true})}
                    
                />
                
            }
        >


        </LayoutBaseDePagina>
        
        
    );

};
