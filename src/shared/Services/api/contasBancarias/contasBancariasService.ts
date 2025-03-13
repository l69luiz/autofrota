//src/shared/services/api/estoques/contasBancariasService.ts
import { Environment } from "../../../environments";
import { Api } from "../axios-config";

// Interface para representar uma conta bancária na listagem
export interface IListagemContaBancaria {
  idContasBancarias: number;
  NumeroBanco: string;
  NumeroConta: string;
  DigitoConta: string | null;
  NumeroAgenciaBanco: string | null;
  DigitoAgencia: string | null;
  NomeBanco: string | null;
  TipoConta: string | null;
  NomeTitular: string | null;
  CPF_CNPJ_Titular: string | null;
  StatusConta: string | null;
  DataAbertura: Date | null;
  Empresas_idEmpresa: number;
}

// Interface para representar os detalhes de uma conta bancária
export interface IDetalheContaBancaria {
  idContasBancarias: number;
  NumeroBanco: string;
  NumeroConta: string;
  DigitoConta: string | null;
  NumeroAgenciaBanco: string | null;
  DigitoAgencia: string | null;
  NomeBanco: string | null;
  TipoConta: string | null;
  NomeTitular: string | null;
  CPF_CNPJ_Titular: string | null;
  StatusConta: string | null;
  DataAbertura: Date | null;
  Empresas_idEmpresa: number | null;
}



// Tipo para a resposta da API com paginação
export type TContaBancariaComTotalCount = {
  data: IListagemContaBancaria[];
  totalCount: number;
};

// Método para listar todas as contas bancárias
const getAll = async (page = 1, filter = ''): Promise<TContaBancariaComTotalCount | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho

    const urlRelativa = `/contasbancarias?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nomeBanco_like=${filter}`;

    const { data, headers } = await Api.get(urlRelativa, config); // Envia o token junto com a requisição

    if (data && data.data && Array.isArray(data.data)) {
      return {
        data: data.data, // Acessa a propriedade data.data (array de contas bancárias)
        totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS),
      };
    }
    return new Error('Erro ao listar os registros.');

  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao listar os registros.');
  }
};

// Método para buscar uma conta bancária pelo ID
const getById = async (idContasBancarias: number): Promise<IDetalheContaBancaria | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho
    console.log(idContasBancarias);

    const { data } = await Api.get(`/contasBancarias/${idContasBancarias}`, config); // Envia o token junto com a requisição
    console.log(data);

    if (data) {
      console.log(data);
      return data;
    }
    return new Error('Erro ao consultar o registro.');

  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

// Método para criar uma nova conta bancária
const create = async (dados: Omit<IDetalheContaBancaria, 'idContasBancarias'>): Promise<void | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho

    const resp = await Api.post('/contasBancarias', dados, config); // Faz a requisição

    if (resp.status === 201) {
      return resp.data.message; // Finaliza a função sem erros
    }

  } catch (error) {
    if (error.response) {
      throw error; // Lança o erro para ser tratado no componente
    }
  }
};

// Método para atualizar uma conta bancária pelo ID
const updateById = async (id: number, dados: IDetalheContaBancaria): Promise<void | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho


    const resp = await Api.put(`/contasBancarias/${id}`, dados, config); // Envia o token junto com a requisição

    if (resp.status === 200) {
      return resp.data.message; // Finaliza a função sem erros
    }

  } catch (error) {
    if (error.response) {
      throw error; // Lança o erro para ser tratado no componente
    }
  }
};

// Método para deletar uma conta bancária pelo ID
const deleteById = async (id: number): Promise<void | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho

    await Api.delete(`/contasBancarias/${id}`, config); // Envia o token junto com a requisição

  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
  }
};

// Exporta o serviço com todos os métodos
export const ContasBancariasService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};