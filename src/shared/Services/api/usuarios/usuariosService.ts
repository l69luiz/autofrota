//src/shared/services/api/usuarios/usuariosService.ts
import { Environment } from "../../../environments";
import { Api } from "../axios-config";

export interface IListagemUsuario {
  idUsuario: number;
  Nome: string;
  Email: string;
  Celular: string;
  Grupo: string;
  Status: string;
}

export interface IDetalheUsuario {
  idUsuario: number;
  Nome: string;
  CPF_CNPJ: string;
  CEP: string;
  Rua: string;
  Numero: string;
  Bairro: string;
  Cidade: string;
  Estado: string;
  Celular: string;
  Celular2: string;
  RG: string;
  Tipo: string;
  Cargo: string;
  Salario: number;
  Data_Admissao: string;
  Email: string;
  Senha: string;
  Grupo: string;
  Data_Demissao: string;
  Status: string;
  Empresas_idEmpresa: number;
}

export type TUsuarioComTotalCount = {
  data: IListagemUsuario[];
  totalCount: number;
};

const getAll = async (page = 1, filter = ''): Promise<TUsuarioComTotalCount | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho
    
    const urlRelativa = `/usuarios?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
    
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

const getById = async (idUsuario: number): Promise<IDetalheUsuario | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho
    
    const { data } = await Api.get(`/usuarios/${idUsuario}`, config); // Envia o token junto com a requisição
    
    if (data) {
      return data;
    }
    return new Error('Erro ao consultar o registro.');
    
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const create = async (dados: Omit<IDetalheUsuario, 'idUsuario'>): Promise<void | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho
    const resp = await Api.post('/usuarios', dados, config); // Faz a requisição
    if (resp.status === 201) {
      return resp.data.message; // Finaliza a função sem erros
    }
    
  } catch (error) {
    if (error.response) {
      throw error;
    } 
  }
};

const updateById = async (id: number, dados: IDetalheUsuario): Promise<void | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho
    const resp = await Api.put(`/usuarios/${id}`, dados, config); // Envia o token junto com a requisição
    if (resp.status === 200) {
      return resp.data.message; // Finaliza a função sem erros
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
    await Api.delete(`/usuarios/${id}`, config); // Envia o token junto com a requisição
   
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
  }
};

export const UsuariosService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};