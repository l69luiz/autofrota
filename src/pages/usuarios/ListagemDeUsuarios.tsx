//src/pages/estoques/ListagemDeUsuarios.tsx
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
import { UsuariosService, IListagemUsuario } from "../../shared/services/api/usuarios/usuariosService";
import { LayoutBaseDePagina } from "../../shared/layouts/LayoutBaseDePaginas";
import { FerramentasDaListagem, MenuLateral } from "../../shared/components";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDebounce } from "../../shared/hooks";
import { Api } from "../../shared/services/api/axios-config";
import { Environment } from "../../shared/environments";

export const ListagemDeUsuarios: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState<IListagemUsuario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUsuario, setSelectedUsuario] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [usuarioIdParaDeletar, setUsuarioIdParaDeletar] = useState<number | null>(null);

  const busca = useMemo(() => searchParams.get("busca") || "", [searchParams]);
  const pagina = useMemo(() => Number(searchParams.get("pagina")) || 1, [searchParams]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, idUsuario: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedUsuario(idUsuario);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUsuario(null);
  };

  const handleEdit = useCallback((idUsuario: number) => {
    navigate(`/usuarios/detalhe/${idUsuario}`);
  }, [navigate]);

  const handleDeleteDialogOpen = useCallback((id: number) => {
    setUsuarioIdParaDeletar(id);
    setDialogOpen(true);
  }, []);

  const handleDeleteDialogClose = useCallback(() => {
    setDialogOpen(false);
    setUsuarioIdParaDeletar(null);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!usuarioIdParaDeletar) return;

    try {
      const result = await UsuariosService.deleteById(usuarioIdParaDeletar);
      if (result instanceof Error) {
        alert(result.message);
      } else {
        setUsuarios((prevUsuarios) =>
          prevUsuarios.filter((usuario) => usuario.idUsuario !== usuarioIdParaDeletar)
        );
      }
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
    } finally {
      handleDeleteDialogClose();
    }
  }, [usuarioIdParaDeletar, handleDeleteDialogClose]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      setIsLoading(true);
      try {
        const token = sessionStorage.getItem("token");
        const { data } = await Api.get("/usuarios", {
          params: {
            _page: pagina,
            nome_like: busca,
            _limit: Environment.LIMITE_DE_LINHAS,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsuarios(data.data || []);
        setTotalCount(data.totalCount || 0);
      } catch (error) {
        alert(error);
        console.error("Erro ao buscar usuários:", error);
        setUsuarios([]);
      } finally {
        setIsLoading(false);
      }
    };

    debounce(fetchUsuarios);
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
          titulo="Listagem de usuários"
          barraDeFerramentas={
            <FerramentasDaListagem
              mostrarInputBusca
              textoBotaoNovo="Novo"
              aoClicarEmNovo={() => navigate('/usuarios/detalhe/novo')}
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
                  <TableCell>Grupo</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <LinearProgress />
                    </TableCell>
                  </TableRow>
                ) : usuarios.length > 0 ? (
                  usuarios.map((usuario) => (
                    <TableRow key={usuario.idUsuario}>
                      <TableCell align="left" sx={{ width: '14%', paddingLeft: 1 }}>
                        <IconButton size="small" onClick={() => handleDeleteDialogOpen(usuario.idUsuario)}>
                          <Icon>delete</Icon>
                        </IconButton>
                        <IconButton size="small" onClick={() => handleEdit(usuario.idUsuario)}>
                          <Edit />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleEdit(usuario.idUsuario)}>
                          <MoreHoriz />
                        </IconButton>
                      </TableCell>
                      <TableCell>{usuario.Nome}</TableCell>
                      <TableCell>{usuario.Celular}</TableCell>
                      <TableCell>{usuario.Email}</TableCell>
                      <TableCell>{usuario.Grupo}</TableCell>
                      <TableCell>{usuario.Status}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography>Nenhum usuário encontrado</Typography>
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
                Você tem certeza de que deseja excluir este usuário? Esta ação não pode ser desfeita.
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