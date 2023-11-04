import axios from "axios";
const baseUrl = import.meta.env.VITE_BACKEND_URL
const instance = axios.create({
    // baseURL: 'http://localhost:8080',
    baseURL: baseUrl,
    withCredentials: true, // set cookies for website
});

//token lay tu localStorage, sử dụng instance.defaults.headers.common để lấy token
instance.defaults.headers.common = { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` } //lay tu localStorage

const handleRefreshToken = async () => {
    const res = await instance.get('/api/v1/auth/refresh')
    if (res && res.data) return res.data.access_token;
    else null;
}
//nap lai data cho redux khi f5 trang:
// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

const NO_RETRY_HEADER = 'x-no-retry';

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response && response.data ? response.data : response;
}, async function (error) {

    if (error.config && error.response
        && +error.response.status === 401
        && !error.config.headers[NO_RETRY_HEADER]) {
        const access_token = await handleRefreshToken();
        error.config.headers[NO_RETRY_HEADER] = 'true'
        if (access_token) {
            error.config.headers['Authorization'] = `Bearer ${access_token}`;
            localStorage.setItem('access_token', access_token);
            return instance.request(error.config);
        }
    }

    if (error.config && error.response
        && +error.response.status === 400
        && error.config.url === '/api/v1/auth/refresh') {
            window.location.href = '/login';
    }

    return error?.response?.data ?? Promise.reject(error);
});

export default instance;