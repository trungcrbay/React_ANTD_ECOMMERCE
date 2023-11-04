//Slice: redux toolkit: gop action va reducer cua redux thuan
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    carts: [] //khoi tao gia tri gio hang rỗng 
};


export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        doAddBookAction: (state, action) => {
            let carts = state.carts; //lay state hien tai cua gio hang bằng initialState
        //action.payload phụ thuộc vào truyền từ dispatch và sẽ truyền vào reducers trước khi cập nhật vào redux
            const item = action.payload; //lay gia tri thong tin item muon them vao gio hang
            let isExistIndex = carts.findIndex(c => c._id === item._id);
            //findIndex: neu ko ton tai => return -1 , ton tai => tra ve vi tri hien tai trong mang
            //biet san pham muon them gio hang ton tai chua, neu ton tai => tra ra index
            if(isExistIndex > -1){
                carts[isExistIndex].quantity = carts[isExistIndex].quantity + item.quantity;
                if(carts[isExistIndex].quantity > carts[isExistIndex].detail.quantity){
                    carts[isExistIndex].quantity = carts[isExistIndex].detail.quantity;
                }   
            } //TH2: san pham chua ton tai=> day vao gio hang
            else{
                carts.push({
                    quantity:item.quantity, //currentQuantity từ react
                    _id:item._id,  //book._id
                    detail:item.detail //bookData từ react
                })
            }
            //update redux
            state.carts = carts; //immer 
        },
        doUpdateCartAction: (state, action) => {
            let carts = state.carts; //lay state hien tai cua gio hang
            const item = action.payload;  //lay thong tin san pham can cap nhat tu payload
            //truyền thông tin sản phẩm cần cập nhật qua payload ở dispatch
            //=>> cách 
            let isExistIndex = carts.findIndex(c => c._id === item._id);
            //biet san pham muon them gio hang ton tai chua, neu ton tai => tra ra index
            //chua ton tai =>> index = -1
            if(isExistIndex > -1){
                carts[isExistIndex].quantity = item.quantity;
                if(carts[isExistIndex].quantity > carts[isExistIndex].detail.quantity){
                    carts[isExistIndex].quantity = carts[isExistIndex].detail.quantity;
                }   
            } //TH2: san pham chua ton tai=> day vao gio hang
            else{
                carts.push({
                    quantity:item.quantity,
                    _id:item._id,
                    detail:item.detail
                })
            }
            //update redux
            state.carts = carts; //immer 
        },
        doDeleteCartAction: (state,action) => {
            state.carts = state.carts.filter(c => c._id !== action.payload._id);
        },
        doPlaceOrderAction: (state,action) => {
            state.carts = []; // cập nhật lại redux rỗng sau khi order thành công
        }
    },

});

export const { doAddBookAction , doDeleteCartAction , doUpdateCartAction, doPlaceOrderAction}  = orderSlice.actions; //goi action trong component cua react


export default orderSlice.reducer;
