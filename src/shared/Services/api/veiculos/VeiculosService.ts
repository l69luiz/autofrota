// src/shared/services/api/veiculos/VeiculosService.ts
import { Environment } from "../../../environments";
import { Api } from "../axios-config";

export interface IListagemVeiculo {
  idVeiculo: number;
  Placa_Veiculo: string;
  Marca: string;
  Modelo: string;
  StatusVeiculo: string;
  Ano_fab: number;
  Ano_mod: number;
}

export interface IDetalheVeiculo {
  idVeiculo: number | null,
  Placa_Veiculo: string;
  Chassi: string;
  Renavan: string;
  Cor: string;
  Nr_Motor: string;
  Marca: string;
  Modelo: string;
  StatusVeiculo: string;
  Ano_fab: number | null,
  Ano_mod: number | null,
  Nr_portas: number | null,
  CPF_CNPJ_Prop: string;
  Pot_Motor: string;
  CaminhoImgVeiculo: string;
  Km_inicial: number | null,
  Ar_cond: boolean | null,
  Vidro_elet: boolean | null,
  Multimidia: boolean | null,
  Sensor_Re: boolean | null,
  Vr_PadraoAluguel: number | null,
  Trava_Elet: boolean | null,
  Alarme: boolean | null,
  Valor_Entrada: number | null,
  Valor_Fipe_Entrada: number | null,
  Estoque_idEstoque: number | null,
}

export type TVeiculoComTotalCount = {
  data: IListagemVeiculo[];
  totalCount: number;
};


const getAll = async (
  page = 1,
  search = ''
): Promise<TVeiculoComTotalCount | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho

    // Constrói a URL relativa com base nos filtros fornecidos
    const queryParams = new URLSearchParams();
    queryParams.append('_page', page.toString());
    queryParams.append('_limit', Environment.LIMITE_DE_LINHAS.toString());

    if (search) queryParams.append('search', search); // Envia o parâmetro de busca

    const urlRelativa = `/veiculos?${queryParams.toString()}`;

    const { data, headers } = await Api.get(urlRelativa, config); // Envia o token junto com a requisição

    if (data) {
      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS),
      };
    }
    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};


const getById = async (idVeiculo: number): Promise<IDetalheVeiculo | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do localStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho
    
    const { data } = await Api.get(`/veiculos/${idVeiculo}`, config); // Envia o token junto com a requisição
    
    if (data) {
      return data;
    }
    return new Error('Erro ao consultar o registro.');
    
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const create = async (dados: Omit<IDetalheVeiculo, 'idVeiculo'>): Promise<void | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho
    const resp = await Api.post('/veiculos', dados, config); // Faz a requisição
    if (resp.status === 201) {
      return resp.data.message; // Finaliza a função sem erros
    }
  }    catch (error) {
    if (error.response) {
      // Define a mensagem de erro e exibe o Snackbar
      //alert(error.response.data.message);
      throw error;
      
    } 
  }
};

const updateById = async (id: number, dados: IDetalheVeiculo): Promise<void | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho
    const resp = await Api.put(`/veiculos/${id}`, dados, config); // Envia o token junto com a requisição
    
    if (resp.status === 200) {
        // Exibe uma mensagem de sucesso (Snackbar, por exemplo)
        return  resp.data.message; // Finaliza a função sem erros
      }

  } catch (error) {
    if (error.response) {
      throw error;
    }
  }
};






const deleteById = async (id: number): Promise<void | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho
    await Api.delete(`/veiculos/${id}`, config); // Envia o token junto com a requisição
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
  }
};

export const VeiculosService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};