// src/pages/empresas/ListagemDeEmpresas.tsx

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
} from "@mui/material";
import { MoreHoriz, Edit } from '@mui/icons-material';
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import { EmpresasService, IListagemEmpresa } from "../../shared/services/api/empresas/empresasService";
import { LayoutBaseDePagina } from "../../shared/layouts/LayoutBaseDePaginas";
import { FerramentasDaListagem, MenuLateral } from "../../shared/components";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDebounce } from "../../shared/hooks";
import { Environment } from "../../shared/environments";

export const ListagemDeEmpresas: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { debounce } = useDebounce();
  const navigate = useNavigate();

  const [empresas, setEmpresas] = useState<IListagemEmpresa[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEmpresa, setSelectedEmpresa] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [empresaIdParaDeletar, setEmpresaIdParaDeletar] = useState<number | null>(null);

  const busca = useMemo(() => searchParams.get("busca") || "", [searchParams]);
  const pagina = useMemo(() => Number(searchParams.get("pagina")) || 1, [searchParams]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, idEmpresa: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmpresa(idEmpresa);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEmpresa(null);
  };

  const handleEdit = useCallback((idEmpresa: number) => {
    navigate(`/empresas/detalhe/${idEmpresa}`);
  }, [navigate]);

  const handleDeleteDialogOpen = useCallback((id: number) => {
    setEmpresaIdParaDeletar(id);
    setDialogOpen(true);
  }, []);

  const handleDeleteDialogClose = useCallback(() => {
    setDialogOpen(false);
    setEmpresaIdParaDeletar(null);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!empresaIdParaDeletar) return;

    try {
      const result = await EmpresasService.deleteById(empresaIdParaDeletar);
      if (result instanceof Error) {
        alert(result.message);
      } else {
        setEmpresas((prevEmpresas) =>
          prevEmpresas.filter((empresa) => empresa.idEmpresa !== empresaIdParaDeletar)
        );
      }
    } catch (error) {
      console.error("Erro ao deletar empresa:", error);
    } finally {
      handleDeleteDialogClose();
    }
  }, [empresaIdParaDeletar, handleDeleteDialogClose]);

  useEffect(() => {
    const fetchEmpresas = async () => {
      setIsLoading(true);
      try {
        const result = await EmpresasService.getAll(pagina, busca);
        if (result instanceof Error) {
          alert(result.message);
        } else {
          setEmpresas(result.data);
          setTotalCount(result.totalCount);
        }
      } catch (error) {
        console.error("Erro ao buscar empresas:", error);
        setEmpresas([]);
      } finally {
        setIsLoading(false);
      }
    };

    debounce(fetchEmpresas);
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
          titulo="Listagem de empresas"
          barraDeFerramentas={
            <FerramentasDaListagem
              mostrarInputBusca
              textoBotaoNovo="Nova"
              aoClicarEmNovo={() => navigate('/empresas/detalhe/novo')}
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
                  <TableCell>Nome Fantasia</TableCell>
                  <TableCell>CNPJ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <LinearProgress />
                    </TableCell>
                  </TableRow>
                ) : empresas.length > 0 ? (
                  empresas.map((empresa) => (
                    <TableRow key={empresa.idEmpresa}>
                      <TableCell align="left" sx={{ width: '14%', paddingLeft: 1 }}>
                        <IconButton size="small" onClick={() => handleDeleteDialogOpen(empresa.idEmpresa)}>
                          <Icon>delete</Icon>
                        </IconButton>
                        <IconButton size="small" onClick={() => handleEdit(empresa.idEmpresa)}>
                          <Edit />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleEdit(empresa.idEmpresa)}>
                          <MoreHoriz />
                        </IconButton>
                      </TableCell>
                      <TableCell>{empresa.Nome_Empresa}</TableCell>
                      <TableCell>{empresa.NomeFantasia_Empresa}</TableCell>
                      <TableCell>{empresa.CNPJ_Empresa}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography>Nenhuma empresa encontrada</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>

              {totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS && (
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4}>
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
                Você tem certeza de que deseja excluir esta empresa? Esta ação não pode ser desfeita.
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