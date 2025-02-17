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
  Email: string;
  Celular: string;
  Nome: string;
}

export type TClienteComTotalCount = {
  data: IListagemCliente[];
  totalCount: number;
};

interface Cliente {
  idCliente: number;
  Nome: string;
  Email: string;
  Celular: string;
}

const getAll = async (page = 1, filter = ''): Promise<TClienteComTotalCount | Error> => {
  try {
    const token = localStorage.getItem('token'); // Pega o token do localStorage
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
    const token = localStorage.getItem('token'); // Pega o token do localStorage
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

const create = async(dados: Omit<IDetalheCliente, 'id'>): Promise<number | Error> =>{
    try {
        const{data} = await Api.post<IDetalheCliente>('/clientes', dados);
    
        if(data){
            return data.idCliente;          
        }
        return new Error('Erro ao criar o registro.');
        
    } catch (error) {
        console.error(error);
        
        return new Error((error as {message: string}).message || 'Erro ao criar o registro.');
        
    }


};


const updateById = async(id: number, dados: IDetalheCliente): Promise<void | Error> =>{
    try {
        await Api.put(`/clientes/${id}`, dados);
               
    } catch (error) {
        console.error(error);
        
        return new Error((error as {message: string}).message || 'Erro ao atualizar o registro.');
        
    }

};

const deleteById = async(id: number): Promise<void | Error> =>{
    try {
        await Api.delete(`/clientes/${id}`);
               
    } catch (error) {
        console.error(error);
        
        return new Error((error as {message: string}).message || 'Erro ao apagar o registro.');
        
    }





};

export const ClientesService = {
    
    getAll,
    getById,
    create,
    updateById,
    deleteById

}

