import { LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow } from "@mui/material";
import { IListagemPessoa, PessoasService } from "../../shared/services/api/pessoas/PessoasService";
import { LayoutBaseDePagina } from "../../shared/layouts/LayoutBaseDePaginas";
import React, { useEffect, useMemo, useState } from "react";
import { FerramentasDaListagem } from "../../shared/components";
import { Environment } from "../../shared/environments";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../shared/hooks";

export const ListagemDePessoas: React.FC = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const { debounce } = useDebounce();

    const [rows, setRows] = useState<IListagemPessoa[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    const busca = useMemo(() => {
        return searchParams.get('busca') || '';

    }, [searchParams]);

    const pagina = useMemo(() => {
        return Number(searchParams.get('pagina')) || 1;

    }, [searchParams]);

    useEffect(() => {
        setIsLoading(true);
        debounce(() => {

            PessoasService.getAll(pagina, busca)

                .then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {


                        console.log(result);
                        setTotalCount(result.totalCount);
                        setRows(result.data);
                    }

                });
        });


    }, [busca, pagina]);




    return (

        <LayoutBaseDePagina
            titulo='Listagem de pessoas'
            barraDeFerramentas={
                <FerramentasDaListagem
                    mostrarInputBusca
                    textoBotaoNovo='Nova'
                    textoDaBusca={busca}
                    aoMudarTextoDeBusca={texto => setSearchParams({ busca: texto, pagina: '1'}, { replace: true })}

                />

            }
        >
            <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ações</TableCell>
                            <TableCell>Nome completo</TableCell>
                            <TableCell>Email</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>

                        {rows.map(row => (
                            <TableRow key={row.id}>
                                <TableCell>Ações</TableCell>
                                <TableCell>{row.nomeCompleto}</TableCell>
                                <TableCell>{row.email}</TableCell>
                            </TableRow>

                        ))}

                    </TableBody>

                    {totalCount === 0 && !isLoading && (
                        <caption>{Environment.LISTAGEM_VAZIA}</caption>

                    )}

                    <TableFooter>
                    
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={3}>
                                    <LinearProgress variant="indeterminate" />
                                </TableCell>
                            </TableRow>
                        )}

                        
                        {(totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS) && (
                            <TableRow>
                                <TableCell colSpan={3}>
                                    <Pagination
                                        page={pagina}
                                        count={Math.ceil(totalCount / Environment.LIMITE_DE_LINHAS)}
                                        onChange={(_, newPage) => setSearchParams({ busca, pagina: newPage.toString() }, { replace: true })}
                                    />
                                </TableCell>

                            </TableRow>
                        )}
                     
                    </TableFooter>
                </Table>
            </TableContainer>
        </LayoutBaseDePagina>

    );

};
