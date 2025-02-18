//src/pages/clientes/ListagemDeClientes.tsx
import React, { useEffect, useMemo, useState } from "react";
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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ClientesService, IListagemCliente } from "../../shared/services/api/clientes/ClientesService";
import { LayoutBaseDePagina } from "../../shared/layouts/LayoutBaseDePaginas";
import { FerramentasDaListagem } from "../../shared/components";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDebounce } from "../../shared/hooks";
import { Api } from "../../shared/services/api/axios-config";
import { Environment } from "../../shared/environments";

export const ListagemDeClientes: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [rows, setRows] = useState<IListagemCliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // Controla o menu de ações
  const [selectedCliente, setSelectedCliente] = useState<number | null>(null); // Controla o cliente selecionado para ações

  const [dialogOpen, setDialogOpen] = useState(false); // Controla o diálogo de confirmação de exclusão
  const [clienteIdParaDeletar, setClienteIdParaDeletar] = useState<number | null>(null);

  const busca = useMemo(() => searchParams.get("busca") || "", [searchParams]);
  const pagina = useMemo(() => Number(searchParams.get("pagina")) || 1, [searchParams]);

  const handleClick = (event: React.MouseEvent<HTMLElement>, IdCliente: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedCliente(IdCliente);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedCliente(null);
  };

  const handleEdit = (IdCliente: number) => {
    navigate(`clientes/editar/${IdCliente}`);
  };

  const handleDeleteDialogOpen = (id: number) => {
    setClienteIdParaDeletar(id);
    setDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDialogOpen(false);
    setClienteIdParaDeletar(null);
  };

  const handleDelete = async () => {
    if (clienteIdParaDeletar) {
      try {
        const result = await ClientesService.deleteById(clienteIdParaDeletar);
        if (result instanceof Error) {
          alert(result.message);
        } else {
          // Atualize a lista de clientes após a exclusão
          setRows((prevRows) => prevRows.filter((cliente) => cliente.idCliente !== clienteIdParaDeletar));
        }
      } catch (error) {
        console.error("Erro ao deletar cliente:", error);
      } finally {
        setDialogOpen(false);
        setClienteIdParaDeletar(null);
      }
    }
  };

  useEffect(() => {
    const fetchClientes = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await Api.get("/clientes", {
          params: {
            _page: pagina,
            nome_like: busca,
            _limit: Environment.LIMITE_DE_LINHAS,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const clientes = response.data.data || [];
        setTotalCount(response.data.totalCount || 0);
        setRows(clientes);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        setRows([]);
      } finally {
        setIsLoading(false);
      }
    };

    debounce(fetchClientes);
  }, [busca, pagina, debounce]);

  const handlePaginationChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setSearchParams({ busca, pagina: newPage.toString() }, { replace: true });
  };

  return (
    <LayoutBaseDePagina
      titulo="Listagem de clientes"
      barraDeFerramentas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoBotaoNovo="Nova"
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
            ) : rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={row.idCliente}>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => handleDeleteDialogOpen(row.idCliente)}>
                      <Icon>delete</Icon>
                    </IconButton>
                    <IconButton size="small" onClick={() => handleEdit(row.idCliente)}>
                      <Icon>edit</Icon>
                    </IconButton>
                    <IconButton onClick={(event) => handleClick(event, row.idCliente)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && selectedCliente === row.idCliente}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={() => handleEdit(row.idCliente)}>Editar</MenuItem>
                      <MenuItem onClick={() => handleDeleteDialogOpen(row.idCliente)}>Excluir</MenuItem>
                    </Menu>
                  </TableCell>
                  <TableCell>{row.Nome}</TableCell>
                  <TableCell>{row.Email}</TableCell>
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

      {/* Dialog de confirmação para excluir cliente */}
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
  );
};
