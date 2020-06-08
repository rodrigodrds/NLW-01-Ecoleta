import axios from 'axios';

const ibgeAPI = axios.create({
  baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades'
});

export default ibgeAPI;
