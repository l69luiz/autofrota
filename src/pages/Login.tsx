//src/pages/Login.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { Environment } from "../shared/environments";

const urlLogin = Environment.URL_LOGIN || '';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Se o usuário está autenticado, redireciona para a página inicial
    if (isAuthenticated) {
    
     navigate('/pagina-inicial');
     
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

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

      // Armazena o token no sessionStorage e atualiza o estado de autenticação
      sessionStorage.setItem('token', token);
      setIsAuthenticated(true);  // Isso aciona o useEffect e redireciona

    } catch (error) {
      setError('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ backgroundColor: '#f5f5f5', borderRadius: 2, padding: 3, height: '100vh' }}>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
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






// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { TextField, Button, Typography, Container, Box } from '@mui/material';
// import { Environment } from "../shared/environments";

// // Define um valor padrão vazio caso URL_LOGIN seja undefined
// const urlLogin = Environment.URL_LOGIN || '';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [senha, setSenha] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Verifica se a URL de login está configurada corretamente
//     if (!urlLogin) {
//       setError('URL de login não configurada.');
//       return;
//     }

//     try {
//       const response = await axios.post(urlLogin,
//         {
//           Email: email,
//           Senha: senha,
//         }
//       );

//       const { token } = response.data;

//       // Armazenar o token no sessionStorage
//       sessionStorage.setItem('token', token);

//       // Redirecionar para a página inicial após login
//       console.log('Navegando para página inicial');
//       navigate('/pagina-inicial');

//     } catch (error) {
//       setError('Erro ao fazer login. Verifique suas credenciais.');
//     }
//   };

//   return (
//     <Container component="main" maxWidth="xs" sx={{ backgroundColor: '#f5f5f5', borderRadius: 2, padding: 3, height: '100vh' }}>
//       <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
//         <Typography variant="h5" gutterBottom sx={{ color: '#1976d2' }}>Login</Typography>
//         {error && <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>{error}</Typography>}
//         <form onSubmit={handleLogin} noValidate>
//           <TextField
//             variant="outlined"
//             margin="normal"
//             required
//             fullWidth
//             id="email"
//             label="Email"
//             name="email"
//             autoComplete="email"
//             autoFocus
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             sx={{ marginBottom: 2 }}
//           />
//           <TextField
//             variant="outlined"
//             margin="normal"
//             required
//             fullWidth
//             name="senha"
//             label="Senha"
//             type="password"
//             id="senha"
//             autoComplete="current-password"
//             value={senha}
//             onChange={(e) => setSenha(e.target.value)}
//             sx={{ marginBottom: 3 }}
//           />
//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             sx={{
//               backgroundColor: '#1976d2',
//               '&:hover': {
//                 backgroundColor: '#1565c0',
//               },
//             }}
//           >
//             Entrar
//           </Button>
//         </form>
//       </Box>
//     </Container>
//   );
// };

// export default Login;






// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { TextField, Button, Typography, Container, Box } from '@mui/material';
// import { Environment } from "../shared/environments";

// // Define um valor padrão vazio caso URL_LOGIN seja undefined
// const urlLogin = Environment.URL_LOGIN || '';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [senha, setSenha] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Verifica se a URL de login está configurada corretamente
//     if (!urlLogin) {
//       setError('URL de login não configurada.');
//       return;
//     }

//     try {
//       const response = await axios.post(urlLogin,
//         {
//           Email: email,
//           Senha: senha,
//         }
//       );

//       const { token } = response.data;

//       // Armazenar o token no localStorage
//       sessionStorage.setItem('token', token);

//       // Simula uma pausa de 2 segundos antes de redirecionar
//       setTimeout(() => {
//       // Redirecionar para a página inicial
//       //console.log(token); // aqui está retornando o token corretamente.
//       console.log('Navegando para página inicial');
//       navigate('/pagina-inicial');
      
//       //navigate('/pagina-inicial');
//       }, 500); // Pausa de 2 segundos (2000 milissegundos)
      
//       //console.log('Passou da navegação');
      
//     } catch (error) {
//       setError('Erro ao fazer login. Verifique suas credenciais.');
//     }
//   };

//   return (
//     <Container component="main" maxWidth="xs" sx={{ backgroundColor: '#f5f5f5', borderRadius: 2, padding: 3, height: '100vh' }}>
//       <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
//         <Typography variant="h5" gutterBottom sx={{ color: '#1976d2' }}>Login</Typography>
//         {error && <Typography color="error" variant="body2" sx={{ marginBottom: 2 }}>{error}</Typography>}
//         <form onSubmit={handleLogin} noValidate>
//           <TextField
//             variant="outlined"
//             margin="normal"
//             required
//             fullWidth
//             id="email"
//             label="Email"
//             name="email"
//             autoComplete="email"
//             autoFocus
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             sx={{ marginBottom: 2 }}
//           />
//           <TextField
//             variant="outlined"
//             margin="normal"
//             required
//             fullWidth
//             name="senha"
//             label="Senha"
//             type="password"
//             id="senha"
//             autoComplete="current-password"
//             value={senha}
//             onChange={(e) => setSenha(e.target.value)}
//             sx={{ marginBottom: 3 }}
//           />
//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             sx={{
//               backgroundColor: '#1976d2',
//               '&:hover': {
//                 backgroundColor: '#1565c0',
//               },
//             }}
//           >
//             Entrar
//           </Button>
//         </form>
//       </Box>
//     </Container>
//   );
// };

// export default Login;
