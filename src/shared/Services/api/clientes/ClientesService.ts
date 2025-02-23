//src/shared/services/api/clientes/ClientesService.ts
import { useState } from "react";
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
  Rua: string;
  Numero: string;
  Bairro: string;
  Cidade: string;
  Celular: string;
  Celular2: string;
  RG: string;
  Tipo_Cliente: string;
  Email: string;
  Grupo: string;
  StatusAutoRastrear: string;
  StatusLoja: string;
  Data_Nascimento: string;
  Sexo: string;
  Estado_Civil: string;
  Lojas_idLoja: number;
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

const create = async (dados: Omit<IDetalheCliente, 'idCliente'>): Promise<number | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho
    
    const { data } = await Api.post<IDetalheCliente>('/clientes', dados, config); // Envia o token junto com a requisição
    
    if (data) {
      return data.idCliente;
    }
    return new Error('Erro ao criar o registro.');
    
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao criar o registro.');
  }
};

const updateById = async (id: number, dados: IDetalheCliente): Promise<void | Error> => {
  try {
    const token = sessionStorage.getItem('token'); // Pega o token do sessionStorage
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}; // Adiciona o token no cabeçalho
    
    await Api.put(`/clientes/${id}`, dados, config); // Envia o token junto com a requisição
    
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao atualizar o registro.');
  }
};

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


const getIdLojaToken = (): number => {
  // 1. Recuperar o token do sessionStorage
  const token = sessionStorage.getItem('token');
  console.log(token);

  if (token) {
    try {
      // 2. Decodificar o token JWT
      const payloadBase64 = token.split('.')[1]; // O payload é a segunda parte do token
      console.log("Base64 : ",payloadBase64);
      const payloadJson = atob(payloadBase64); // Decodifica de Base64 para string JSON
      console.log("STRING : ",payloadJson);
      const payload = JSON.parse(payloadJson); // Converte a string JSON para objeto
      console.log("JSON : ",payload);

      // 3. Extrair o idLojaToken e converter para número
      const idLojaToken2 = payload.idlojaToken;
      console.log("kasjhdfkjsahdfk : ",idLojaToken2);
      if (idLojaToken2) {
        console.log("Number : ", parseInt(idLojaToken2, 10));
        return parseInt(idLojaToken2, 10); // Retorna o valor convertido para número
      }
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
    }
  }

  // Retorna null caso o token não exista ou ocorra um erro
  return 0;
};

export const ClientesService = {
    
    getAll,
    getById,
    create,
    updateById,
    deleteById,
    getIdLojaToken
}

