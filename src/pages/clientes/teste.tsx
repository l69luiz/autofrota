//src/pages/clientes/DetalheCliente.tsx

import React, { useState, useEffect } from 'react';
import {
  Box,
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
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ClientesService, IListagemCliente } from '../../shared/services/api/clientes/ClientesService';
import { LayoutBaseDePagina } from '../../shared/layouts/LayoutBaseDePaginas';
import { FerramentasDeDetalhe, MenuLateral } from '../../shared/components';
import 'dayjs/locale/pt-br';
import { ptBR } from '@mui/material/locale';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // Certifique-se de importar o DatePicker de maneira correta
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface IDetalheCliente {
  idCliente: number;
  Nome: string;
  CPF_CNPJ: string;
  Rua: string;
  Numero: string;
  Bairro: string;
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
    //Lojas_idLoja: 0, // Passa o idLojaToken para Lojas_idLoja
  });

  const tiposCliente = ['Pessoa Física', 'Pessoa Jurídica'];
  const sexos = ['Masculino', 'Feminino', 'Outro'];
  const estadosCivis = ['Solteiro', 'Casado', 'Divorciado', 'Viúvo'];
  const clienteGrupo = ['Comum', 'Prioritário', 'Funcionário', 'VIP', 'Devedor'];
  const clienteStatusAutoRastrear = ['Ativo', 'Suspenso', 'Inativo', 'Retirado', 'Devedor'];
  const clienteStatusLoja = ['Ativo', 'Suspenso', 'Inativo', 'Retirado', 'Devedor'];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [clienteIdParaDeletar, setClienteIdParaDeletar] = useState<number | null>(null);
  const [dataNascimento, setDataNascimento] = React.useState<Dayjs | null>(
    cliente.Data_Nascimento ? dayjs(cliente.Data_Nascimento) : null
  );

  //const [dataNascimento, setDataNascimento] = React.useState(cliente.Data_Nascimento || null);
    
  const handleDataNascimentoChange = (date: Dayjs | null) => {
    setDataNascimento(date); // Atualiza o estado local com a nova data
  
    // Atualiza o campo Data_Nascimento no objeto cliente
    if (date) {
      const formattedDate = date.format('YYYY-MM-DD'); // Formata a data para 'YYYY-MM-DD'
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

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        if (idCliente && idCliente !== 'novo') {
          const idClienteNumber = Number(idCliente);
          if (!isNaN(idClienteNumber)) {
            const response = await ClientesService.getById(idClienteNumber);
  
            // Verifica se a resposta é um erro
            if (response instanceof Error) {
              console.error('Erro ao buscar cliente:', response.message);
              alert('Erro ao buscar cliente: ' + response.message);
            } else {
              // Atualiza o estado do cliente com os dados recebidos
              setCliente({
                ...cliente,
                ...response,
              });
  
              // Inicializa a data de nascimento se existir
              if (response.Data_Nascimento) {
                setDataNascimento(dayjs(response.Data_Nascimento)); // Usar dayjs aqui
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



  const handleInputChange = (eventOrName: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string, value?: any) => {
    if (typeof eventOrName === 'string') {
      // Se for uma string, é o nome do campo e o valor foi passado diretamente
      const name = eventOrName;
      setCliente((prevCliente) => ({
        ...prevCliente,
        [name]: value,
      }));
    } else {
      // Caso contrário, é um evento
      const { name, value } = eventOrName.target;
      setCliente((prevCliente) => ({
        ...prevCliente,
        [name]: value,
      }));
    }
  };
  


  const handleSave = async () => {
    try {
      if (idCliente && idCliente !== 'novo') {
        const idClienteNumber = Number(idCliente);
        if (!isNaN(idClienteNumber)) {
          const error = await ClientesService.updateById(idClienteNumber, cliente);
          if (error instanceof Error) {
            alert('Erro ao atualizar cliente!');
          } else {
            alert('Cliente atualizado com sucesso!');
          }
        }
      }
    } catch (error) {
      console.error('Erro ao salvar dados do cliente:', error);
      alert('Erro ao salvar dados do cliente!');
    }
  };

  const handleCriarCliente = async () => {
    try {

      if (idCliente === 'novo') {
        // Desestruturando o objeto cliente para remover o idCliente
        const { idCliente, ...clienteSemId } = cliente;
        console.log("Sem ID: ", clienteSemId);
        const error = await ClientesService.create(clienteSemId);
        console.log("Criando cliente eroor: ", error);
        if (error instanceof Error) {
          console.error('Erro ao criar cliente:', error);
          alert('Erro ao criar cliente!');
        } else {
          alert('Cliente criado com sucesso!');
        }
      }
    } catch {

    }

  }

  const handleSaveEFechar = async () => {
    try {
      if (idCliente) {
        const idClienteNumber = Number(idCliente);
        if (!isNaN(idClienteNumber)) {
          const error = await ClientesService.updateById(idClienteNumber, cliente);
          if (error instanceof Error) {
            console.error('Erro ao atualizar cliente:', error.message);
            alert('Erro ao atualizar cliente!');
          } else {
            alert('Cliente atualizado com sucesso!');
            navigate('/clientes');
          }
        }
      }
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      alert('Erro ao salvar cliente!');
    }
  };

  const handleCancel = () => {
    navigate('/clientes');
  };

  return (

        <MenuLateral>
          <div style={{ flex: 1 }}>
            <LayoutBaseDePagina
              titulo="Detalhe de cliente"
              barraDeFerramentas={
                <FerramentasDeDetalhe
                  mostrarBotaoNovo={false}
                  mostrarBotaoSalvarEFechar={idCliente !== 'novo'}
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
                    <TextField
                      label="CPF/CNPJ"
                      name="CPF_CNPJ"
                      value={cliente.CPF_CNPJ}
                      onChange={handleInputChange}
                      fullWidth
                      required
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
                      label="Cidade"
                      name="Cidade"
                      value={cliente.Cidade}
                      onChange={handleInputChange}
                      fullWidth
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
                      value={cliente.Email}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>
    
                  {/* Data de Nascimento */}
                  <Grid item xs={12} sm={6} md={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'pt-br'}>
                <DatePicker
                  label="Data de nascimento"
                  value={dataNascimento}
                   onChange={handleDataNascimentoChange}
                    views={['day', 'month', 'year']}
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