//src/pages/clientes/editarClientes.tsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Paper, TextField, Typography, MenuItem } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ClientesService } from '../../shared/services/api/clientes/ClientesService';
//import { Grid2 } from '@mui/material'; // Importe o Grid2 no lugar do Grid
import Grid from '@mui/material/Grid2';
//import Grid2 from '@mui/material'; // Importa o Grid2 corretamente


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
  Lojas_idLoja: string;
}

export const EditarCliente: React.FC = () => {
  const { idCliente } = useParams(); // Obtenha o ID do cliente da URL
  const navigate = useNavigate();

  // Definindo o estado com a estrutura correta
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
    Lojas_idLoja: '',
  });

  const tiposCliente = ["Pessoa Física", "Pessoa Jurídica"];
  const sexos = ["Masculino", "Feminino", "Outro"];
  const estadosCivis = ["Solteiro", "Casado", "Divorciado", "Viúvo"];

  // Busca os dados do cliente pelo ID
  useEffect(() => {
    const fetchCliente = async () => {
      try {
        if (idCliente) {
          const idClienteNumber = Number(idCliente); // Converte para número
          if (!isNaN(idClienteNumber)) {
            const response = await ClientesService.getById(idClienteNumber); // Chama o serviço para buscar o cliente
            // Atualiza o estado com os dados do cliente, se a resposta tiver a estrutura adequada
            setCliente({
              ...cliente,
              ...response, // Adiciona os dados recebidos no estado
            });
          } else {
            console.error('ID de cliente inválido:', idCliente);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar os dados do cliente:', error);
      }
    };

    fetchCliente(); // Executa a função
  }, [idCliente]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCliente((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      if (idCliente) {
        const idClienteNumber = Number(idCliente);
        if (!isNaN(idClienteNumber)) {
          const error = await ClientesService.updateById(idClienteNumber, cliente); // Chama a função updateById
          if (error instanceof Error) {
            console.error('Erro ao atualizar cliente:', error.message);
            alert('Erro ao atualizar cliente!');
          } else {
            alert('Cliente atualizado com sucesso!');
            navigate('/clientes'); // Redireciona após salvar
          }
        }
      }
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      alert('Erro ao salvar cliente!');
    }
  };

  const handleCancel = () => {
    navigate('/clientes'); // Volta para a listagem de clientes
  };




  return (
    <Paper elevation={3} sx={{ padding: 4 }}>
      <Typography variant="h6" gutterBottom>
        Editar Cliente
      </Typography>
      <Grid container spacing={2}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 12, sm: 2, md: 4 }}>
          <TextField
            label="Nome"
            name="Nome"
            value={cliente.Nome}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 12, sm: 2, md: 4 }}>
          <TextField
            label="CPF/CNPJ"
            name="CPF_CNPJ"
            value={cliente.CPF_CNPJ}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 12, sm: 2, md: 4 }}>
          <TextField
            label="Rua"
            name="Rua"
            value={cliente.Rua}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 12, sm: 2, md: 4 }}>
          <TextField
            label="Número"
            name="Numero"
            value={cliente.Numero}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 12, sm: 2, md: 4 }}>
          <TextField
            label="Bairro"
            name="Bairro"
            value={cliente.Bairro}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 12, sm: 2, md: 4 }}>
          <TextField
            label="Cidade"
            name="Cidade"
            value={cliente.Cidade}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 12, sm: 2, md: 4 }}>
          <TextField
            label="Celular"
            name="Celular"
            value={cliente.Celular}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 12, sm: 2, md: 4 }}>
          <TextField
            label="Celular Secundário"
            name="Celular2"
            value={cliente.Celular2}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 12, sm: 2, md: 4 }}>
          <TextField
            label="RG"
            name="RG"
            value={cliente.RG}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 12, sm: 2, md: 4 }}>
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
        <Grid container rowSpacing={1} columnSpacing={{ xs: 12, sm: 2, md: 4 }}>
          <TextField
            label="Email"
            name="Email"
            value={cliente.Email}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 12, sm: 2, md: 4 }}>
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
        <Grid container rowSpacing={1} columnSpacing={{ xs: 12, sm: 2, md: 4 }}>
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
      </Grid>
  
      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button onClick={handleCancel} variant="outlined" sx={{ mr: 2 }}>
          Fechar
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Salvar
        </Button>
      </Box>
    </Paper>
  );
}  