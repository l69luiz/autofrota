//src/pages/clientes/DetalheCliente.tsx

import React, { useState, useEffect } from 'react';
import {
  Button,
  Paper,
  TextField,
  Typography,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  Autocomplete
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ClientesService, IListagemCliente } from '../../shared/services/api/clientes/ClientesService';
import { LayoutBaseDePagina } from '../../shared/layouts/LayoutBaseDePaginas';
import { FerramentasDeDetalhe, MenuLateral } from '../../shared/components';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { cpf, cnpj } from 'cpf-cnpj-validator';
import { applyMask } from '../../shared/tools/validators';
import 'dayjs/locale/pt-br';
import { ptBR } from '@mui/material/locale';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import cep from 'cep-promise';
import { InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'; // Ícone de busca
import { estados } from '../../shared/tools/estados';
import axios from 'axios';


interface IDetalheCliente {
  idCliente: number;
  Nome: string;
  CPF_CNPJ: string;
  Rua: string;
  Numero: string;
  Bairro: string;
  Estado: string,
  Cidade: string;
  Celular: string;
  Celular2: string;
  RG: string;
  Tipo_Cliente: string;
  Email: string;
  Grupo: string;
  StatusAutoRastrear: string;
  StatusLoja: string;
  Data_Nascimento: string;
  Sexo: string;
  Estado_Civil: string;
  CEP: string;
}

export const DetalheCliente: React.FC = () => {

  const [value, setValue] = React.useState<Dayjs | null>(dayjs());
  const { idCliente } = useParams<'idCliente'>();
  const navigate = useNavigate();
  const idClienteApagar = Number(idCliente);
  const [cliente, setCliente] = useState<IDetalheCliente>({
    idCliente: Number(idCliente),
    Nome: '',
    CPF_CNPJ: '',
    Rua: '',
    Numero: '',
    Bairro: '',
    Estado: '',
    Cidade: '',
    Celular: '',
    Celular2: '',
    RG: '',
    Tipo_Cliente: '',
    Email: '',
    Grupo: '',
    StatusAutoRastrear: '',
    StatusLoja: '',
    Data_Nascimento: '',
    Sexo: '',
    Estado_Civil: '',
    CEP: '',
  });

  const tiposCliente = ['Pessoa Física', 'Pessoa Jurídica'];
  const sexos = ['Masculino', 'Feminino', 'Outro'];
  const estadosCivis = ['Solteiro', 'Casado', 'Divorciado', 'Viúvo'];
  const clienteGrupo = ['Comum', 'Prioritário', 'Funcionário', 'VIP', 'Devedor'];
  const clienteStatusAutoRastrear = ['Ativo', 'Suspenso', 'Inativo', 'Retirado', 'Devedor'];
  const clienteStatusLoja = ['Ativo', 'Suspenso', 'Inativo', 'Retirado', 'Devedor'];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [clienteIdParaDeletar, setClienteIdParaDeletar] = useState<number | null>(null);
  const [dataNascimento, setDataNascimento] = React.useState<Dayjs | null>(cliente.Data_Nascimento ? dayjs(cliente.Data_Nascimento) : null);
  const [emailError, setEmailError] = useState('');
  const [cpfCnpjMasked, setCpfCnpjMasked] = useState(''); // estado separado para exibir a máscara
  const [openSnackbar, setOpenSnackbar] = useState(false); // Controla a exibição do Snackbar
  const [mensagemErro, setMensagemErro] = useState(''); // Guarda a mensagem de erro
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('error'); // Severidade dinâmica

  const [cidades, setCidades] = useState<string[]>([]);
  const [carregandoCidades, setCarregandoCidades] = useState<boolean>(false);



  // const handleCloseSnackbar = () => {
  //   setOpenSnackbar(false);
  // };

  const buscarCEP = async (cepValue: string) => {
    try {
      const cepData = await cep(cepValue);
      setCliente((prevCliente) => ({
        ...prevCliente,
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
    }
  };



  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);

    // Após fechar o snackbar, navega para a rota de clientes
    // navigate('/clientes');
  };

  const handleDataNascimentoChange = (date: Dayjs | null) => {
    setDataNascimento(date);
    if (date) {
      const formattedDate = date.format('YYYY-MM-DD');
      setCliente((prevCliente) => ({
        ...prevCliente,
        Data_Nascimento: formattedDate,
      }));
    } else {
      setCliente((prevCliente) => ({
        ...prevCliente,
        Data_Nascimento: '',
      }));
    }
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
          navigate('/clientes');
        }
      } catch (error) {
        console.error('Erro ao deletar cliente:', error);
      } finally {
        setDialogOpen(false);
        setClienteIdParaDeletar(null);
      }
    }
  };


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Se for o campo CPF/CNPJ, aplicamos a máscara
    if (name === 'CPF_CNPJ') {
      const maskedValue = applyMask(value);
      setCpfCnpjMasked(maskedValue); // Atualiza o estado com a máscara
      setCliente((prevCliente) => ({
        ...prevCliente,
        CPF_CNPJ: value.replace(/\D/g, ''), // Remove a máscara e armazena só os números no estado do cliente
      }));
    } else {
      setCliente((prevCliente) => ({
        ...prevCliente,
        [name]: value,
      }));
    }
  };

  const handleCriarCliente = async () => {
    try {
      if (idCliente === 'novo') {
        // Verifica campos obrigatórios
        if (!cliente.Nome) {
          setMensagemErro('Por favor, insira um nome válido.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          //alert('Por favor, preencha todos os campos obrigatórios: Nome, CPF/CNPJ, Email, Data de Nascimento e Tipo de Cliente.');
          return;
        }
        if (!cliente.Data_Nascimento) {
          setMensagemErro('Por favor, preencha a data de nascimento.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          //alert('Por favor, preencha todos os campos obrigatórios: Nome, CPF/CNPJ, Email, Data de Nascimento e Tipo de Cliente.');
          return;
        }
        if (!cliente.Tipo_Cliente) {
          setMensagemErro('Por favor, escolha um tipo de cliente.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          //alert('Por favor, preencha todos os campos obrigatórios: Nome, CPF/CNPJ, Email, Data de Nascimento e Tipo de Cliente.');
          return;
        }

        // Verificação de formato de e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cliente.Email) || !cliente.Email) {
          setMensagemErro('Por favor, insira um e-mail válido.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          //alert('Por favor, insira um e-mail válido.');
          return;
        }

        //Validação CPF_CNPJ
        if (cliente.CPF_CNPJ && cpf.isValid(cliente.CPF_CNPJ) === false && cnpj.isValid(cliente.CPF_CNPJ) === false || !cliente.CPF_CNPJ) {
          setMensagemErro('Por favor, confira o CPF ou CNPJ digitado.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          //alert('Por favor, confira o CPF ou CNPJ digitado.');
          return;
        }

        // Criação do cliente
        const { idCliente, ...clienteSemId } = cliente;
        const clienteCriado = await ClientesService.create(clienteSemId);

        if (clienteCriado instanceof Error) {
          setMensagemErro(clienteCriado.message);
          setSnackbarSeverity('error');
          setOpenSnackbar(true);

        } else {
          setCliente(cliente); // Atualiza o estado com o cliente retornado
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
        //navigate('/clientes');
      } else {
        setMensagemErro('Erro desconhecido ao criar registro.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        //navigate('/clientes');
      }

      return;

    }
  };

  const handleSaveEFechar = async () => {
    try {
      if (idCliente && idCliente !== 'novo') {

        // Verifica campos obrigatórios
        if (!cliente.Nome || !cliente.CPF_CNPJ || !cliente.Email || !cliente.Data_Nascimento || !cliente.Tipo_Cliente) {
          alert('Por favor, preencha todos os campos obrigatórios: Nome, CPF/CNPJ, Email, Data de Nascimento e Tipo de Cliente.');
          return;
        }

        // Verificação de formato de e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cliente.Email)) {
          alert('Por favor, insira um e-mail válido.');
          return;
        }

        //Validação CPF_CNPJ
        if (cliente.CPF_CNPJ && cpf.isValid(cliente.CPF_CNPJ) === false && cnpj.isValid(cliente.CPF_CNPJ) === false) {
          alert('Por favor, confira o CPF ou CNPJ digitado.');
          return;

        }

        const idClienteNumber = Number(idCliente);
        if (!isNaN(idClienteNumber)) {
          const clienteAtualizado = await ClientesService.UpdateById(idClienteNumber, cliente);

          if (clienteAtualizado instanceof Error) {
            setMensagemErro(clienteAtualizado.message);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            //navigate('/clientes');
          } else {
            setCliente(cliente); // Atualiza o estado com o cliente retornado
            setMensagemErro('Cliente atualizado com sucesso!');
            setSnackbarSeverity('success');
            //navigate('/clientes');
            setOpenSnackbar(true);

          }
        }
      }
    } catch (error) {

      if (error.response) {
        setMensagemErro(error.response.data.message);
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        //navigate('/clientes');
      } else {
        setMensagemErro('Erro desconhecido ao atualizar o cliente.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        //navigate('/clientes');
      }
      return;
    }
  };


  const handleSave = async () => {
    try {
      if (idCliente && idCliente !== 'novo') {

        // Verifica campos obrigatórios
        if (!cliente.Nome) {
          setMensagemErro('Por favor, insira um nome válido.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          //alert('Por favor, preencha todos os campos obrigatórios: Nome, CPF/CNPJ, Email, Data de Nascimento e Tipo de Cliente.');
          return;
        }
        if (!cliente.Data_Nascimento) {
          setMensagemErro('Por favor, preencha a data de nascimento.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          //alert('Por favor, preencha todos os campos obrigatórios: Nome, CPF/CNPJ, Email, Data de Nascimento e Tipo de Cliente.');
          return;
        }
        if (!cliente.Tipo_Cliente) {
          setMensagemErro('Por favor, escolha um tipo de cliente.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          //alert('Por favor, preencha todos os campos obrigatórios: Nome, CPF/CNPJ, Email, Data de Nascimento e Tipo de Cliente.');
          return;
        }

        // Verificação de formato de e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cliente.Email) || !cliente.Email) {
          setMensagemErro('Por favor, insira um e-mail válido.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          //alert('Por favor, insira um e-mail válido.');
          return;
        }

        //Validação CPF_CNPJ
        if (cliente.CPF_CNPJ && cpf.isValid(cliente.CPF_CNPJ) === false && cnpj.isValid(cliente.CPF_CNPJ) === false || !cliente.CPF_CNPJ) {
          setMensagemErro('Por favor, confira o CPF ou CNPJ digitado.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          //alert('Por favor, confira o CPF ou CNPJ digitado.');
          return;

        }

        const idClienteNumber = Number(idCliente);
        if (!isNaN(idClienteNumber)) {
          const clienteAtualizado = await ClientesService.UpdateById(idClienteNumber, cliente);

          if (clienteAtualizado instanceof Error) {
            setMensagemErro(clienteAtualizado.message);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);

          } else {
            setCliente(cliente); // Atualiza o estado com o cliente retornado
            setMensagemErro('Cliente atualizado com sucesso!');
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
        //navigate('/clientes');
      } else {
        setMensagemErro('Erro desconhecido ao atualizar o cliente.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        //navigate('/clientes');
      }
      return;
    }
  };


  const handleCancel = () => {
    navigate('/clientes');
  };

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        if (idCliente && idCliente !== 'novo') {
          const idClienteNumber = Number(idCliente);
          if (!isNaN(idClienteNumber)) {
            const response = await ClientesService.getById(idClienteNumber);
            if (response instanceof Error) {
              console.error('Erro ao buscar cliente:', response.message);
              alert('Erro ao buscar cliente: ' + response.message);
            } else {
              setCliente({
                ...cliente,
                ...response,
              });
              setCpfCnpjMasked(applyMask(response.CPF_CNPJ)); // Aplica a máscara ao carregar o cliente
              if (response.Data_Nascimento) {
                setDataNascimento(dayjs(response.Data_Nascimento));
              }
            }
          } else {
            console.error('ID de cliente inválido:', idCliente);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar os dados do cliente:', error);
        alert('Erro ao buscar os dados do cliente.');
      }
    };

    fetchCliente();
  }, [idCliente]);


  // Busca as cidades ao selecionar um estado
  useEffect(() => {
    const buscarCidades = async () => {
      if (cliente.Estado) {
        setCarregandoCidades(true);
        try {
          const response = await axios.get(
            `https://brasilapi.com.br/api/ibge/municipios/v1/${cliente.Estado}`
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
      }
    };

    buscarCidades();
  }, [cliente.Estado]);




  return (
    <MenuLateral>
      <div style={{ flex: 1 }}>
        <LayoutBaseDePagina
          titulo="Detalhe de cliente"
          barraDeFerramentas={
            <FerramentasDeDetalhe
              mostrarBotaoNovo={false}
              //mostrarBotaoSalvarEFechar={idCliente !== 'novo'}
              mostrarBotaoSalvarEFechar={false}
              mostrarBotaoSalvar={idCliente !== 'novo'}
              mostrarBotaoCriar={idCliente === 'novo'}
              mostrarBotaoApagar={idCliente !== 'novo'}
              aoClicarEmNovo={() => navigate('/clientes/detalhe/novo')}
              aoClicarEmSalvarEFechar={handleSaveEFechar}
              aoClicarEmSalvar={handleSave}
              aoClicarEmCriar={handleCriarCliente}
              aoClicarEmApagar={() => handleDeleteDialogOpen(idClienteApagar)}
              aoClicarEmVoltar={handleCancel}
            />
          }
        >
          <Paper elevation={3} sx={{ padding: 4, marginBottom: 4 }}>
            <Typography variant="h6" gutterBottom>
              Insira os dados do novo cliente:
            </Typography>
            <Grid container spacing={2}>
              {/* Nome */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Nome"
                  name="Nome"
                  value={cliente.Nome}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>

              {/* CPF/CNPJ */}
              <Grid item xs={12} sm={6} md={4}>

                {/* CPF/CNPJ */}
                <TextField
                  label="CPF/CNPJ"
                  name="CPF_CNPJ"
                  value={cpfCnpjMasked} // Renderiza o valor mascarado
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>

              {/* Busca CEP */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="CEP"
                  name="CEP"
                  value={cliente.CEP || ''}
                  onChange={handleInputChange}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => buscarCEP(cliente.CEP)}
                          edge="end"
                          sx={{ color: 'primary.main' }} // Estilização opcional
                        >
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Rua */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Rua"
                  name="Rua"
                  value={cliente.Rua}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              {/* Número */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Número"
                  name="Numero"
                  value={cliente.Numero}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              {/* Bairro */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Bairro"
                  name="Bairro"
                  value={cliente.Bairro}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              {/* Cidade */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Estado"
                  name="Estado"
                  value={cliente.Estado}
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
                  value={cliente.Cidade}
                  onChange={(event, newValue) => {
                    setCliente((prevCliente) => ({
                      ...prevCliente,
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

              {/* Celular */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Celular"
                  name="Celular"
                  value={cliente.Celular}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              {/* Celular Secundário */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Celular Secundário"
                  name="Celular2"
                  value={cliente.Celular2}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              {/* RG */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="RG"
                  name="RG"
                  value={cliente.RG}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Email"
                  name="Email"
                  type="email"
                  value={cliente.Email}
                  onChange={handleInputChange}
                  error={!!emailError}
                  helperText={emailError}
                  fullWidth
                  required
                />
              </Grid>

              {/* Data de Nascimento */}
              <Grid item xs={12} sm={6} md={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'pt-br'}>
                  <DatePicker
                    label="Data de nascimento *"
                    value={dataNascimento}
                    onChange={handleDataNascimentoChange}
                    views={['day', 'month', 'year']}
                    slotProps={{
                      textField: {
                        fullWidth: true,  // Faz o TextField ocupar 100% da largura
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              {/* Tipo Cliente */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Tipo Cliente"
                  name="Tipo_Cliente"
                  value={cliente.Tipo_Cliente}
                  onChange={handleInputChange}
                  select
                  fullWidth
                  required
                >
                  {tiposCliente.map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Sexo */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Sexo"
                  name="Sexo"
                  value={cliente.Sexo}
                  onChange={handleInputChange}
                  select
                  fullWidth
                >
                  {sexos.map((sexo) => (
                    <MenuItem key={sexo} value={sexo}>
                      {sexo}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Estado Civil */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Estado Civil"
                  name="Estado_Civil"
                  value={cliente.Estado_Civil}
                  onChange={handleInputChange}
                  select
                  fullWidth
                >
                  {estadosCivis.map((estado) => (
                    <MenuItem key={estado} value={estado}>
                      {estado}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Status na Empresa */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Status na Empresa"
                  name="StatusLoja"
                  value={cliente.StatusLoja}
                  onChange={handleInputChange}
                  select
                  fullWidth
                >
                  {clienteStatusLoja.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Status na AutoRastrear */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Status na AutoRastrear"
                  name="StatusAutoRastrear"
                  value={cliente.StatusAutoRastrear}
                  onChange={handleInputChange}
                  select
                  fullWidth
                >
                  {clienteStatusAutoRastrear.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Paper>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000} // O tempo que o Snackbar ficará visível
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseSnackbar} variant="filled" severity={snackbarSeverity}>
              {mensagemErro}
            </Alert>
          </Snackbar>


          {/* Diálogo de Confirmação de Exclusão */}
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