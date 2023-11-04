import axios from "../utils/axios-customize";

export const callRegister = (fullName, email, password, phone) => {
    return axios.post('/api/v1/user/register', { fullName, email, password, phone })
    //create new user/something.... => use post method
}

export const callLogin = (username, password) => {
    return axios.post('/api/v1/auth/login', { username, password, delay: 5000 })
}

export const callFetchAccount = () => {
    return axios.get('/api/v1/auth/account');
}

export const callFetchCategory = () => {
    return axios.get('/api/v1/database/category')
}

export const callLogout = () => {
    return axios.post('/api/v1/auth/logout');
}

export const callFetchListUser = (query) => {
    return axios.get(`/api/v1/user?${query}`);
}

export const callFetchListBook = (query) => {
    return axios.get(`/api/v1/book?${query}`)
}


export const callCreateNewUser = (fullName, email, password, phone) => {
    return axios.post(`http://localhost:8080/api/v1/user`, { fullName, email, password, phone })
}

export const callCreateNewBook = (thumbnail, slider, mainText, author, price, sold, quantity, category) => {
    return axios.post(`/api/v1/book/`, { thumbnail, slider, mainText, author, price, sold, quantity, category })
}

export const callBulkCreateUser = (data) => {
    return axios.post(`/api/v1/user/bulk-create`, data)
}

export const callUpdateUser = (_id, fullName, phone) => {
    return axios.put(`/api/v1/user`, { _id, fullName, phone })
}

export const callDeleteUser = (userId) => {
    return axios.delete(`/api/v1/user/${userId}`);
}
export const callDeleteBook = (bookId) => {
    return axios.delete(`/api/v1/book/${bookId}`);
} 

export const callUploadBookImg = (fileImg) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    return axios({
        method: 'post',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": "book"
        },
    });
} 

export const callFetchBookById = (id) => {
    return axios.get(`/api/v1/book/${id}`);
}

export const callPlaceOrder = (data) => {
    return axios.post('/api/v1/order',{
        ...data
    })
}

export const callFetchListOrderHistory = () => {
    return axios.get(`api/v1/history`)
}

export const callFetchListDashboard = () => {
    return axios.get(`api/v1/database/dashboard`)
}

export const callUpdatePassword = (email,oldpass,newpass) => {
    return axios.post(`api/v1/user/change-password`,{
        email,oldpass,newpass
    })
}

export const callFetchListOrder = (query) => {
    return axios.get(`/api/v1/order?${query}`)
}

export const callUpdateUserInfo = (fullName,phone , _id) => {
    return axios.put(`api/v1/user`, {   
        fullName,phone, _id
    })
}