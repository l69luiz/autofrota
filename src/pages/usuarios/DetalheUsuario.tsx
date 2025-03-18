import React, { useState, useEffect } from 'react';
import {
  Button, Paper, TextField, Typography, MenuItem, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, Grid, Snackbar, Alert,
  CircularProgress, Autocomplete, LinearProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { UsuariosService, IDetalheUsuario } from '../../shared/services/api/usuarios/usuariosService';
import { LayoutBaseDePagina } from '../../shared/layouts/LayoutBaseDePaginas';
import { FerramentasDeDetalhe, MenuLateral } from '../../shared/components';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { applyMask } from '../../shared/tools/validators';
import 'dayjs/locale/pt-br';
import cep from 'cep-promise';
import { InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'; // Ícone de busca
import { estados } from '../../shared/tools/estados';
import axios from 'axios';
import { cidadesMG } from '../../shared/tools/cidadesMG';

export const DetalheUsuario: React.FC = () => {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs());
  const { idUsuario } = useParams<'idUsuario'>();
  const navigate = useNavigate();
  const idUsuarioApagar = Number(idUsuario);
  const [usuario, setUsuario] = useState<IDetalheUsuario>({
    idUsuario: Number(idUsuario),
    Nome: '',
    CPF_CNPJ: '',
    CEP: '',
    Rua: '',
    Numero: '',
    Bairro: '',
    Cidade: '',
    Estado: '',
    Celular: '',
    Celular2: '',
    RG: '',
    Tipo: '',
    Cargo: '',
    Salario: 0,
    Data_Admissao: '',
    Email: '',
    Senha: '',
    Grupo: '',
    Data_Demissao: '',
    Status: '',
    Empresas_idEmpresa: 0,
  });

  const tiposUsuario = ['Administrador', 'Funcionário', 'Gerente'];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [usuarioIdParaDeletar, setUsuarioIdParaDeletar] = useState<number | null>(null);
  const [dataAdmissao, setDataAdmissao] = React.useState<Dayjs | null>(usuario.Data_Admissao ? dayjs(usuario.Data_Admissao) : null);
  const [emailError, setEmailError] = useState('');
  const [cpfCnpjMasked, setCpfCnpjMasked] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('error');
  const [cidades, setCidades] = useState<string[]>([]);
  const [carregandoCidades, setCarregandoCidades] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState(false);

  const buscarCEP = async (cepValue: string) => {
    try {
      setIsSaving(true);
      const cepData = await cep(cepValue);
      setUsuario((prevUsuario) => ({
        ...prevUsuario,
        Rua: cepData.street || '',
        Bairro: cepData.neighborhood || '',
        Estado: cepData.state || '',
        Cidade: cepData.city || '',
      }));
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      setMensagemErro('CEP não encontrado ou inválido.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleDataAdmissaoChange = (date: Dayjs | null) => {
    setDataAdmissao(date);
    if (date) {
      const formattedDate = date.format('YYYY-MM-DD');
      setUsuario((prevUsuario) => ({
        ...prevUsuario,
        Data_Admissao: formattedDate,
      }));
    } else {
      setUsuario((prevUsuario) => ({
        ...prevUsuario,
        Data_Admissao: '',
      }));
    }
  };

  const handleDeleteDialogOpen = (id: number) => {
    setUsuarioIdParaDeletar(id);
    setDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDialogOpen(false);
    setUsuarioIdParaDeletar(null);
  };

  const handleDelete = async () => {
    if (usuarioIdParaDeletar) {
      try {
        setIsSaving(true);
        const result = await UsuariosService.deleteById(usuarioIdParaDeletar);
        if (result instanceof Error) {
          alert(result.message);
        } else {
          navigate('/usuarios');
        }
      } catch (error) {
        console.error('Erro ao deletar usuário:', error);
      } finally {
        setDialogOpen(false);
        setUsuarioIdParaDeletar(null);
        setIsSaving(false);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === 'CPF_CNPJ') {
      const maskedValue = applyMask(value);
      setCpfCnpjMasked(maskedValue);
      setUsuario((prevUsuario) => ({
        ...prevUsuario,
        CPF_CNPJ: value.replace(/\D/g, ''),
      }));
    } else {
      setUsuario((prevUsuario) => ({
        ...prevUsuario,
        [name]: value,
      }));
    }
  };

  const handleCriarUsuario = async () => {
    try {
      setIsSaving(true);
      if (idUsuario === 'novo') {
        if (!usuario.Nome) {
          setMensagemErro('Por favor, insira um nome válido.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          return;
        }
        if (!usuario.Data_Admissao) {
          setMensagemErro('Por favor, preencha a data de admissão.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          return;
        }
        if (!usuario.Tipo) {
          setMensagemErro('Por favor, escolha um tipo de usuário.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(usuario.Email) || !usuario.Email) {
          setMensagemErro('Por favor, insira um e-mail válido.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          return;
        }

        if (usuario.CPF_CNPJ && cpf.isValid(usuario.CPF_CNPJ) === false && cnpj.isValid(usuario.CPF_CNPJ) === false || !usuario.CPF_CNPJ) {
          setMensagemErro('Por favor, confira o CPF ou CNPJ digitado.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          return;
        }

        const { idUsuario, ...usuarioSemId } = usuario;
        const usuarioCriado = await UsuariosService.create(usuarioSemId);

        if (usuarioCriado instanceof Error) {
          setMensagemErro(usuarioCriado.message);
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        } else {
          setUsuario(usuario);
          setMensagemErro('Registro criado com sucesso!');
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
        setMensagemErro('Erro desconhecido ao criar registro.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
      return;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      if (idUsuario && idUsuario !== 'novo') {
        if (!usuario.Nome) {
          setMensagemErro('Por favor, insira um nome válido.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          return;
        }
        if (!usuario.Data_Admissao) {
          setMensagemErro('Por favor, preencha a data de admissão.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          return;
        }
        if (!usuario.Tipo) {
          setMensagemErro('Por favor, escolha um tipo de usuário.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(usuario.Email) || !usuario.Email) {
          setMensagemErro('Por favor, insira um e-mail válido.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          return;
        }

        if (usuario.CPF_CNPJ && cpf.isValid(usuario.CPF_CNPJ) === false && cnpj.isValid(usuario.CPF_CNPJ) === false || !usuario.CPF_CNPJ) {
          setMensagemErro('Por favor, confira o CPF ou CNPJ digitado.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          return;
        }

        const idUsuarioNumber = Number(idUsuario);
        if (!isNaN(idUsuarioNumber)) {
          const usuarioAtualizado = await UsuariosService.updateById(idUsuarioNumber, usuario);

          if (usuarioAtualizado instanceof Error) {
            setMensagemErro(usuarioAtualizado.message);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
          } else {
            setUsuario(usuario);
            setMensagemErro('Usuário atualizado com sucesso!');
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
        setMensagemErro('Erro desconhecido ao atualizar o usuário.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
      return;
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/usuarios');
  };

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        if (idUsuario && idUsuario !== 'novo') {
          const idUsuarioNumber = Number(idUsuario);
          if (!isNaN(idUsuarioNumber)) {
            setIsSaving(true);
            const response = await UsuariosService.getById(idUsuarioNumber);
            if (response instanceof Error) {
              console.error('Erro ao buscar usuário:', response.message);
              alert('Erro ao buscar usuário: ' + response.message);
            } else {
              setUsuario({
                ...usuario,
                ...response,
              });
              setCpfCnpjMasked(applyMask(response.CPF_CNPJ));
              if (response.Data_Admissao) {
                setDataAdmissao(dayjs(response.Data_Admissao));
              }
            }
          } else {
            console.error('ID de usuário inválido:', idUsuario);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar os dados do usuário:', error);
        alert('Erro ao buscar os dados do usuário.');
      } finally {
        setIsSaving(false);
      }
    };

    fetchUsuario();
  }, [idUsuario]);

  useEffect(() => {
    const buscarCidades = async () => {
      if (usuario.Estado && usuario.Estado !== "MG") {
        try {
          setCarregandoCidades(true);
          const response = await axios.get(
            `https://brasilapi.com.br/api/ibge/municipios/v1/${usuario.Estado}`
          );
          setCidades(response.data.map((cidade: any) => cidade.nome));
        } catch (error) {
          console.error('Erro ao buscar cidades:', error);
          setMensagemErro('Erro ao buscar cidades. Tente novamente.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        } finally {
          setCarregandoCidades(false);
        }
      } else {
        try {
          setCarregandoCidades(true);
          setCidades(cidadesMG.map((cidade: any) => cidade.nome));
        } catch (error) {
          console.error('Erro ao buscar cidades:', error);
          setMensagemErro('Erro ao buscar cidades. Tente novamente.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        } finally {
          setCarregandoCidades(false);
        }
      }
    };

    buscarCidades();
  }, [usuario.Estado]);

  return (
    <MenuLateral>
      <div style={{ flex: 1 }}>
        <LayoutBaseDePagina
          titulo="Detalhe de usuário"
          barraDeFerramentas={
            <FerramentasDeDetalhe
              mostrarBotaoNovo={false}
              mostrarBotaoSalvarEFechar={false}
              mostrarBotaoSalvar={idUsuario !== 'novo'}
              mostrarBotaoSalvarCarregando={isSaving}
              mostrarBotaoCriar={idUsuario === 'novo'}
              mostrarBotaoCriarCarregando={isSaving}
              mostrarBotaoApagar={idUsuario !== 'novo'}
              aoClicarEmNovo={() => navigate('/usuarios/detalhe/novo')}
              aoClicarEmSalvar={handleSave}
              aoClicarEmCriar={handleCriarUsuario}
              aoClicarEmApagar={() => handleDeleteDialogOpen(idUsuarioApagar)}
              aoClicarEmVoltar={handleCancel}
            />
          }
        >
          {isSaving && <LinearProgress />}

          <Paper elevation={3} sx={{ padding: 4, marginBottom: 4 }}>
            <Typography variant="h6" gutterBottom>
              Insira os dados do novo usuário:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Nome"
                  name="Nome"
                  value={usuario.Nome}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="CPF/CNPJ"
                  name="CPF_CNPJ"
                  value={cpfCnpjMasked}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="CEP"
                  name="CEP"
                  value={usuario.CEP || ''}
                  onChange={handleInputChange}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => buscarCEP(usuario.CEP)}
                          edge="end"
                          sx={{ color: 'primary.main' }}
                        >
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Rua"
                  name="Rua"
                  value={usuario.Rua}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Número"
                  name="Numero"
                  value={usuario.Numero}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Bairro"
                  name="Bairro"
                  value={usuario.Bairro}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Estado"
                  name="Estado"
                  value={usuario.Estado}
                  onChange={handleInputChange}
                  select
                  fullWidth
                >
                  {estados.map((estado) => (
                    <MenuItem key={estado.sigla} value={estado.sigla}>
                      {estado.nome}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Autocomplete
                  options={cidades}
                  loading={carregandoCidades}
                  value={usuario.Cidade}
                  onChange={(event, newValue) => {
                    setUsuario((prevUsuario) => ({
                      ...prevUsuario,
                      Cidade: newValue || '',
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Cidade"
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {carregandoCidades ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Celular"
                  name="Celular"
                  value={usuario.Celular}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Celular Secundário"
                  name="Celular2"
                  value={usuario.Celular2}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="RG"
                  name="RG"
                  value={usuario.RG}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Email"
                  name="Email"
                  type="email"
                  value={usuario.Email}
                  onChange={handleInputChange}
                  error={!!emailError}
                  helperText={emailError}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'pt-br'}>
                  <DatePicker
                    label="Data de admissão *"
                    value={dataAdmissao}
                    onChange={handleDataAdmissaoChange}
                    views={['day', 'month', 'year']}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Tipo de Usuário"
                  name="Tipo"
                  value={usuario.Tipo}
                  onChange={handleInputChange}
                  select
                  fullWidth
                  required
                >
                  {tiposUsuario.map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Cargo"
                  name="Cargo"
                  value={usuario.Cargo}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Salário"
                  name="Salario"
                  value={usuario.Salario}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Grupo"
                  name="Grupo"
                  value={usuario.Grupo}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Status"
                  name="Status"
                  value={usuario.Status}
                  onChange={handleInputChange}
                  fullWidth
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