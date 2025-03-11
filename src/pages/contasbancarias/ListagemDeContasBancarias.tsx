//src/pages/contasbancarias/ListagemDeContasBancarias.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Icon,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Pagination,
} from "@mui/material";
import { MoreHoriz, Edit } from '@mui/icons-material';
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDebounce } from "../../shared/hooks";
import { Api } from "../../shared/services/api/axios-config";
import { Environment } from "../../shared/environments";
import { LayoutBaseDePagina } from "../../shared/layouts/LayoutBaseDePaginas";
import { FerramentasDaListagem, MenuLateral } from "../../shared/components"; // Importando o MenuLateral
import { ContasBancariasService, IListagemContaBancaria } from "../../shared/services/api/contasBancarias/contasBancariasService"; // Importando o serviço de contas bancárias

export const ListagemDeContasBancarias: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [contasBancarias, setContasBancarias] = useState<IListagemContaBancaria[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [contaBancariaIdParaDeletar, setContaBancariaIdParaDeletar] = useState<number | null>(null);

  const busca = useMemo(() => searchParams.get("busca") || "", [searchParams]);
  const pagina = useMemo(() => Number(searchParams.get("pagina")) || 1, [searchParams]);

  const handleDeleteDialogOpen = useCallback((id: number) => {
    setContaBancariaIdParaDeletar(id);
    setDialogOpen(true);
  }, []);

  const handleDeleteDialogClose = useCallback(() => {
    setDialogOpen(false);
    setContaBancariaIdParaDeletar(null);
  }, []);

    const handleEdit = useCallback((idContasBancarias: number) => {
      alert(idContasBancarias);
      navigate(`/contasbancarias/detalhe/${idContasBancarias}`);
    }, [navigate]);
    


  const handleDelete = useCallback(async () => {
    if (!contaBancariaIdParaDeletar) return;

    try {
      const result = await ContasBancariasService.deleteById(contaBancariaIdParaDeletar);
      if (result instanceof Error) {
        alert(result.message);
      } else {
        setContasBancarias((prevContas) =>
          prevContas.filter((conta) => conta.idContasBancarias !== contaBancariaIdParaDeletar)
        );
      }
    } catch (error) {
      console.error("Erro ao deletar conta bancária:", error);
    } finally {
      handleDeleteDialogClose();
    }
  }, [contaBancariaIdParaDeletar, handleDeleteDialogClose]);

  useEffect(() => {
    const fetchContasBancarias = async () => {
      setIsLoading(true);
      try {
        const result = await ContasBancariasService.getAll(pagina, busca);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          setContasBancarias(result.data || []);
          setTotalCount(result.totalCount || 0);
        }
      } catch (error) {
        console.error("Erro ao buscar contas bancárias:", error);
        setContasBancarias([]);
      } finally {
        setIsLoading(false);
      }
    };

    debounce(fetchContasBancarias);
  }, [busca, pagina, debounce]);

  const handlePaginationChange = useCallback(
    (_: React.ChangeEvent<unknown>, newPage: number) => {
      setSearchParams({ busca, pagina: newPage.toString() }, { replace: true });
    },
    [busca, setSearchParams]
  );

  return (
    <MenuLateral>
      <div style={{ flex: 1 }}>
        <LayoutBaseDePagina
          titulo="Listagem de Contas Bancárias"
          barraDeFerramentas={
            <FerramentasDaListagem
              mostrarInputBusca
              textoBotaoNovo="Novo"
              aoClicarEmNovo={() => navigate('/contasBancarias/detalhe/novo')}
              textoDaBusca={busca}
              aoMudarTextoDeBusca={(texto) =>
                setSearchParams({ busca: texto, pagina: "1" }, { replace: true })
              }
            />
          }
        >
          <TableContainer component={Paper} variant="outlined" sx={{ m: 1, width: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Ações</TableCell>
                  <TableCell>Número do Banco</TableCell>
                  <TableCell>Número da Conta</TableCell>
                  <TableCell>Nome do Banco</TableCell>
                  <TableCell>Tipo de Conta</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Data de Abertura</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <LinearProgress />
                    </TableCell>
                  </TableRow>
                ) : contasBancarias.length > 0 ? (
                  contasBancarias.map((conta) => (
                    <TableRow key={conta.idContasBancarias}>
                      <TableCell align="left" sx={{ width: '14%', paddingLeft: 1 }}>
                        <IconButton size="small" onClick={() => handleDeleteDialogOpen(conta.idContasBancarias)}>
                          <Icon>delete</Icon>
                        </IconButton>
                        <IconButton size="small" onClick={() => handleEdit(conta.idContasBancarias)}>
                          <Edit/>
                        </IconButton>
                        <IconButton size="small" onClick={() => navigate(`/contasBancarias/detalhe/${conta.idContasBancarias}`)}>
                          <MoreHoriz/>
                        </IconButton>
                      </TableCell>
                      <TableCell>{conta.NumeroBanco}</TableCell>
                      <TableCell>{conta.NumeroConta}</TableCell>
                      <TableCell>{conta.NomeBanco}</TableCell>
                      <TableCell>{conta.TipoConta}</TableCell>
                      <TableCell>{conta.StatusConta}</TableCell>
                      <TableCell>{conta.DataAbertura ? new Date(conta.DataAbertura).toLocaleDateString() : 'N/A'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography>Nenhuma conta bancária encontrada</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>

              {totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS && (
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Pagination
                        page={pagina}
                        count={Math.ceil(totalCount / Environment.LIMITE_DE_LINHAS)}
                        onChange={handlePaginationChange}
                      />
                    </TableCell>
                  </TableRow>
                </TableFooter>
              )}
            </Table>
          </TableContainer>

          <Dialog open={dialogOpen} onClose={handleDeleteDialogClose}>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Você tem certeza de que deseja excluir esta conta bancária? Esta ação não pode ser desfeita.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteDialogClose} color="primary">
                Cancelar
              </Button>
              <Button onClick={handleDelete} color="primary">
                Confirmar
              </Button>
            </DialogActions>
          </Dialog>
        </LayoutBaseDePagina>
      </div>
    </MenuLateral>
  );
};