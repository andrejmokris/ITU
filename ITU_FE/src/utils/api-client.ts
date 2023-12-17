/**
 * Author: Andrej Mokris xmokri01
 */

import axios from 'axios';

export const api_client = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`
});
