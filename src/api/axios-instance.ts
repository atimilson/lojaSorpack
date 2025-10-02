import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';  

const BASE_URL = 'https://pedidoexterno.mcnsistemas.net.br';

// Criar instância personalizada do axios
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Adicionar interceptor para incluir o token em todas as requisições
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Interceptor para tratar respostas
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Retorna diretamente o dado da resposta para simplificar o uso
    return response.data;
  },
  (error: any) => {
    // Se o erro tem resposta, extraímos a mensagem de erro
    if (error.response) {
      const { data, status } = error.response;
      
      // Se for uma resposta de erro 400 com mensagem específica
      if (status === 400) {
        // Se a resposta for um objeto com campo error
        if (data && typeof data === 'object' && data.error) {
          return Promise.reject({ message: data.error, status });
        }
        // Se for uma string
        else if (typeof data === 'string') {
          return Promise.reject({ message: data, status });
        }
      }
    }
    
    // Erro genérico
    return Promise.reject({ 
      message: 'Ocorreu um erro na requisição',
      originalError: error
    });
  }
);

export default axiosInstance; 