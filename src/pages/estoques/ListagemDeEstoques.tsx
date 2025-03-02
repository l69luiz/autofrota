//src/pages/estoques/ListagemDeEstoques.tsx
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

// Interface para representar um estoque
interface IEstoque {
  idEstoque: number;
  AreaTotal: number;
  AreaCoberta: number;
  Data_Abertura: Date | null;
  Status: string | null;
  Empresas_idEmpresa: number;
  Local: string | null;
  Nome: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Interface para a resposta da API (lista de estoques e totalCount)
interface IListagemEstoque {
  data: IEstoque[];
  totalCount: number;
}

export const ListagemDeEstoques: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [estoques, setEstoques] = useState<IEstoque[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [estoqueIdParaDeletar, setEstoqueIdParaDeletar] = useState<number | null>(null);

  const busca = useMemo(() => searchParams.get("busca") || "", [searchParams]);
  const pagina = useMemo(() => Number(searchParams.get("pagina")) || 1, [searchParams]);

  const handleDeleteDialogOpen = useCallback((id: number) => {
    setEstoqueIdParaDeletar(id);
    setDialogOpen(true);
  }, []);

  const handleDeleteDialogClose = useCallback(() => {
    setDialogOpen(false);
    setEstoqueIdParaDeletar(null);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!estoqueIdParaDeletar) return;

    try {
      const result = await Api.delete(`/estoques/${estoqueIdParaDeletar}`);
      if (result instanceof Error) {
        alert(result.message);
      } else {
        setEstoques((prevEstoques) =>
          prevEstoques.filter((estoque) => estoque.idEstoque !== estoqueIdParaDeletar)
        );
      }
    } catch (error) {
      console.error("Erro ao deletar estoque:", error);
    } finally {
      handleDeleteDialogClose();
    }
  }, [estoqueIdParaDeletar, handleDeleteDialogClose]);

  useEffect(() => {
    const fetchEstoques = async () => {
      setIsLoading(true);
      try {
        const token = sessionStorage.getItem("token");
        const { data } = await Api.get<IListagemEstoque>("/estoques", {
          params: {
            _page: pagina,
            nome_like: busca,
            _limit: Environment.LIMITE_DE_LINHAS,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setEstoques(data.data || []);
        setTotalCount(data.totalCount || 0);
      } catch (error) {
        console.error("Erro ao buscar estoques:", error);
        setEstoques([]);
      } finally {
        setIsLoading(false);
      }
    };

    debounce(fetchEstoques);
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
          titulo="Listagem de Estoques"
          barraDeFerramentas={
            <FerramentasDaListagem
              mostrarInputBusca
              textoBotaoNovo="Novo"
              aoClicarEmNovo={() => navigate('/estoques/detalhe/novo')}
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
                  <TableCell>Nome</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Local</TableCell>
                  <TableCell>Data da Abertura</TableCell>
                  <TableCell>Area Coberta</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <LinearProgress />
                    </TableCell>
                  </TableRow>
                ) : estoques.length > 0 ? (
                  estoques.map((estoque) => (
                    <TableRow key={estoque.idEstoque}>
                      <TableCell align="left" sx={{ width: '14%', paddingLeft: 1 }}>
                        <IconButton size="small" onClick={() => handleDeleteDialogOpen(estoque.idEstoque)}>
                          <Icon>delete</Icon>
                        </IconButton>
                        <IconButton size="small" onClick={() => navigate(`/estoques/detalhe/${estoque.idEstoque}`)}>
                          <Edit/>
                        </IconButton>
                        <IconButton size="small" onClick={() => navigate(`/estoques/detalhe/${estoque.idEstoque}`)}>
                          <MoreHoriz/>
                        </IconButton>
                      </TableCell>
                      <TableCell>{estoque.Nome}</TableCell>
                      <TableCell>{estoque.Status}</TableCell>
                      <TableCell>{estoque.Local}</TableCell>
                      <TableCell>{estoque.Data_Abertura ? new Date(estoque.Data_Abertura).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell>{estoque.AreaCoberta}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography>Nenhum estoque encontrado</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>

              {totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS && (
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={6}>
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
                Você tem certeza de que deseja excluir este estoque? Esta ação não pode ser desfeita.
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