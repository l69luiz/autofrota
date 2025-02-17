//src/pages/ListagemDeClientes.tsx
import { LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import { IListagemCliente } from "../../shared/services/api/clientes/ClientesService";
import { LayoutBaseDePagina } from "../../shared/layouts/LayoutBaseDePaginas";
import React, { useEffect, useMemo, useState } from "react";
import { FerramentasDaListagem } from "../../shared/components";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../shared/hooks";
import { Api } from "../../shared/services/api/axios-config"; // Importe o Axios configurado
import { Environment } from "../../shared/environments";

export const ListagemDeClientes: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();

  const [rows, setRows] = useState<IListagemCliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const busca = useMemo(() => {
    return searchParams.get('busca') || ''; // Obtemos o valor de busca
  }, [searchParams]);

  const pagina = useMemo(() => {
    return Number(searchParams.get('pagina')) || 1;
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);
    debounce(() => {
      const token = localStorage.getItem('token'); // Substitua pelo método adequado para obter o token
      Api.get('/clientes', {
        params: {
          page: pagina,
          nome_like: busca, // Certificando que o filtro de busca seja enviado
          limit: Environment.LIMITE_DE_LINHAS
        },
        headers: {
          Authorization: `Bearer ${token}` // Enviando o token no cabeçalho da requisição
        }
      })
        .then(response => {
          setIsLoading(false);
          if (response.data && Array.isArray(response.data.data)) {
            const clientes = response.data.data;
            setTotalCount(response.data.totalCount);

            if (clientes.length === 0) {
              setRows([]); // Caso não haja resultados, a lista de clientes é vazia
            } else {
              setRows(clientes); // Se houver resultados, definimos os dados
            }
          } else {
            setRows([]); // Caso a resposta não contenha dados válidos, a lista será vazia
          }
        })
        .catch(error => {
          setIsLoading(false);
          console.error('Erro ao buscar clientes:', error);
          setRows([]); // Se ocorrer erro, garantir que a lista será vazia
        });
    });
  }, [busca, pagina]); // O hook useEffect depende dos parâmetros de busca e página

  useEffect(() => {
    if (busca === "") {
      setRows([]); // Quando a busca for vazia, limpar os resultados
      setTotalCount(0);
    }
  }, [busca]);

  return (
    <LayoutBaseDePagina
      titulo="Listagem de clientes"
      barraDeFerramentas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoBotaoNovo="Nova"
          textoDaBusca={busca}
          aoMudarTextoDeBusca={(texto) => setSearchParams({ busca: texto, pagina: '1' }, { replace: true })}
        />
      }
    >
      <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ações</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.isArray(rows) && rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={row.idCliente}>
                  <TableCell>Ações</TableCell>
                  <TableCell>{row.Nome}</TableCell>
                  <TableCell>{row.Celular}</TableCell>
                  <TableCell>{row.Email}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Nenhum cliente encontrado
                </TableCell>
              </TableRow>
            )}
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

            {totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS && (
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
