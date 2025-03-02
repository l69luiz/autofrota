//src/shared/services/api/clientes/ClientesService.ts
import { Environment } from "../../../environments";
import { Api } from "../axios-config";

export interface IListagemCliente {
  idCliente: number;
  Email: string;
  Celular: string;
  Nome: string;
}

export interface IDetalheCliente {
  idCliente: number;
  Nome: string;
  CPF_CNPJ: string;
  CEP: string;
  Rua: string;
  Numero: string;
  Bairro: string;
  Estado: string;
  Cidade: string;
  Celular: string;
  Celular2: string;
  RG: string;
  Tipo_Cliente: string;
  Email: string;
  Grupo: string;
  StatusAutoRastrear: string;
  StatusEmpresa: string;
  Data_Nascimento: string;
  Sexo: string;
  Estado_Civil: string;
  //Empresas_idEmpresa: number;
}

export type TClienteComTotalCount = {
  data: IListagemCliente[];
  totalCount: number;
};

// interface Cliente {
//   idCliente: number;
//   Nome: string;
//   Email: string;
//   Celular: string;
// }

const getAll = async (page = 1, filter = ''): Promise<TClienteComTotalCount | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho
    
    const urlRelativa = `/clientes?_page=${page}&_limit=${Environment.LIMITE_DE_LINHAS}&nome_like=${filter}`;
    
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

const getById = async (idCliente: number): Promise<IDetalheCliente | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do localStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho
    
    const { data } = await Api.get(`/clientes/${idCliente}`, config); // Envia o token junto com a requisição
    
    if (data) {
      return data;
    }
    return new Error('Erro ao consultar o registro.');
    
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};

const create = async (dados: Omit<IDetalheCliente, 'idCliente'>): Promise<void | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho
    const resp = await Api.post('/clientes', dados, config); // Faz a requisição
    if (resp.status === 201) {
      // Exibe uma mensagem de sucesso (Snackbar, por exemplo)
      return  resp.data.message; // Finaliza a função sem erros
    }
    
    }
    
   catch (error) {
    if (error.response) {
      // Define a mensagem de erro e exibe o Snackbar
      throw error;
      //alert(error.response.data.message);
    } 
  }
}


const UpdateById = async (id: number, dados: IDetalheCliente): Promise<void | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho
    const resp = await Api.put(`/clientes/${id}`, dados, config); // Envia o token junto com a requisição
    if (resp.status === 200) {
      // Exibe uma mensagem de sucesso (Snackbar, por exemplo)
      return  resp.data.message; // Finaliza a função sem erros
    }
    
    }
    
   catch (error) {
    if (error.response) {
      // Define a mensagem de erro e exibe o Snackbar
      throw error;
      //alert(error.response.data.message);
    } 
  }
}


const deleteById = async (id: number): Promise<void | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho
    await Api.delete(`/clientes/${id}`, config); // Envia o token junto com a requisição
   
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao apagar o registro.');
  }
};



export const ClientesService = {
    
    getAll,
    getById,
    create,
    UpdateById,
    deleteById,
    //getIdEmpresaToken
}

