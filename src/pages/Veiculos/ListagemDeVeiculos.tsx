// src/pages/veiculos/ListagemDeVeiculos.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Icon,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Pagination,
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
  Box,
} from "@mui/material";
import { MoreHoriz, Edit } from '@mui/icons-material';
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import { VeiculosService, IListagemVeiculo } from "../../shared/services/api/veiculos/VeiculosService";
import { LayoutBaseDePagina } from "../../shared/layouts/LayoutBaseDePaginas";
import { FerramentasDaListagem, MenuLateral } from "../../shared/components";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDebounce } from "../../shared/hooks";
import { Api } from "../../shared/services/api/axios-config";
import { Environment } from "../../shared/environments";
import { blue } from "@mui/material/colors";

export const ListagemDeVeiculos: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [veiculos, setVeiculos] = useState<IListagemVeiculo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedVeiculo, setSelectedVeiculo] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [veiculoIdParaDeletar, setVeiculoIdParaDeletar] = useState<number | null>(null);

  const busca = useMemo(() => searchParams.get("busca") || "", [searchParams]);
  const pagina = useMemo(() => Number(searchParams.get("pagina")) || 1, [searchParams]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, idVeiculo: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedVeiculo(idVeiculo);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVeiculo(null);
  };

  const handleEdit = useCallback((idVeiculo: number) => {
    navigate(`/veiculos/detalhe/${idVeiculo}`);
  }, [navigate]);

  const handleDeleteDialogOpen = useCallback((id: number) => {
    setVeiculoIdParaDeletar(id);
    setDialogOpen(true);
  }, []);

  const handleDeleteDialogClose = useCallback(() => {
    setDialogOpen(false);
    setVeiculoIdParaDeletar(null);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!veiculoIdParaDeletar) return;

    try {
      const result = await VeiculosService.deleteById(veiculoIdParaDeletar);
      if (result instanceof Error) {
        alert(result.message);
      } else {
        setVeiculos((prevVeiculos) =>
          prevVeiculos.filter((veiculo) => veiculo.idVeiculo !== veiculoIdParaDeletar)
        );
      }
    } catch (error) {
      console.error("Erro ao deletar veículo:", error);
    } finally {
      handleDeleteDialogClose();
    }
  }, [veiculoIdParaDeletar, handleDeleteDialogClose]);

  useEffect(() => {
    const fetchVeiculos = async () => {
      setIsLoading(true);
      try {
        const token = sessionStorage.getItem("token");
        const { data } = await Api.get("/veiculos", {
          params: {
            _page: pagina,
            search: busca, // Envia o parâmetro de busca
            _limit: Environment.LIMITE_DE_LINHAS,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setVeiculos(data.data || []);
        setTotalCount(data.totalCount || 0);
      } catch (error) {
        console.error("Erro ao buscar veículos:", error);
        setVeiculos([]);
      } finally {
        setIsLoading(false);
      }
    };
  
    debounce(fetchVeiculos);
  }, [busca, pagina, debounce]);

  const handlePaginationChange = useCallback(
    (_: React.ChangeEvent<unknown>, newPage: number) => {
      setSearchParams({ busca, pagina: newPage.toString() }, { replace: true });
    },
    [busca, setSearchParams]
  );

  return (

<MenuLateral>
      {/* O Dashboard será passado como children para o MenuLateral */}
      <div style={{ flex: 1 }}>

    <LayoutBaseDePagina
      titulo="Listagem de veículos"
      barraDeFerramentas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoBotaoNovo="Novo"
          aoClicarEmNovo={() => navigate('/veiculos/detalhe/novo')}
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
              <TableCell>Placa</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Ano</TableCell>
              <TableCell>Ano modelo</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <LinearProgress />
                </TableCell>
              </TableRow>
            ) : veiculos.length > 0 ? (
              veiculos.map((veiculo) => (
                <TableRow key={veiculo.idVeiculo}>
                  <TableCell align="left" sx={{ width: '14%', paddingLeft: 1 }}>
                    <IconButton size="small" onClick={() => handleDeleteDialogOpen(veiculo.idVeiculo)}>
                      <Icon>delete</Icon>
                    </IconButton>
                    <IconButton size="small" onClick={() => handleEdit(veiculo.idVeiculo)}>
                      <Edit/>
                    </IconButton>
                    <IconButton size="small" onClick={() => handleEdit(veiculo.idVeiculo)}>
                       <MoreHoriz />
                    </IconButton>
                  </TableCell>
                  <TableCell>{veiculo.Placa_Veiculo}</TableCell>
                  <TableCell>{veiculo.Marca}</TableCell>
                  <TableCell>{veiculo.Modelo}</TableCell>
                  <TableCell>{veiculo.Ano_fab}</TableCell>
                  <TableCell>{veiculo.Ano_mod}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography>Nenhum veículo encontrado</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5}>
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
            Você tem certeza de que deseja excluir este veículo? Esta ação não pode ser desfeita.
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
