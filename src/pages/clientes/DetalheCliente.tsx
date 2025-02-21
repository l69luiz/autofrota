//src/pages/clientes/editarClientes.tsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Paper, TextField, Typography, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ClientesService, IListagemCliente } from '../../shared/services/api/clientes/ClientesService';
import Grid from '@mui/material/Grid2';
import { LayoutBaseDePagina } from '../../shared/layouts/LayoutBaseDePaginas';
import { FerramentasDaListagem, FerramentasDeDetalhe, MenuLateral } from '../../shared/components';

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

export const DetalheCliente: React.FC = () => {
  const { idCliente } = useParams<'idCliente'>(); // Obtenha o ID do cliente da URL
  const navigate = useNavigate();
  const idClienteApagar = Number(idCliente);
  
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
  const [dialogOpen, setDialogOpen] = useState(false); // Controla o diálogo de confirmação de exclusão
  const [clienteIdParaDeletar, setClienteIdParaDeletar] = useState<number | null>(null);
  const [rows, setRows] = useState<IListagemCliente[]>([]);

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
            // Atualize a lista de clientes após a exclusão
            navigate('/clientes');
            setRows((prevRows) => prevRows.filter((cliente) => cliente.idCliente !== clienteIdParaDeletar));
          }
        } catch (error) {
          console.error("Erro ao deletar cliente:", error);
        } finally {
          setDialogOpen(false);
          setClienteIdParaDeletar(null);
        }
      }
    };


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
           // navigate('/clientes'); // Redireciona após salvar
          }
        }
      }
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      alert('Erro ao salvar cliente!');
    }
  };

  const handleSaveEFechar = async () => {
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
<MenuLateral>
      {/* O Dashboard será passado como children para o MenuLateral */}
      <div style={{ flex: 1}}>

  <LayoutBaseDePagina
  titulo="Detalhe de cliente"
        barraDeFerramentas={
          <FerramentasDeDetalhe
            mostrarBotaoNovo={false}
            mostrarBotaoSalvarEFechar={idCliente!=='novo'}
            mostrarBotaoSalvar
            mostrarBotaoApagar={idCliente!=='novo'}
            aoClicarEmNovo={()=>navigate('/clientes/detalhe/novo')}
            aoClicarEmSalvarEFechar={handleSaveEFechar}
            aoClicarEmSalvar={handleSave}
            aoClicarEmApagar={() => handleDeleteDialogOpen(idClienteApagar)}
            aoClicarEmVoltar={handleCancel}



            
          />
        }
  
  >

    <Paper elevation={3} sx={{ padding: 4 }}>
      <Typography variant="h6" gutterBottom>
        Insira os dados do novo cliente:
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
    </Paper>


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
}  