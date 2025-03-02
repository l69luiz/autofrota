//src/shared/services/api/estoques/estoquesService.ts
import { Environment } from "../../../environments";
import { Api } from "../axios-config";

// Interface para representar um estoque na listagem
export interface IListagemEstoque {
  idEstoque: number;
  Nome: string;
  AreaTotal: number;
  AreaCoberta: number;
  Data_Abertura: Date | null;
  Status: string | null;
  Local: string | null;
  Empresas_idEmpresa: number;
}

// Interface para representar os detalhes de um estoque
export interface IDetalheEstoque {
  idEstoque: number;
  Nome: string| null;
  AreaTotal: number| null;
  AreaCoberta: number| null;
  Data_Abertura: Date | null;
  Status: string | null;
  Local: string | null;
  Empresas_idEmpresa: number | null;
}

// Tipo para a resposta da API com paginação
export type TEstoqueComTotalCount = {
  data: IListagemEstoque[];
  totalCount: number;
};

// Método para listar todos os estoques
const getAll = async (page = 1, filter = ''): Promise<TEstoqueComTotalCount | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho

    const urlRelativa = `/estoques?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;

    const { data, headers } = await Api.get(urlRelativa, config); // Envia o token junto com a requisição

    if (data && data.data && Array.isArray(data.data)){
        
      return {
        data: data.data, // Acessa a propriedade data.data (array de estoques)
        
        totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS),
      };
    }
    return new Error('Erro ao listar os registros.');

  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};

// Método para buscar um estoque pelo ID
const getById = async (idEstoque: number): Promise<IDetalheEstoque | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho

    const { data } = await Api.get(`/estoques/${idEstoque}`, config); // Envia o token junto com a requisição

    if (data) {
      return data;
    }
    return new Error('Erro ao consultar o registro.');

  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

// Método para criar um novo estoque
const create = async (dados: Omit<IDetalheEstoque, 'idEstoque'>): Promise<void | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho

    const resp = await Api.post('/estoques', dados, config); // Faz a requisição

    if (resp.status === 201) {
      return resp.data.message; // Finaliza a função sem erros
    }

  } catch (error) {
    if (error.response) {
      throw error; // Lança o erro para ser tratado no componente
    }
  }
};

// Método para atualizar um estoque pelo ID
const updateById = async (id: number, dados: IDetalheEstoque): Promise<void | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho

    const resp = await Api.put(`/estoques/${id}`, dados, config); // Envia o token junto com a requisição

    if (resp.status === 200) {
      return resp.data.message; // Finaliza a função sem erros
    }

  } catch (error) {
    if (error.response) {
      throw error; // Lança o erro para ser tratado no componente
    }
  }
};

// Método para deletar um estoque pelo ID
const deleteById = async (id: number): Promise<void | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho

    await Api.delete(`/estoques/${id}`, config); // Envia o token junto com a requisição

  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
  }
};

// Exporta o serviço com todos os métodos
export const EstoquesService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};