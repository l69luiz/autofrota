// src/shared/services/api/vendas/VendasService.ts
import { Environment } from "../../../environments";
import { Api } from "../axios-config";

export interface IListagemVenda {
  idVenda: number;
  Data_Venda: string;
  Valor_Venda: number;
  Cliente: {
    Nome: string;
  };
  Usuario: {
    Nome: string;
  };
  Veiculo: {
    Modelo: string;
    Placa_Veiculo: string;
  };
}

export interface IDetalheVenda {
  idVenda: number | null;
  Data_Venda: string;
  Valor_Venda: number;
  Margem_Minima: number | null;
  Desconto_Venda: number | null;
  Forma_Pagamento: string | null;
  Clientes_idCliente: number;
  Usuarios_idUsuario: number;
  Veiculo_idVeiculo: number;
}

export type TVendaComTotalCount = {
  data: IListagemVenda[];
  totalCount: number;
};

const getAll = async (page = 1, filter = ''): Promise<TVendaComTotalCount | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho
    
    const urlRelativa = `/vendas?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&cliente_like=${filter}`;
    
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
    alert(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};

const getById = async (idVenda: number): Promise<IDetalheVenda | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do localStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho
    
    const { data } = await Api.get(`/vendas/${idVenda}`, config); // Envia o token junto com a requisição
    
    if (data) {
      return data;
    }
    return new Error('Erro ao consultar o registro.');
    
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const create = async (dados: Omit<IDetalheVenda, 'idVenda'>): Promise<void | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho
    const resp = await Api.post('/vendas', dados, config); // Faz a requisição
    if (resp.status === 201) {
      return resp.data.message; // Finaliza a função sem erros
    }
  } catch (error) {
    if (error.response) {
      // Define a mensagem de erro e exibe o Snackbar
      //alert(error.response.data.message);
      throw error;
    } 
  }
};

const updateById = async (id: number, dados: IDetalheVenda): Promise<void | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho
    const resp = await Api.put(`/vendas/${id}`, dados, config); // Envia o token junto com a requisição
    
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
    await Api.delete(`/vendas/${id}`, config); // Envia o token junto com a requisição
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
  }
};

export const VendasService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};