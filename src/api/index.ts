// import { APIConfiguration } from '@/configs/api.config';
// import axios from 'axios';

// bikin ini setelah  api config
// setelah ini bikin api todos, dimulai dari bikin model todo

import { APIConfiguration } from '@/configs/api.config';
import axios from 'axios';

export const customAxios = axios.create({
  baseURL: APIConfiguration.baseURL,
  headers: {
    'API-Key': APIConfiguration.APIKey,
    'Content-Type': 'application/json',
  },
});
