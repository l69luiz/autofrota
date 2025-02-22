//src/pages/clientes/DetalheCliente.tsx

import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Importação correta da biblioteca
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
  Lojas_idLoja: number;
}

export const DetalheCliente: React.FC = () => {
  const { idCliente } = useParams<'idCliente'>();
  const navigate = useNavigate();
  const idClienteApagar = Number(idCliente);

  // Recupera o token do sessionStorage
  const token = sessionStorage.getItem('token');

  // Função para obter o idLoja do token
  const obterIdLoja = (): number => {
    if (token) {
      console.log(token);
      try {
        //console.log(token);
        const decoded: any = jwtDecode(token); // Decodifica o token
        //console.log(token);
        return decoded.idLojaToken || 0; // Retorna o idLojaToken ou 0 como fallback
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return 0;
      }
    }
    return 0;
  };

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
    Lojas_idLoja: obterIdLoja(), // Passa o idLojaToken para Lojas_idLoja
  });

  const tiposCliente = ['Pessoa Física', 'Pessoa Jurídica'];
  const sexos = ['Masculino', 'Feminino', 'Outro'];
  const estadosCivis = ['Solteiro', 'Casado', 'Divorciado', 'Viúvo'];
  const clienteGrupo = ['Comum', 'Prioritário', 'Funcionário', 'VIP', 'Devedor'];
  const clienteStatusAutoRastrear = ['Ativo', 'Suspenso', 'Inativo', 'Retirado', 'Devedor'];
  const clienteStatusLoja = ['Ativo', 'Suspenso', 'Inativo', 'Retirado', 'Devedor'];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [clienteIdParaDeletar, setClienteIdParaDeletar] = useState<number | null>(null);

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
            setCliente({
              ...cliente,
              ...response,
              Lojas_idLoja: obterIdLoja(), // Atualiza o idLojaToken
            });
          } else {

            if (!isNaN(idClienteNumber)) {
              const response = await ClientesService.getById(idClienteNumber);
              setCliente({
                ...cliente,
                ...response,
                Lojas_idLoja: obterIdLoja(), // Atualiza o idLojaToken
              });
            }


            console.error('ID de cliente inválido:', idCliente);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar os dados do cliente:', error);
      }
    };

    fetchCliente();
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

  const handleCriarCliente = async()=>{
    try {
      if (idCliente === 'novo') {
        console.log(cliente);
        const error = await ClientesService.create(cliente);
        if (error instanceof Error) {
          console.error('Erro ao criar cliente:', error);
          alert('Erro ao criar cliente!');
        } else {
          alert('Cliente criado com sucesso!');
        }
      }
    }catch{

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
              mostrarBotaoSalvar
              mostrarBotaoApagar={idCliente !== 'novo'}
              aoClicarEmNovo={() => navigate('/clientes/detalhe/novo')}
              aoClicarEmSalvarEFechar={handleSaveEFechar}
              aoClicarEmSalvar={handleSave}
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



// import React, { useState, useEffect } from 'react';
// //import * as jwt_decode from 'jwt-decode';
// //import jwt_decode from 'jwt-decode';
// import {
//   Box,
//   Button,
//   Paper,
//   TextField,
//   Typography,
//   MenuItem,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   Grid,
// } from '@mui/material';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ClientesService, IListagemCliente } from '../../shared/services/api/clientes/ClientesService';
// import { LayoutBaseDePagina } from '../../shared/layouts/LayoutBaseDePaginas';
// import { FerramentasDeDetalhe, MenuLateral } from '../../shared/components';
// import { number } from 'prop-types';

// interface IDetalheCliente {
//   idCliente: number;
//   Nome: string;
//   CPF_CNPJ: string;
//   Rua: string;
//   Numero: string;
//   Bairro: string;
//   Cidade: string;
//   Celular: string;
//   Celular2: string;
//   RG: string;
//   Tipo_Cliente: string;
//   Email: string;
//   Grupo: string;
//   StatusAutoRastrear: string;
//   StatusLoja: string;
//   Data_Nascimento: string;
//   Sexo: string;
//   Estado_Civil: string;
//   Lojas_idLoja: number;
// }

// export const DetalheCliente: React.FC = () => {
  
//   const jwt_decode = require('jwt-decode');
//   const token = sessionStorage.getItem("token");
//   const { idCliente } = useParams<'idCliente'>();
//   const navigate = useNavigate();
//   const idClienteApagar = Number(idCliente);

//   const idLoja = () => {

//     if (token) {
//       try {
//         // Decodificando o token
//         const decoded: any = jwt_decode(token);
    
//         // Acessando o idLoja no payload
//         const idLoja = decoded.idLoja;
    
//         console.log('idLoja:', idLoja);  // Imprime o idLoja
    
//         // Você pode agora utilizar o idLoja conforme necessário
//       } catch (error) {
//         console.error('Erro ao decodificar o token:', error);
//       }
//     } else {
//       console.log('Token não encontrado.');
//     }

//   };
//   console.log("idLoja: ", idLoja());
  
  

//   const [cliente, setCliente] = useState<IDetalheCliente>({

    

//     idCliente: Number(idCliente),
//     Nome: '',
//     CPF_CNPJ: '',
//     Rua: '',
//     Numero: '',
//     Bairro: '',
//     Cidade: '',
//     Celular: '',
//     Celular2: '',
//     RG: '',
//     Tipo_Cliente: '',
//     Email: '',
//     Grupo: '',
//     StatusAutoRastrear: '',
//     StatusLoja: '',
//     Data_Nascimento: '',
//     Sexo: '',
//     Estado_Civil: '',
//     Lojas_idLoja: Number(idLoja())
//   });

//   const tiposCliente = ['Pessoa Física', 'Pessoa Jurídica'];
//   const sexos = ['Masculino', 'Feminino', 'Outro'];
//   const estadosCivis = ['Solteiro', 'Casado', 'Divorciado', 'Viúvo'];
//   const clienteGrupo = ['Comum', 'Prioritário', 'Funcionário', 'VIP', 'Devedor'];
//   const clienteStatusAutoRastrear = ['Ativo', 'Suspenso', 'Inativo', 'Retirado', 'Devedor'];
//   const clienteStatusLoja = ['Ativo', 'Suspenso', 'Inativo', 'Retirado', 'Devedor'];

//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [clienteIdParaDeletar, setClienteIdParaDeletar] = useState<number | null>(null);
  
  


//   const handleDeleteDialogOpen = (id: number) => {
//     setClienteIdParaDeletar(id);
//     setDialogOpen(true);
//   };

//   const handleDeleteDialogClose = () => {
//     setDialogOpen(false);
//     setClienteIdParaDeletar(null);
//   };

//   const handleDelete = async () => {
//     if (clienteIdParaDeletar) {
//       try {
//         const result = await ClientesService.deleteById(clienteIdParaDeletar);
//         if (result instanceof Error) {
//           alert(result.message);
//         } else {
//           navigate('/clientes');
//         }
//       } catch (error) {
//         console.error('Erro ao deletar cliente:', error);
//       } finally {
//         setDialogOpen(false);
//         setClienteIdParaDeletar(null);
//       }
//     }
//   };

//   useEffect(() => {
//     const fetchCliente = async () => {
//       try {
//         if (idCliente) {
//           const idClienteNumber = Number(idCliente);
//           if (!isNaN(idClienteNumber)) {
//             const response = await ClientesService.getById(idClienteNumber);
//             setCliente({
//               ...cliente,
//               ...response,
//             });
//           } else {
//             console.error('ID de cliente inválido:', idCliente);
//           }
//         }
//       } catch (error) {
//         console.error('Erro ao buscar os dados do cliente:', error);
//       }
//     };

//     fetchCliente();
//   }, [idCliente]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setCliente((prevState) => ({
//       ...prevState,
//       [name]: value,
//     }));
//   };

//   const handleSave = async () => {
//     try {
//       if (idCliente && idCliente !== 'novo') {
//         const idClienteNumber = Number(idCliente);
//         if (!isNaN(idClienteNumber)) {
//           const error = await ClientesService.updateById(idClienteNumber, cliente);
//           if (error instanceof Error) {
//             //console.error('Erro ao atualizar cliente:', error.message);
//             alert('Erro ao atualizar cliente!');
//           } else {

//             alert('Cliente atualizado com sucesso!');
//           }
//         }
//       }else{
//         if (idCliente && idCliente === 'novo') {
          
        

//             const error = await ClientesService.create(cliente);
//             if (error instanceof Error) {
//               console.log(cliente);
//               console.log('Erro ao criar cliente:', error);
//               alert('Erro ao criar cliente!!!');
//             } else {
  
//               alert('Cliente criado com sucesso!');
//             }
//          }

//       }

//     } catch (error) {
//       console.error('Erro ao salvar dados do cliente:', error);
//       alert('Erro ao salvar dados do cliente!');
//     }
//   };

//   const handleSaveEFechar = async () => {
//     try {
//       if (idCliente) {
//         const idClienteNumber = Number(idCliente);
//         if (!isNaN(idClienteNumber)) {
//           const error = await ClientesService.updateById(idClienteNumber, cliente);
//           if (error instanceof Error) {
//             console.error('Erro ao atualizar cliente:', error.message);
//             alert('Erro ao atualizar cliente!');
//           } else {
//             alert('Cliente atualizado com sucesso!');
//             navigate('/clientes');
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Erro ao salvar cliente:', error);
//       alert('Erro ao salvar cliente!');
//     }
//   };

//   const handleCancel = () => {
//     navigate('/clientes');
//   };

//   return (
//     <MenuLateral>
//       <div style={{ flex: 1 }}>
//         <LayoutBaseDePagina
//           titulo="Detalhe de cliente"
//           barraDeFerramentas={
//             <FerramentasDeDetalhe
//               mostrarBotaoNovo={false}
//               mostrarBotaoSalvarEFechar={idCliente !== 'novo'}
//               mostrarBotaoSalvar
//               mostrarBotaoApagar={idCliente !== 'novo'}
//               aoClicarEmNovo={() => navigate('/clientes/detalhe/novo')}
//               aoClicarEmSalvarEFechar={handleSaveEFechar}
//               aoClicarEmSalvar={handleSave}
//               aoClicarEmApagar={() => handleDeleteDialogOpen(idClienteApagar)}
//               aoClicarEmVoltar={handleCancel}
//             />
//           }
//         >
//           <Paper elevation={3} sx={{ padding: 4, marginBottom: 4 }}>
//             <Typography variant="h6" gutterBottom>
//               Insira os dados do novo cliente:
//             </Typography>
//             <Grid container spacing={2}>
//               {/* Nome */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   label="Nome"
//                   name="Nome"
//                   value={cliente.Nome}
//                   onChange={handleInputChange}
//                   fullWidth
//                   required
//                 />
//               </Grid>

//               {/* CPF/CNPJ */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   label="CPF/CNPJ"
//                   name="CPF_CNPJ"
//                   value={cliente.CPF_CNPJ}
//                   onChange={handleInputChange}
//                   fullWidth
//                   required
//                 />
//               </Grid>

//               {/* Rua */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   label="Rua"
//                   name="Rua"
//                   value={cliente.Rua}
//                   onChange={handleInputChange}
//                   fullWidth
//                 />
//               </Grid>

//               {/* Número */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   label="Número"
//                   name="Numero"
//                   value={cliente.Numero}
//                   onChange={handleInputChange}
//                   fullWidth
//                 />
//               </Grid>

//               {/* Bairro */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   label="Bairro"
//                   name="Bairro"
//                   value={cliente.Bairro}
//                   onChange={handleInputChange}
//                   fullWidth
//                 />
//               </Grid>

//               {/* Cidade */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   label="Cidade"
//                   name="Cidade"
//                   value={cliente.Cidade}
//                   onChange={handleInputChange}
//                   fullWidth
//                 />
//               </Grid>

//               {/* Celular */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   label="Celular"
//                   name="Celular"
//                   value={cliente.Celular}
//                   onChange={handleInputChange}
//                   fullWidth
//                 />
//               </Grid>

//               {/* Celular Secundário */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   label="Celular Secundário"
//                   name="Celular2"
//                   value={cliente.Celular2}
//                   onChange={handleInputChange}
//                   fullWidth
//                 />
//               </Grid>

//               {/* RG */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   label="RG"
//                   name="RG"
//                   value={cliente.RG}
//                   onChange={handleInputChange}
//                   fullWidth
//                 />
//               </Grid>

//               {/* Email */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   label="Email"
//                   name="Email"
//                   value={cliente.Email}
//                   onChange={handleInputChange}
//                   fullWidth
//                   required
//                 />
//               </Grid>

//               {/* Tipo Cliente */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   label="Tipo Cliente"
//                   name="Tipo_Cliente"
//                   value={cliente.Tipo_Cliente}
//                   onChange={handleInputChange}
//                   select
//                   fullWidth
//                 >
//                   {tiposCliente.map((tipo) => (
//                     <MenuItem key={tipo} value={tipo}>
//                       {tipo}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>

//               {/* Sexo */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   label="Sexo"
//                   name="Sexo"
//                   value={cliente.Sexo}
//                   onChange={handleInputChange}
//                   select
//                   fullWidth
//                 >
//                   {sexos.map((sexo) => (
//                     <MenuItem key={sexo} value={sexo}>
//                       {sexo}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>

//               {/* Estado Civil */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   label="Estado Civil"
//                   name="Estado_Civil"
//                   value={cliente.Estado_Civil}
//                   onChange={handleInputChange}
//                   select
//                   fullWidth
//                 >
//                   {estadosCivis.map((estado) => (
//                     <MenuItem key={estado} value={estado}>
//                       {estado}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>

//               {/* Status na Empresa */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   label="Status na Empresa"
//                   name="StatusLoja"
//                   value={cliente.StatusLoja}
//                   onChange={handleInputChange}
//                   select
//                   fullWidth
//                 >
//                   {clienteStatusLoja.map((status) => (
//                     <MenuItem key={status} value={status}>
//                       {status}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>

//               {/* Status na AutoRastrear */}
//               <Grid item xs={12} sm={6} md={4}>
//                 <TextField
//                   label="Status na AutoRastrear"
//                   name="StatusAutoRastrear"
//                   value={cliente.StatusAutoRastrear}
//                   onChange={handleInputChange}
//                   select
//                   fullWidth
//                 >
//                   {clienteStatusAutoRastrear.map((status) => (
//                     <MenuItem key={status} value={status}>
//                       {status}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>
//             </Grid>
//           </Paper>

//           {/* Diálogo de Confirmação de Exclusão */}
//           <Dialog open={dialogOpen} onClose={handleDeleteDialogClose}>
//             <DialogTitle>Confirmar Exclusão</DialogTitle>
//             <DialogContent>
//               <DialogContentText>
//                 Você tem certeza de que deseja excluir este cliente? Esta ação não pode ser desfeita.
//               </DialogContentText>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={handleDeleteDialogClose} color="primary">
//                 Cancelar
//               </Button>
//               <Button onClick={handleDelete} color="primary">
//                 Confirmar
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </LayoutBaseDePagina>
//       </div>
//     </MenuLateral>
//   );
// };