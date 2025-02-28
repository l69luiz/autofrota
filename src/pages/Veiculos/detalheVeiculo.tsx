// src/pages/veiculos/DetalheVeiculo.tsx
import React, { useState, useEffect } from 'react';
import {
    Button, Paper, TextField, Typography, MenuItem, Dialog, DialogTitle,
    DialogContent, DialogContentText, DialogActions, Grid, Snackbar, Alert,
    CircularProgress, LinearProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { VeiculosService } from '../../shared/services/api/veiculos/VeiculosService'; // Serviço de Veículos
import { LayoutBaseDePagina } from '../../shared/layouts/LayoutBaseDePaginas';
import { FerramentasDeDetalhe, MenuLateral } from '../../shared/components';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

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

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setVeiculo((prevVeiculo) => ({
            ...prevVeiculo,
            [name]: value,
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
              value={veiculo.Placa_Veiculo}
              onChange={handleInputChange}
              fullWidth
              required
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
            />
          </Grid>

          {/* Ano de Fabricação */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Ano de Fabricação"
              name="Ano_fab"
              value={veiculo.Ano_fab}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>

          {/* Ano do Modelo */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Ano do Modelo"
              name="Ano_mod"
              value={veiculo.Ano_mod}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>

          {/* Número de Portas */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Número de Portas"
              name="Nr_portas"
              value={veiculo.Nr_portas}
              onChange={handleInputChange}
              fullWidth
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
            />
          </Grid>

          {/* Ar Condicionado */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Ar Condicionado"
              name="Ar_cond"
              value={veiculo.Ar_cond}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>

          {/* Vidros Elétricos */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Vidros Elétricos"
              name="Vidro_elet"
              value={veiculo.Vidro_elet}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>

          {/* Multimídia */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Multimídia"
              name="Multimidia"
              value={veiculo.Multimidia}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>

          {/* Sensor de Ré */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Sensor de Ré"
              name="Sensor_Re"
              value={veiculo.Sensor_Re}
              onChange={handleInputChange}
              fullWidth
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
            />
          </Grid>

          {/* Travas Elétricas */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Travas Elétricas"
              name="Trava_Elet"
              value={veiculo.Trava_Elet}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>

          {/* Alarme */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Alarme"
              name="Alarme"
              value={veiculo.Alarme}
              onChange={handleInputChange}
              fullWidth
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
            />
          </Grid>

          {/* Estoque */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="ID do Estoque"
              name="Estoque_idEstoque"
              value={veiculo.Estoque_idEstoque}
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
</MenuLateral>

  );
};
