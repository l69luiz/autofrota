//src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { Environment } from "../shared/environments";


console.log(Environment.URL_LOGIN);

// Define um valor padrão vazio caso URL_LOGIN seja undefined
const urlLogin = Environment.URL_LOGIN || '';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verifica se a URL de login está configurada corretamente
    if (!urlLogin) {
      setError('URL de login não configurada.');
      return;
    }

    try {
      const response = await axios.post(urlLogin, {
        Email: email,
        Senha: senha,
      });

      const { token } = response.data;

      // Armazenar o token no localStorage
      sessionStorage.setItem('token', token);

      // Redirecionar para a página inicial
      navigate('/pagina-inicial');
    } catch (error) {
      setError('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ backgroundColor: '#f5f5f5', borderRadius: 2, padding: 3 }}>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Typography variant="h5" gutterBottom sx={{ color: '#1976d2' }}>Login</Typography>
        {error && <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>{error}</Typography>}
        <form onSubmit={handleLogin} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="senha"
            label="Senha"
            type="password"
            id="senha"
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            sx={{ marginBottom: 3 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
            }}
          >
            Entrar
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
