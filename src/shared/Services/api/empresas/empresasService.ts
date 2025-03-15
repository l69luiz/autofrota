// src/shared/services/api/empresas/EmpresasService.ts

import { Environment } from "../../../environments";
import { Api } from "../axios-config";

export interface IListagemEmpresa {
  idEmpresa: number;
  Nome_Empresa: string;
  NomeFantasia_Empresa: string;
  CNPJ_Empresa: string;
}

export interface IDetalheEmpresa {
  idEmpresa: number;
  Nome_Empresa: string;
  NomeFantasia_Empresa: string;
  Endereco_Empresa: string;
  Telefone_Empresa: string | null;
  Email_Empresa: string | null;
  CNPJ_Empresa: string;
  CaminhoImgEmpresa: string;
}

export type TEmpresaComTotalCount = {
  data: IListagemEmpresa[];
  totalCount: number;
};

const getAll = async (page = 1, filter = ''): Promise<TEmpresaComTotalCount | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho
    
    const urlRelativa = `/empresas?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nomeEmpresa_like=${filter}`;
    
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

const getById = async (idEmpresa: number): Promise<IDetalheEmpresa | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho
    
    const { data } = await Api.get(`/empresas/${idEmpresa}`, config); // Envia o token junto com a requisição
    
    if (data) {
      return data;
    }
    return new Error('Erro ao consultar o registro.');
    
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};
const getByIdToken = async (): Promise<IDetalheEmpresa | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho
    
    const { data } = await Api.get(`/empresa/detalhe`, config); // Envia o token junto com a requisição
    
    if (data) {
      return data;
    }
    return new Error('Erro ao consultar o registro.');
    
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};


const create = async (dados: Omit<IDetalheEmpresa, 'idEmpresa'>): Promise<IDetalheEmpresa | Error> => {
  try {
    const token = sessionStorage.getItem('token');
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const { data } = await Api.post('/empresas', dados, config); // Faz a requisição

    if (data) {
      return data; // Retorna o objeto da empresa criada
    }
    return new Error('Erro ao criar empresa.');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao criar empresa.');
  }
};

const updateById = async (id: number, dados: IDetalheEmpresa): Promise<void | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho
    const resp = await Api.put(`/empresas/${id}`, dados, config); // Envia o token junto com a requisição
    if (resp.status === 200) {
      // Exibe uma mensagem de sucesso (Snackbar, por exemplo)
      return  resp.data.message; // Finaliza a função sem erros
    }
    
  } catch (error) {
    if (error.response) {
      // Define a mensagem de erro e exibe o Snackbar
      throw error;
      //alert(error.response.data.message);
    } 
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho
    await Api.delete(`/empresas/${id}`, config); // Envia o token junto com a requisição
   
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
  }
};

export const EmpresasService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getByIdToken
};