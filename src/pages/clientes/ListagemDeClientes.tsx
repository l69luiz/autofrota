//src/pages/clientes/ListagemDeClientes.tsx
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
import { AccessAlarm, ThreeDRotation, MoreHoriz, Edit } from '@mui/icons-material';

//import { Payment, MoreHoriz} from '@mui/icons-material';
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import { ClientesService, IListagemCliente } from "../../shared/services/api/clientes/ClientesService";
import { LayoutBaseDePagina } from "../../shared/layouts/LayoutBaseDePaginas";
import { FerramentasDaListagem, MenuLateral } from "../../shared/components";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDebounce } from "../../shared/hooks";
import { Api } from "../../shared/services/api/axios-config";
import { Environment } from "../../shared/environments";
import { blue, pink } from "@mui/material/colors";

export const ListagemDeClientes: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [clientes, setClientes] = useState<IListagemCliente[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCliente, setSelectedCliente] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [clienteIdParaDeletar, setClienteIdParaDeletar] = useState<number | null>(null);

  const busca = useMemo(() => searchParams.get("busca") || "", [searchParams]);
  const pagina = useMemo(() => Number(searchParams.get("pagina")) || 1, [searchParams]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, idCliente: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedCliente(idCliente);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCliente(null);
  };

  const handleEdit = useCallback((idCliente: number) => {
    navigate(`/clientes/detalhe/${idCliente}`);
  }, [navigate]);

  const handleDeleteDialogOpen = useCallback((id: number) => {
    setClienteIdParaDeletar(id);
    setDialogOpen(true);
  }, []);

  const handleDeleteDialogClose = useCallback(() => {
    setDialogOpen(false);
    setClienteIdParaDeletar(null);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!clienteIdParaDeletar) return;

    try {
      const result = await ClientesService.deleteById(clienteIdParaDeletar);
      if (result instanceof Error) {
        alert(result.message);
      } else {
        setClientes((prevClientes) =>
          prevClientes.filter((cliente) => cliente.idCliente !== clienteIdParaDeletar)
        );
      }
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
    } finally {
      handleDeleteDialogClose();
    }
  }, [clienteIdParaDeletar, handleDeleteDialogClose]);

  useEffect(() => {
    const fetchClientes = async () => {
      setIsLoading(true);
      try {
        const token = sessionStorage.getItem("token");
        const { data } = await Api.get("/clientes", {
          params: {
            _page: pagina,
            nome_like: busca,
            _limit: Environment.LIMITE_DE_LINHAS,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setClientes(data.data || []);
        setTotalCount(data.totalCount || 0);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        setClientes([]);
      } finally {
        setIsLoading(false);
      }
    };

    debounce(fetchClientes);
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
      titulo="Listagem de clientes"
      barraDeFerramentas={
       
        <FerramentasDaListagem
          mostrarInputBusca
          textoBotaoNovo="Novo"
          aoClicarEmNovo={() => navigate('/clientes/detalhe/novo')}
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
              <TableCell>Celular</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <LinearProgress />
                </TableCell>
              </TableRow>
            ) : clientes.length > 0 ? (
              clientes.map((cliente) => (
                <TableRow key={cliente.idCliente}>
                  <TableCell align="left" sx={{ width: '14%', paddingLeft: 1 }}>
                    <IconButton size="small" onClick={() => handleDeleteDialogOpen(cliente.idCliente)}>
                      <Icon>delete</Icon>
                    </IconButton>
                    <IconButton size="small" onClick={() => handleEdit(cliente.idCliente)}>
                      <Edit/>
                    </IconButton>
                    <IconButton size="small" onClick={() => handleEdit(cliente.idCliente)}>
                       <MoreHoriz/>
                    </IconButton>
                  </TableCell>
                  <TableCell>{cliente.Nome}</TableCell>
                  <TableCell>{cliente.Celular}</TableCell>
                  <TableCell>{cliente.Email}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography>Nenhum cliente encontrado</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>
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
            Você tem certeza de que deseja excluir este cliente? Esta ação não pode ser desfeita.
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


