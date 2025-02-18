import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Paper, TextField, Typography, MenuItem } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Api } from '../../shared/services/api/axios-config'; // Assumindo que já existe um serviço API configurado

export const EditarCliente: React.FC = () => {
  const { idCliente } = useParams(); // Obtenha o ID do cliente da URL
  const navigate = useNavigate();

  const [cliente, setCliente] = useState({
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
    if (idCliente) {
      Api.get(`/clientes/${idCliente}`)
        .then((response) => {
          setCliente(response.data);
        })
        .catch((error) => {
          console.error('Erro ao buscar cliente:', error);
        });
    }
  }, [idCliente]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCliente((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    Api.put(`/clientes/${idCliente}`, cliente)
      .then(() => {
        alert('Cliente atualizado com sucesso!');
        navigate('/clientes'); // Redireciona após salvar
      })
      .catch((error) => {
        console.error('Erro ao atualizar cliente:', error);
        alert('Erro ao atualizar cliente!');
      });
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
        <Grid item xs={12} md={6}>
          <TextField
            label="Nome"
            name="Nome"
            value={cliente.Nome}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="CPF/CNPJ"
            name="CPF_CNPJ"
            value={cliente.CPF_CNPJ}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Rua"
            name="Rua"
            value={cliente.Rua}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Número"
            name="Numero"
            value={cliente.Numero}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Bairro"
            name="Bairro"
            value={cliente.Bairro}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Cidade"
            name="Cidade"
            value={cliente.Cidade}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Celular"
            name="Celular"
            value={cliente.Celular}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Celular Secundário"
            name="Celular2"
            value={cliente.Celular2}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="RG"
            name="RG"
            value={cliente.RG}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
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
        <Grid item xs={12} md={6}>
          <TextField
            label="Email"
            name="Email"
            value={cliente.Email}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} md={6}>
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
        <Grid item xs={12} md={6}>
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
};
