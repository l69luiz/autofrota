//src/pages/contasbancarias/DetalhaContasBancaria.tsx
import React, { useState, useEffect } from 'react';
import {
  Button, Paper, TextField, Typography, MenuItem, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, Grid, Snackbar, Alert,
  CircularProgress, LinearProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ContasBancariasService, IDetalheContaBancaria } from '../../shared/services/api/contasBancarias/contasBancariasService';
import { LayoutBaseDePagina } from '../../shared/layouts/LayoutBaseDePaginas';
import { FerramentasDeDetalhe, MenuLateral } from '../../shared/components';

export const DetalheContaBancaria: React.FC = () => {
  const { idContasBancarias } = useParams<'idContasBancarias'>();
  console.log("Id vindo", idContasBancarias);
  const navigate = useNavigate();
  const idContaBancariaApagar = Number(idContasBancarias);
  const [contaBancaria, setContaBancaria] = useState<IDetalheContaBancaria>({
    idContasBancarias: Number(idContasBancarias),
    NumeroBanco: '',
    NumeroConta: '',
    DigitoConta: '',
    NumeroAgenciaBanco: '',
    DigitoAgencia: '',
    NomeBanco: '',
    TipoConta: '',
    NomeTitular: '',
    CPF_CNPJ_Titular: '',
    StatusConta: '',
    DataAbertura: null,
    Empresas_idEmpresa: null,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [contaBancariaIdParaDeletar, setContaBancariaIdParaDeletar] = useState<number | null>(null);
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
    setContaBancariaIdParaDeletar(id);
    setDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDialogOpen(false);
    setContaBancariaIdParaDeletar(null);
  };

  const handleDelete = async () => {
    if (contaBancariaIdParaDeletar) {
      try {
        setIsSaving(true);
        const result = await ContasBancariasService.deleteById(contaBancariaIdParaDeletar);
        if (result instanceof Error) {
          setMensagemErro(result.message);
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        } else {
          navigate('/contasBancarias');
        }
      } catch (error) {
        console.error('Erro ao deletar conta bancária:', error);
      } finally {
        setDialogOpen(false);
        setContaBancariaIdParaDeletar(null);
        setIsSaving(false);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setContaBancaria((prevContaBancaria) => ({
      ...prevContaBancaria,
      [name]: value,
    }));
  };

  const handleCriarContaBancaria = async () => {
    try {
      setIsSaving(true);
      if (idContasBancarias === 'novo') {
        // Verifica campos obrigatórios
        if (!contaBancaria.NumeroBanco) {
          setMensagemErro('Por favor, insira o número do banco.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          return;
        }

        if (!contaBancaria.NumeroConta) {
          setMensagemErro('Por favor, insira o número da conta.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          return;
        }

        const { idContasBancarias, ...contaBancariaSemId } = contaBancaria;
        const contaBancariaCriada = await ContasBancariasService.create(contaBancariaSemId);

        if (contaBancariaCriada instanceof Error) {
          setMensagemErro(contaBancariaCriada.message);
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        } else {
          setContaBancaria(contaBancaria);
          setMensagemErro('Conta bancária criada com sucesso!');
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
        setMensagemErro('Erro desconhecido ao criar conta bancária.');
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
      if (idContasBancarias && idContasBancarias !== 'novo') {
        // Verifica campos obrigatórios
        if (!contaBancaria.NumeroBanco) {
          setMensagemErro('Por favor, insira o número do banco.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          return;
        }

        if (!contaBancaria.NumeroConta) {
          setMensagemErro('Por favor, insira o número da conta.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          return;
        }

        const idContasBancariasNumber = Number(idContasBancarias);
        if (!isNaN(idContasBancariasNumber)) {
          const contaBancariaAtualizada = await ContasBancariasService.updateById(idContasBancariasNumber, contaBancaria);

          if (contaBancariaAtualizada instanceof Error) {
            setMensagemErro(contaBancariaAtualizada.message);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
          } else {
            setContaBancaria(contaBancaria);
            setMensagemErro('Conta bancária atualizada com sucesso!');
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
        setMensagemErro('Erro desconhecido ao atualizar a conta bancária.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/contasBancarias');
  };
 

  useEffect(() => {
    const fetchContaBancaria = async () => {
      try {
        if (idContasBancarias && idContasBancarias !== 'novo') {

          console.log("lkajçlkajslçdkfjlçaskdjf", idContasBancarias);
          alert(idContasBancarias);
          const idContasBancariasNumber = Number(idContasBancarias);

          if (!isNaN(idContasBancariasNumber)) {
            setIsSaving(true);
            const response = await ContasBancariasService.getById(idContasBancariasNumber);
            if (response instanceof Error) {
              console.error('Erro ao buscar conta bancária:', response.message);
              setMensagemErro('Erro ao buscar conta bancária: ' + response.message);
              setSnackbarSeverity('error');
              setOpenSnackbar(true);
            } else {
              setContaBancaria(response);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao buscar conta bancária:', error);
        setMensagemErro('Erro ao buscar conta bancária.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      } finally {
        setIsSaving(false);
      }
    };

    fetchContaBancaria();
  }, [idContasBancarias]);

  return (
    
    <MenuLateral>
      <div style={{ flex: 1 }}>
        <LayoutBaseDePagina
          titulo={idContasBancarias === 'novo' ? 'Nova Conta Bancária' : 'Detalhe da Conta Bancária'}
          barraDeFerramentas={
            <FerramentasDeDetalhe
              mostrarBotaoNovo={false}
              mostrarBotaoSalvarEFechar={false}
              mostrarBotaoSalvar={idContasBancarias !== 'novo'}
              mostrarBotaoSalvarCarregando={isSaving}
              mostrarBotaoCriar={idContasBancarias === 'novo'}
              mostrarBotaoCriarCarregando={isSaving}
              mostrarBotaoApagar={idContasBancarias !== 'novo'}
              aoClicarEmNovo={() => navigate('/contasBancarias/detalhe/novo')}
              aoClicarEmSalvar={handleSave}
              aoClicarEmCriar={handleCriarContaBancaria}
              aoClicarEmApagar={() => handleDeleteDialogOpen(idContaBancariaApagar)}
              aoClicarEmVoltar={handleCancel}
            />
           
          }
        >
          {isSaving && <LinearProgress />}
          <Paper elevation={3} sx={{ padding: 4, marginBottom: 4 }}>
            <Typography variant="h6" gutterBottom>
              {idContasBancarias === 'novo' ? 'Criar Nova Conta Bancária' : 'Editar Conta Bancária'}
            </Typography>
            <Grid container spacing={2}>
              {/* Número do Banco */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Número do Banco"
                  name="NumeroBanco"
                  value={contaBancaria.NumeroBanco}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>

              {/* Número da Conta */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Número da Conta"
                  name="NumeroConta"
                  value={contaBancaria.NumeroConta}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>

              {/* Dígito da Conta */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Dígito da Conta"
                  name="DigitoConta"
                  value={contaBancaria.DigitoConta || ''}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              {/* Número da Agência */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Número da Agência"
                  name="NumeroAgenciaBanco"
                  value={contaBancaria.NumeroAgenciaBanco || ''}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              {/* Dígito da Agência */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Dígito da Agência"
                  name="DigitoAgencia"
                  value={contaBancaria.DigitoAgencia || ''}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              {/* Nome do Banco */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Nome do Banco"
                  name="NomeBanco"
                  value={contaBancaria.NomeBanco || ''}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              {/* Tipo de Conta */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Tipo de Conta"
                  name="TipoConta"
                  value={contaBancaria.TipoConta || ''}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              {/* Nome do Titular */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Nome do Titular"
                  name="NomeTitular"
                  value={contaBancaria.NomeTitular || ''}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              {/* CPF/CNPJ do Titular */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="CPF/CNPJ do Titular"
                  name="CPF_CNPJ_Titular"
                  value={contaBancaria.CPF_CNPJ_Titular || ''}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              {/* Status da Conta */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Status da Conta"
                  name="StatusConta"
                  value={contaBancaria.StatusConta || ''}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              {/* Data de Abertura */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Data de Abertura"
                  name="DataAbertura"
                  type="date"
                  value={contaBancaria.DataAbertura || ''}
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