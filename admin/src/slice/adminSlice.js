import { createSlice } from '@reduxjs/toolkit'
import { loginAdmin, logoutAdmin, authAdmin } from '@/action/adminAction'

const initialState = {
  userData : {
    id: '',
    email: '',
    name: '',
    admin_yn: 'N'
  },
  isLoading: false,
  error: ''
}

const adminSlice = createSlice({

  name: 'admin',
  initialState: initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
    //register 관련
    .addCase(loginAdmin.pending, state => {
      state.isLoading = true;
    })
    .addCase(loginAdmin.fulfilled, (state, action) => {
      state.isLoading = false;

      if(action.payload.loginSuccess){
        state.userData = action.payload.userData;
        localStorage.setItem('adminAccessToken', action.payload.userData.accessToken);
      }
    })
    .addCase(loginAdmin.rejected, (state, action) => {
      state.isLoading = false;
      alert(action.payload);
    })
    .addCase(logoutAdmin.pending, state => {
      state.isLoading = true;
    })
    .addCase(logoutAdmin.fulfilled, (state) => {
      state.isLoading = false;
      state.userData = initialState.userData;
      localStorage.removeItem('adminAccessToken');
    })
    .addCase(logoutAdmin.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;      
    })
    .addCase(authAdmin.pending, state => {
      state.isLoading = true;
    })
    .addCase(authAdmin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userData = action.payload.userData;
      localStorage.setItem('adminAccessToken', action.payload.userData.accessToken);
    })
    .addCase(authAdmin.rejected, (state, action) => {
      state.isLoading = false;
      state.userData = initialState.userData;
      state.error = action.payload;
      localStorage.removeItem('adminAccessToken');
    })
  }
    

})

export default adminSlice.reducer;