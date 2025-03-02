//src/pages/estoques/DetalheEstoque.tsx
import React, { useState, useEffect } from 'react';
import {
  Button, Paper, TextField, Typography, MenuItem, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, Grid, Snackbar, Alert,
  CircularProgress, LinearProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { EstoquesService, IDetalheEstoque } from '../../shared/services/api/estoques/estoquesService';
import { LayoutBaseDePagina } from '../../shared/layouts/LayoutBaseDePaginas';
import { FerramentasDeDetalhe, MenuLateral } from '../../shared/components';

export const DetalheEstoque: React.FC = () => {
  const { idEstoque } = useParams<'idEstoque'>();
  const navigate = useNavigate();
  const idEstoqueApagar = Number(idEstoque);
  const [estoque, setEstoque] = useState<IDetalheEstoque>({
    idEstoque: Number(idEstoque),
    Nome: '',
    AreaTotal: null,
    AreaCoberta: null,
    Data_Abertura: null,
    Status: '',
    Local: '',
    Lojas_idLoja: null, // Defina o valor inicial conforme necessário
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [estoqueIdParaDeletar, setEstoqueIdParaDeletar] = useState<number | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('error');
  const [isSaving, setIsSaving] = useState(false);

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleDeleteDialogOpen = (id: number) => {
    setEstoqueIdParaDeletar(id);
    setDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDialogOpen(false);
    setEstoqueIdParaDeletar(null);
  };

  const handleDelete = async () => {
    if (estoqueIdParaDeletar) {
      try {
        setIsSaving(true);
        const result = await EstoquesService.deleteById(estoqueIdParaDeletar);
        if (result instanceof Error) {
          setMensagemErro(result.message);
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        } else {
          navigate('/estoques');
        }
      } catch (error) {
        console.error('Erro ao deletar estoque:', error);
      } finally {
        setDialogOpen(false);
        setEstoqueIdParaDeletar(null);
        setIsSaving(false);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEstoque((prevEstoque) => ({
      ...prevEstoque,
      [name]: value,
    }));
  };

  const handleCriarEstoque = async () => {
    try {
      setIsSaving(true);
      if (idEstoque === 'novo') {
        // Verifica campos obrigatórios
        if (!estoque.Nome) {
          setMensagemErro('Por favor, insira o nome do estoque.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          return;
        }

        const { idEstoque, ...estoqueSemId } = estoque;
        const estoqueCriado = await EstoquesService.create(estoqueSemId);

        if (estoqueCriado instanceof Error) {
          setMensagemErro(estoqueCriado.message);
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        } else {
          setEstoque(estoque);
          setMensagemErro('Estoque criado com sucesso!');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
        }
      }
    } catch (error) {
      if (error.response) {
        setMensagemErro(error.response.data.message);
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      } else {
        setMensagemErro('Erro desconhecido ao criar estoque.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      if (idEstoque && idEstoque !== 'novo') {
        // Verifica campos obrigatórios
        if (!estoque.Nome) {
          setMensagemErro('Por favor, insira o nome do estoque.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          return;
        }

        const idEstoqueNumber = Number(idEstoque);
        if (!isNaN(idEstoqueNumber)) {
          const estoqueAtualizado = await EstoquesService.updateById(idEstoqueNumber, estoque);

          if (estoqueAtualizado instanceof Error) {
            setMensagemErro(estoqueAtualizado.message);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
          } else {
            setEstoque(estoque);
            setMensagemErro('Estoque atualizado com sucesso!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
          }
        }
      }
    } catch (error) {
      if (error.response) {
        setMensagemErro(error.response.data.message);
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      } else {
        setMensagemErro('Erro desconhecido ao atualizar o estoque.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/estoques');
  };

  useEffect(() => {
    const fetchEstoque = async () => {
      try {
        if (idEstoque && idEstoque !== 'novo') {
          const idEstoqueNumber = Number(idEstoque);
          if (!isNaN(idEstoqueNumber)) {
            setIsSaving(true);
            const response = await EstoquesService.getById(idEstoqueNumber);
            if (response instanceof Error) {
              console.error('Erro ao buscar estoque:', response.message);
              setMensagemErro('Erro ao buscar estoque: ' + response.message);
              setSnackbarSeverity('error');
              setOpenSnackbar(true);
            } else {
              setEstoque(response);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao buscar estoque:', error);
        setMensagemErro('Erro ao buscar estoque.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      } finally {
        setIsSaving(false);
      }
    };

    fetchEstoque();
  }, [idEstoque]);

  return (
    <MenuLateral>
      <div style={{ flex: 1 }}>
        <LayoutBaseDePagina
          titulo={idEstoque === 'novo' ? 'Novo Estoque' : 'Detalhe do Estoque'}
          barraDeFerramentas={
            <FerramentasDeDetalhe
              mostrarBotaoNovo={false}
              mostrarBotaoSalvarEFechar={false}
              mostrarBotaoSalvar={idEstoque !== 'novo'}
              mostrarBotaoSalvarCarregando={isSaving}
              mostrarBotaoCriar={idEstoque === 'novo'}
              mostrarBotaoCriarCarregando={isSaving}
              mostrarBotaoApagar={idEstoque !== 'novo'}
              aoClicarEmNovo={() => navigate('/estoques/detalhe/novo')}
              aoClicarEmSalvar={handleSave}
              aoClicarEmCriar={handleCriarEstoque}
              aoClicarEmApagar={() => handleDeleteDialogOpen(idEstoqueApagar)}
              aoClicarEmVoltar={handleCancel}
            />
          }
        >
          {isSaving && <LinearProgress />}
          <Paper elevation={3} sx={{ padding: 4, marginBottom: 4 }}>
            <Typography variant="h6" gutterBottom>
              {idEstoque === 'novo' ? 'Criar Novo Estoque' : 'Editar Estoque'}
            </Typography>
            <Grid container spacing={2}>
              {/* Nome */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Nome"
                  name="Nome"
                  value={estoque.Nome}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>

              {/* Local */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Local"
                  name="Local"
                  value={estoque.Local}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              {/* Status */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Status"
                  name="Status"
                  value={estoque.Status}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              {/* Area total */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Area total"
                  name="AreaTotal"
                  type="number"
                  value={estoque.AreaTotal}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              {/* Area coberta */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Area coberta"
                  name="AreaCoberta"
                  type="number"
                  value={estoque.AreaCoberta}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>

              {/* Data da abertura */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Data da abertura"
                  name="Data_Abertura"
                  type="date"
                  value={estoque.Data_Abertura || ''}
                  onChange={handleInputChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>


            </Grid>
          </Paper>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseSnackbar} variant="filled" severity={snackbarSeverity}>
              {mensagemErro}
            </Alert>
          </Snackbar>

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