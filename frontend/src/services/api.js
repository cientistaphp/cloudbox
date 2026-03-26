import axios from 'axios';

const api = axios.create({
         baseURL:  'https://cloudbox-production-d43f.up.railway.app',
});

export default api;