const axios = require('axios');

const axiosInstance = axios.create({
    baseURL: 'https://stark-crag-43885.herokuapp.com/api/v1',
});

export default axiosInstance;
