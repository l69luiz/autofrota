// src/pages/empresas/DetalheEmpresa.tsx

import React, { useState, useEffect } from 'react';
import {
  Button, Paper, TextField, Typography, MenuItem, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, Grid, Snackbar, Alert,
  CircularProgress, LinearProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { EmpresasService, IDetalheEmpresa } from '../../shared/services/api/empresas/empresasService';
import { LayoutBaseDePagina } from '../../shared/layouts/LayoutBaseDePaginas';
import { FerramentasDeDetalhe, MenuLateral } from '../../shared/components';
import { cnpj } from 'cpf-cnpj-validator';
import { applyMask } from '../../shared/tools/validators';

interface IDetalheEmpresaForm extends Omit<IDetalheEmpresa, 'idEmpresa'> {
  idEmpresa?: number;
}

export const DetalheEmpresa: React.FC = () => {
  const { idEmpresa } = useParams<'idEmpresa'>();
  const navigate = useNavigate();
  const idEmpresaApagar = Number(idEmpresa);
  const [empresa, setEmpresa] = useState<IDetalheEmpresaForm>({
    Nome_Empresa: '',
    NomeFantasia_Empresa: '',
    Endereco_Empresa: '',
    Telefone_Empresa: '',
    Email_Empresa: '',
    CNPJ_Empresa: '',
    CaminhoImgEmpresa: '',
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [empresaIdParaDeletar, setEmpresaIdParaDeletar] = useState<number | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('error');
  const [isSaving, setIsSaving] = useState(false);
  const [cnpjMasked, setCnpjMasked] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === 'CNPJ_Empresa') {
      const maskedValue = applyMask(value);
      setCnpjMasked(maskedValue);
      setEmpresa((prevEmpresa) => ({
        ...prevEmpresa,
        CNPJ_Empresa: value.replace(/\D/g, ''),
      }));
    } else {
      setEmpresa((prevEmpresa) => ({
        ...prevEmpresa,
        [name]: value,
      }));
    }
  };

  const handleDeleteDialogOpen = (id: number) => {
    setEmpresaIdParaDeletar(id);
    setDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDialogOpen(false);
    setEmpresaIdParaDeletar(null);
  };

  const handleDelete = async () => {
    if (empresaIdParaDeletar) {
      try {
        setIsSaving(true);
        const result = await EmpresasService.deleteById(empresaIdParaDeletar);
        if (result instanceof Error) {
          setMensagemErro(result.message);
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        } else {
          navigate('/empresas');
        }
      } catch (error) {
        console.error('Erro ao deletar empresa:', error);
        setMensagemErro('Erro ao deletar empresa.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      } finally {
        setIsSaving(false);
        setDialogOpen(false);
        setEmpresaIdParaDeletar(null);
      }
    }
  };

  const handleCriarEmpresa = async () => {
    try {
      setIsSaving(true);

      // Verifica se estamos criando uma nova empresa
      if (idEmpresa === 'novo') {
        // Verifica campos obrigatórios
        if (!empresa.Nome_Empresa) {
          setMensagemErro('Por favor, insira um nome válido.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          return;
        }

        if (!empresa.CNPJ_Empresa || !cnpj.isValid(empresa.CNPJ_Empresa)) {
          setMensagemErro('Por favor, insira um CNPJ válido.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          return;
        }

        // Criação da empresa
        const empresaCriada = await EmpresasService.create(empresa);

        if (empresaCriada instanceof Error) {
          setMensagemErro(empresaCriada.message);
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        } else {
          setMensagemErro('Empresa criada com sucesso!');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
          //navigate(`/empresas/detalhe/${empresaCriada.idEmpresa}`);
        }
      }
    } catch (error) {
      setMensagemErro('Erro ao criar empresa.' + error);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Verifica campos obrigatórios
      if (!empresa.Nome_Empresa) {
        setMensagemErro('Por favor, insira um nome válido.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }

      if (!empresa.CNPJ_Empresa || !cnpj.isValid(empresa.CNPJ_Empresa)) {
        setMensagemErro('Por favor, insira um CNPJ válido.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }

      if (idEmpresa && idEmpresa !== 'novo') {
        const idEmpresaNumber = Number(idEmpresa);
        if (!isNaN(idEmpresaNumber)) {
          const empresaAtualizada = await EmpresasService.updateById(idEmpresaNumber, empresa as IDetalheEmpresa);

          if (empresaAtualizada instanceof Error) {
            setMensagemErro(empresaAtualizada.message);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
          } else {
            setMensagemErro('Empresa atualizada com sucesso!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
          }
        }
      }
    } catch (error) {
      setMensagemErro('Erro ao atualizar empresa.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/empresas');
  };

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        if (idEmpresa && idEmpresa !== 'novo') {
          const idEmpresaNumber = Number(idEmpresa);
          if (!isNaN(idEmpresaNumber)) {
            setIsSaving(true);
            const response = await EmpresasService.getById(idEmpresaNumber);
            if (response instanceof Error) {
              console.error('Erro ao buscar empresa:', response.message);
              setMensagemErro('Erro ao buscar empresa.');
              setSnackbarSeverity('error');
              setOpenSnackbar(true);
            } else {
              setEmpresa(response);
              setCnpjMasked(applyMask(response.CNPJ_Empresa));
            }
          }
        }
      } catch (error) {
        console.error('Erro ao buscar empresa:', error);
        setMensagemErro('Erro ao buscar empresa.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      } finally {
        setIsSaving(false);
      }
    };

    fetchEmpresa();
  }, [idEmpresa]);

  return (
    <MenuLateral>
      <div style={{ flex: 1 }}>
        <LayoutBaseDePagina
          titulo="Detalhe de empresa"
          barraDeFerramentas={
            <FerramentasDeDetalhe
              mostrarBotaoNovo={false}
              mostrarBotaoSalvarEFechar={false}
              mostrarBotaoSalvar={idEmpresa !== 'novo'}
              mostrarBotaoSalvarCarregando={isSaving}
              mostrarBotaoCriar={idEmpresa === 'novo'}
              mostrarBotaoCriarCarregando={isSaving}
              mostrarBotaoApagar={idEmpresa !== 'novo'}
              aoClicarEmNovo={() => navigate('/empresas/detalhe/novo')}
              aoClicarEmSalvar={handleSave}
              aoClicarEmCriar={handleCriarEmpresa}
              aoClicarEmApagar={() => handleDeleteDialogOpen(idEmpresaApagar)}
              aoClicarEmVoltar={handleCancel}
            />
          }
        >
          {isSaving && <LinearProgress />}

          <Paper elevation={3} sx={{ padding: 4, marginBottom: 4 }}>
            <Typography variant="h6" gutterBottom>
              Insira os dados da empresa:
            </Typography>
            <Grid container spacing={2}>
              {/* Nome da Empresa */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Nome da Empresa"
                  name="Nome_Empresa"
                  value={empresa.Nome_Empresa}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>

              {/* Nome Fantasia */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Nome Fantasia"
                  name="NomeFantasia_Empresa"
                  value={empresa.NomeFantasia_Empresa}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              {/* CNPJ */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="CNPJ"
                  name="CNPJ_Empresa"
                  value={cnpjMasked}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>

              {/* Endereço */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Endereço"
                  name="Endereco_Empresa"
                  value={empresa.Endereco_Empresa}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              {/* Telefone */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Telefone"
                  name="Telefone_Empresa"
                  value={empresa.Telefone_Empresa || ''}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Email"
                  name="Email_Empresa"
                  type="email"
                  value={empresa.Email_Empresa || ''}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              {/* Caminho da Imagem */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Caminho da Imagem"
                  name="CaminhoImgEmpresa"
                  value={empresa.CaminhoImgEmpresa}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Paper>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={() => setOpenSnackbar(false)} variant="filled" severity={snackbarSeverity}>
              {mensagemErro}
            </Alert>
          </Snackbar>

          {/* Diálogo de Confirmação de Exclusão */}
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