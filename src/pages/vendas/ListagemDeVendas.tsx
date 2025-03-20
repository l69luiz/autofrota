// src/pages/vendas/ListagemDeVendas.tsx
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
import { VendasService } from "../../shared/services/api/vendas/VendasService";
import { Environment } from "../../shared/environments";
import { LayoutBaseDePagina } from "../../shared/layouts/LayoutBaseDePaginas";
import { FerramentasDaListagem, MenuLateral } from "../../shared/components"; // Importando o MenuLateral
import { Api } from "../../shared/services/api/axios-config";

// Interface para representar uma venda
interface IVenda {
  idVenda: number;
  Data_Venda: string;
  Valor_Venda: number;
  cliente: {
    Nome: string;
  };
  usuario: {
    Nome: string;
  };
  veiculo: {
    Modelo: string;
    Placa_Veiculo: string;
  };
}

export const ListagemDeVendas: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [vendas, setVendas] = useState<IVenda[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [vendaIdParaDeletar, setVendaIdParaDeletar] = useState<number | null>(null);

  const busca = useMemo(() => searchParams.get("busca") || "", [searchParams]);
  const pagina = useMemo(() => Number(searchParams.get("pagina")) || 1, [searchParams]);

  const handleDeleteDialogOpen = useCallback((id: number) => {
    setVendaIdParaDeletar(id);
    setDialogOpen(true);
  }, []);

  const handleDeleteDialogClose = useCallback(() => {
    setDialogOpen(false);
    setVendaIdParaDeletar(null);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!vendaIdParaDeletar) return;

    try {
      const result = await VendasService.deleteById(vendaIdParaDeletar);
      if (result instanceof Error) {
        alert(result.message);
      } else {
        setVendas((prevVendas) =>
          prevVendas.filter((venda) => venda.idVenda !== vendaIdParaDeletar)
        );
      }
    } catch (error) {
      console.error("Erro ao deletar venda:", error);
    } finally {
      handleDeleteDialogClose();
    }
  }, [vendaIdParaDeletar, handleDeleteDialogClose]);



  useEffect(() => {
    const fetchVendas = async () => {
      setIsLoading(true);
      try {
        const token = sessionStorage.getItem("token");
        const { data } = await Api.get("/vendas", {
          params: {
            _page: pagina,
            search: busca, // Envia o parâmetro de busca
            _limit: Environment.LIMITE_DE_LINHAS,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setVendas(data.data || []);
        setTotalCount(data.totalCount || 0);
      } catch (error) {
        console.error("Erro ao buscar veículos:", error);
        setVendas([]);
      } finally {
        setIsLoading(false);
      }
    };

    debounce(fetchVendas);
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
          titulo="Listagem de Vendas"
          barraDeFerramentas={
            <FerramentasDaListagem
              mostrarInputBusca
              textoBotaoNovo="Nova Venda"
              aoClicarEmNovo={() => navigate('/vendas/detalhe/novo')}
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
                  <TableCell>Data da Venda</TableCell>
                  <TableCell>Valor da Venda</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Usuário</TableCell>
                  <TableCell>Veículo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <LinearProgress />
                    </TableCell>
                  </TableRow>
                ) : vendas.length > 0 ? (
                  vendas.map((venda) => (
                    <TableRow key={venda.idVenda}>
                      <TableCell align="left" sx={{ width: '14%', paddingLeft: 1 }}>
                        <IconButton size="small" onClick={() => handleDeleteDialogOpen(venda.idVenda)}>
                          <Icon>delete</Icon>
                        </IconButton>
                        <IconButton size="small" onClick={() => navigate(`/vendas/detalhe/${venda.idVenda}`)}>
                          <Edit />
                        </IconButton>
                        <IconButton size="small" onClick={() => navigate(`/vendas/detalhe/${venda.idVenda}`)}>
                          <MoreHoriz />
                        </IconButton>
                      </TableCell>
                      <TableCell>{new Date(venda.Data_Venda).toLocaleDateString()}</TableCell>
                      <TableCell>{venda.Valor_Venda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                      <TableCell>{venda.cliente ? venda.cliente.Nome : 'N/A'}</TableCell>
                      <TableCell>{venda.usuario ? venda.usuario.Nome : 'N/A'}</TableCell>
                      <TableCell>{venda.veiculo ? `${venda.veiculo.Modelo} - ${venda.veiculo.Placa_Veiculo}` : 'N/A'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography>Nenhuma venda encontrada</Typography>
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
                Você tem certeza de que deseja excluir esta venda? Esta ação não pode ser desfeita.
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