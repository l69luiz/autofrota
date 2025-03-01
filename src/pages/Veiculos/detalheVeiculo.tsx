// src/pages/veiculos/DetalheVeiculo.tsx
import React, { useState, useEffect } from 'react';
import {
  Button, Paper, TextField, Typography, MenuItem, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, Grid, Snackbar, Alert,
  CircularProgress, LinearProgress,
  FormControlLabel,
  Switch
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { VeiculosService } from '../../shared/services/api/veiculos/VeiculosService'; // Serviço de Veículos
import { LayoutBaseDePagina } from '../../shared/layouts/LayoutBaseDePaginas';
import { FerramentasDeDetalhe, MenuLateral } from '../../shared/components';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { EstoquesService, IListagemEstoque } from '../../shared/services/api/estoques/estoquesService';

interface IDetalheVeiculo {
  idVeiculo: number | null;
  Placa_Veiculo: string;
  Chassi: string;
  Renavan: string;
  Cor: string;
  Nr_Motor: string;
  Marca: string;
  Modelo: string;
  StatusVeiculo: string;
  Ano_fab: number | null;
  Ano_mod: number | null;
  Nr_portas: number | null;
  CPF_CNPJ_Prop: string;
  Pot_Motor: string;
  CaminhoImgVeiculo: string;
  Km_inicial: number | null;
  Ar_cond: boolean | null;
  Vidro_elet: boolean | null;
  Multimidia: boolean | null;
  Sensor_Re: boolean | null;
  Vr_PadraoAluguel: number | null;
  Trava_Elet: boolean | null;
  Alarme: boolean | null;
  Valor_Entrada: number | null;
  Valor_Fipe_Entrada: number | null;
  Estoque_idEstoque: number | null;
}


export const DetalheVeiculo: React.FC = () => {
  const { idVeiculo } = useParams<'idVeiculo'>();
  const navigate = useNavigate();
  const idVeiculoApagar = Number(idVeiculo);
  const [veiculo, setVeiculo] = useState<IDetalheVeiculo>({
    idVeiculo: Number(idVeiculo),
    Placa_Veiculo: '',
    Chassi: '',
    Renavan: '',
    Cor: '',
    Nr_Motor: '',
    Marca: '',
    Modelo: '',
    StatusVeiculo: '',
    Ano_fab: null,
    Ano_mod: null,
    Nr_portas: null,
    CPF_CNPJ_Prop: '',
    Pot_Motor: '',
    CaminhoImgVeiculo: '',
    Km_inicial: null,
    Ar_cond: null,
    Vidro_elet: null,
    Multimidia: null,
    Sensor_Re: null,
    Vr_PadraoAluguel: null,
    Trava_Elet: null,
    Alarme: null,
    Valor_Entrada: null,
    Valor_Fipe_Entrada: null,
    Estoque_idEstoque: null,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [veiculoIdParaDeletar, setVeiculoIdParaDeletar] = useState<number | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('error');
  const [isSaving, setIsSaving] = useState(false);
  const [estoques, setEstoques] = useState<IListagemEstoque[]>([]); // Estado para armazenar a lista de estoques


  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleDeleteDialogOpen = (id: number) => {
    setVeiculoIdParaDeletar(id);
    setDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDialogOpen(false);
    setVeiculoIdParaDeletar(null);
  };

  const handleDelete = async () => {
    if (veiculoIdParaDeletar) {
      try {
        setIsSaving(true);
        const result = await VeiculosService.deleteById(veiculoIdParaDeletar);
        if (result instanceof Error) {
          setMensagemErro(result.message);
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        } else {
          navigate('/veiculos');
        }
      } catch (error) {
        console.error('Erro ao deletar veículo:', error);
      } finally {
        setDialogOpen(false);
        setVeiculoIdParaDeletar(null);
        setIsSaving(false);
      }
    }
  };

  const handleInputChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setVeiculo((prevVeiculo) => ({
      ...prevVeiculo,
      [name]: value,
    }));
  };


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
  
    // Converte valores para o tipo correto
    let finalValue: string | number | boolean | null;
  
    if (type === 'number') {
      // Verifica se o valor é uma string numérica válida
      if (/^\d*$/.test(value)) {
        finalValue = value === '' ? null : Number(value); // Converte para número ou null
      } else {
        // Se não for um número válido, mantém o valor anterior
        return;
      }
    } else if (type === 'checkbox') {
      finalValue = checked; // Usa o valor do checkbox
    } else {
      // Para campos de texto, garante que o valor seja uma string
      finalValue = value;
    }
  
    // Atualiza o estado do veículo
    setVeiculo((prevVeiculo) => ({
      ...prevVeiculo,
      [name]: finalValue,
    }));
  };





  const handleCriarVeiculo = async () => {
    try {
      setIsSaving(true); // Inicia o carregamento
      if (idVeiculo === 'novo') {
        // Verifica campos obrigatórios
        if (!veiculo.Placa_Veiculo) {
          setMensagemErro('Por favor, insira a placa do veículo.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          return;
        }

        if (!veiculo.Chassi) {
          setMensagemErro('Por favor, insira o chassi do veículo.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          return;
        }

        if (!veiculo.Renavan) {
          setMensagemErro('Por favor, insira o Renavam do veículo.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          return;
        }

        if (!veiculo.Marca) {
          setMensagemErro('Por favor, insira a marca do veículo.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          return;
        }

        if (!veiculo.Modelo) {
          setMensagemErro('Por favor, insira o modelo do veículo.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          return;
        }

        if (!veiculo.Ano_fab) {
          setMensagemErro('Por favor, insira o ano de fabricação do veículo.');
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
          return;
        }
        const { idVeiculo, ...veiculoSemId } = veiculo;
        const veiculoCriado = await VeiculosService.create(veiculoSemId);
        if (veiculoCriado instanceof Error) {
          setMensagemErro(veiculoCriado.message);
          setSnackbarSeverity('error');
          setOpenSnackbar(true);
        } else {
          setVeiculo(veiculo);
          setMensagemErro('Veículo criado com sucesso!');
          setSnackbarSeverity('success');
          setOpenSnackbar(true);
        }
      }
    } catch (error) {
      //alert(error);
      setMensagemErro(error.response.data.message);
      //setMensagemErro('Erro ao criar veículo!');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true); // Inicia o carregamento

      // Verifica campos obrigatórios
      if (!veiculo.Placa_Veiculo) {
        setMensagemErro('Por favor, insira a placa do veículo.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }

      if (!veiculo.Chassi) {
        setMensagemErro('Por favor, insira o chassi do veículo.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }

      if (!veiculo.Renavan) {
        setMensagemErro('Por favor, insira o Renavam do veículo.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }

      if (!veiculo.Marca) {
        setMensagemErro('Por favor, insira a marca do veículo.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }

      if (!veiculo.Modelo) {
        setMensagemErro('Por favor, insira o modelo do veículo.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }

      if (!veiculo.Ano_fab) {
        setMensagemErro('Por favor, insira o ano de fabricação do veículo.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        return;
      }

      // Verifica se o ID do veículo é válido e se não é um novo veículo
      if (idVeiculo && idVeiculo !== 'novo') {
        const idVeiculoNumber = Number(idVeiculo);
        if (!isNaN(idVeiculoNumber)) {
          const veiculoAtualizado = await VeiculosService.updateById(idVeiculoNumber, veiculo);

          if (veiculoAtualizado instanceof Error) {
            setMensagemErro(veiculoAtualizado.message);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
          } else {
            setVeiculo(veiculo);
            setMensagemErro('Veículo atualizado com sucesso!');
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
        setMensagemErro('Erro desconhecido ao atualizar o veículo.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } finally {
      setIsSaving(false); // Finaliza o carregamento
    }
  };


  const handleCancel = () => {
    navigate('/veiculos');
  };

  useEffect(() => {
    const fetchVeiculo = async () => {
      try {
        if (idVeiculo && idVeiculo !== 'novo') {
          const idVeiculoNumber = Number(idVeiculo);
          if (!isNaN(idVeiculoNumber)) {
            setIsSaving(true);
            const response = await VeiculosService.getById(idVeiculoNumber);
            if (response instanceof Error) {
              console.error('Erro ao buscar veículo:', response.message);
              setMensagemErro('Erro ao buscar veículo: ' + response.message);
              setSnackbarSeverity('error');
              setOpenSnackbar(true);
            } else {
              setVeiculo(response);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao buscar veículo:', error);
        setMensagemErro('Erro ao buscar veículo.');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      } finally {
        setIsSaving(false);
      }
    };

    fetchVeiculo();
  }, [idVeiculo]);



  // Carregar a lista de estoques ao montar o componente
  useEffect(() => {
    const fetchEstoques = async () => {
      try {
        const result = await EstoquesService.getAll(1, ''); // Busca todos os estoques
        if (result instanceof Error) {
          //alert(result);
          //alert("IF");

          console.error('Erro ao buscar estoques:', result.message);
        } else {
          setEstoques(result.data); // Atualiza o estado com a lista de estoques
          //alert("else");
          //alert(result.data);
        }
      } catch (error) {
        console.error('Erro ao buscar estoques:', error);
      }
    };

    fetchEstoques();
  }, []);






  return (

    <MenuLateral>
      {/* O Dashboard será passado como children para o MenuLateral */}
      <div style={{ flex: 1 }}>
        <LayoutBaseDePagina
          titulo={idVeiculo === 'novo' ? 'Novo Veículo' : 'Detalhe do Veículo'}
          barraDeFerramentas={
            <FerramentasDeDetalhe
              mostrarBotaoNovo={false}
              mostrarBotaoSalvarEFechar={false}
              mostrarBotaoSalvar={idVeiculo !== 'novo'}
              mostrarBotaoSalvarCarregando={isSaving}
              mostrarBotaoCriar={idVeiculo === 'novo'}
              mostrarBotaoCriarCarregando={isSaving}
              mostrarBotaoApagar={idVeiculo !== 'novo'}
              aoClicarEmNovo={() => navigate('/veiculos/detalhe/novo')}
              aoClicarEmSalvar={handleSave}
              aoClicarEmCriar={handleCriarVeiculo}
              aoClicarEmApagar={() => handleDeleteDialogOpen(idVeiculoApagar)}
              aoClicarEmVoltar={handleCancel}
            />
          }
        >
          {isSaving && <LinearProgress />}
          <Paper elevation={3} sx={{ padding: 4, marginBottom: 4 }}>
            <Typography variant="h6" gutterBottom>
              {idVeiculo === 'novo' ? 'Criar Novo Veículo' : 'Editar Veículo'}
            </Typography>
            <Grid container spacing={2}>

              {/* Placa */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Placa"
                  name="Placa_Veiculo"
                  value={veiculo.Placa_Veiculo} // Garante que o valor nunca seja null ou undefined
                  onChange={handleInputChange}
                  fullWidth
                  required
                  type="text" // Define o tipo como "text" para permitir edição
                />
              </Grid>

              {/* Chassi */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Chassi"
                  name="Chassi"
                  value={veiculo.Chassi}
                  onChange={handleInputChange}
                  fullWidth
                  required
                 type="text"
                />
              </Grid>

              {/* Renavan */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Renavan"
                  name="Renavan"
                  value={veiculo.Renavan}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  type="text"
                />
              </Grid>

              {/* Cor */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Cor"
                  name="Cor"
                  value={veiculo.Cor}
                  onChange={handleInputChange}
                  fullWidth
                  type="text"
                />
              </Grid>

              {/* Número do Motor */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Número do Motor"
                  name="Nr_Motor"
                  value={veiculo.Nr_Motor}
                  onChange={handleInputChange}
                  fullWidth
                  type="text"
                />
              </Grid>

              {/* Marca */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Marca"
                  name="Marca"
                  value={veiculo.Marca}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  type="text"
                />
              </Grid>

              {/* Modelo */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Modelo"
                  name="Modelo"
                  value={veiculo.Modelo}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  type="text"
                />
              </Grid>

              {/* Status do Veículo */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Status do Veículo"
                  name="StatusVeiculo"
                  value={veiculo.StatusVeiculo}
                  onChange={handleInputChange}
                  fullWidth
                  type="text"
                />
              </Grid>

              {/* Ano de Fabricação */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Ano de Fabricação"
                  name="Ano_fab"
                  value={veiculo.Ano_fab} // Converte null/undefined para string vazia
                  onChange={handleInputChange}
                  fullWidth
                  required
                  type="number"

                />
              </Grid>

              {/* Ano do Modelo */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Ano do Modelo"
                  name="Ano_mod"
                  value={veiculo.Ano_mod} // Converte null/undefined para string vazia
                  onChange={handleInputChange}
                  fullWidth
                  required
                  type="number"

                />
              </Grid>

              {/* Número de Portas */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Número de Portas"
                  name="Nr_portas"
                  value={veiculo.Nr_portas} // Converte null/undefined para string vazia
                  onChange={handleInputChange}
                  fullWidth
                  required
                  type="number"

                />
              </Grid>

              {/* CPF/CNPJ do Proprietário */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="CPF/CNPJ do Proprietário"
                  name="CPF_CNPJ_Prop"
                  value={veiculo.CPF_CNPJ_Prop}
                  onChange={handleInputChange}
                  fullWidth
                  type="text"
                />
              </Grid>

              {/* Potência do Motor */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Potência do Motor"
                  name="Pot_Motor"
                  value={veiculo.Pot_Motor}
                  onChange={handleInputChange}
                  fullWidth
                  type="text"
                />
              </Grid>

              {/* Caminho da Imagem */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Caminho da Imagem"
                  name="CaminhoImgVeiculo"
                  value={veiculo.CaminhoImgVeiculo}
                  onChange={handleInputChange}
                  fullWidth
                  type="text"
                />
              </Grid>

              {/* Quilometragem Inicial */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Quilometragem Inicial"
                  name="Km_inicial"
                  value={veiculo.Km_inicial}
                  onChange={handleInputChange}
                  fullWidth
                  type="text"
                />
              </Grid>

              {/* Ar Condicionado */}
              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={veiculo.Ar_cond || false} // Converte null/undefined para false
                      onChange={(e) =>
                        setVeiculo((prev) => ({
                          ...prev,
                          Ar_cond: e.target.checked,
                        }))
                      }
                      name="Ar_cond"
                    />
                  }
                  label="Ar Condicionado"
                />
              </Grid>

              {/* Vidros Elétricos */}
              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={veiculo.Vidro_elet || false} // Converte null/undefined para false
                      onChange={(e) =>
                        setVeiculo((prev) => ({
                          ...prev,
                          Vidro_elet: e.target.checked,
                        }))
                      }
                      name="Vidro_elet"
                    />
                  }
                  label="Vidros Elétricos"
                />
              </Grid>

              {/* Multimídia */}
              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={veiculo.Multimidia || false} // Converte null/undefined para false
                      onChange={(e) =>
                        setVeiculo((prev) => ({
                          ...prev,
                          Multimidia: e.target.checked,
                        }))
                      }
                      name="Multimidia"
                    />
                  }
                  label="Multimídia"
                />
              </Grid>

              {/* Sensor de Ré */}
              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={veiculo.Sensor_Re || false} // Converte null/undefined para false
                      onChange={(e) =>
                        setVeiculo((prev) => ({
                          ...prev,
                          Sensor_Re: e.target.checked,
                        }))
                      }
                      name="Sensor_Re"
                    />
                  }
                  label="Sensor de Ré"
                />
              </Grid>

              {/* Travas Elétricas */}
              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={veiculo.Trava_Elet || false} // Converte null/undefined para false
                      onChange={(e) =>
                        setVeiculo((prev) => ({
                          ...prev,
                          Trava_Elet: e.target.checked,
                        }))
                      }
                      name="Trava_Elet"
                    />
                  }
                  label="Travas Elétricas"
                />
              </Grid>

              {/* Alarme */}
              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={veiculo.Alarme || false} // Converte null/undefined para false
                      onChange={(e) =>
                        setVeiculo((prev) => ({
                          ...prev,
                          Alarme: e.target.checked,
                        }))
                      }
                      name="Alarme"
                    />
                  }
                  label="Alarme"
                />
              </Grid>


              {/* Valor Padrão de Aluguel */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Valor Padrão de Aluguel"
                  name="Vr_PadraoAluguel"
                  value={veiculo.Vr_PadraoAluguel}
                  onChange={handleInputChange}
                  fullWidth
                  type="number"
                />
              </Grid>

              {/* Valor de Entrada */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Valor de Entrada"
                  name="Valor_Entrada"
                  value={veiculo.Valor_Entrada}
                  onChange={handleInputChange}
                  fullWidth
                  type="number"
                />
              </Grid>

              {/* Valor FIPE de Entrada */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Valor FIPE de Entrada"
                  name="Valor_Fipe_Entrada"
                  value={veiculo.Valor_Fipe_Entrada}
                  onChange={handleInputChange}
                  fullWidth
                  type="number"
                />
              </Grid>

              {/* Estoque */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Estoque"
                  name="Estoque_idEstoque"
                  value={veiculo.Estoque_idEstoque || ''}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  select
                >
                  {/* Opção padrão para nenhum estoque selecionado */}
                  <MenuItem value="">
                    <em>Selecione um estoque</em>
                  </MenuItem>
                  {/* Verifica se estoques é um array antes de mapear */}
                  {Array.isArray(estoques) && estoques.map((estoque) => (
                    <MenuItem key={estoque.idEstoque} value={estoque.idEstoque}>
                      {estoque.Nome}
                    </MenuItem>
                  ))}
                </TextField>
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
                Você tem certeza de que deseja excluir este veículo? Esta ação não pode ser desfeita.
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
    </MenuLateral >

  );
};
