import { createSlice } from '@reduxjs/toolkit'
import { authUser, loginUser, registerUser, logoutUser, bookMark, kakaoLogin } from '../action/userAction'
import { toast } from 'react-toastify'

const initialState = {
  userData : {
    id: '',
    email: '',
    name: '',
    htel: '',
    bookmark:[]
  },
  isAuth: false,
  isLoading: false,
  error: '',
  isKakao: false
}

const userSlice = createSlice({

  name: 'user',
  initialState: initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
    //register 관련
    .addCase(registerUser.pending, state => {
      state.isLoading = true;
    })
    .addCase(registerUser.fulfilled, (state) => {
      state.isLoading = false;
    })
    .addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      toast.error(action.payload);
    })
    //register 관련
    .addCase(loginUser.pending, state => {
      state.isLoading = true;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;

      if(action.payload.loginSuccess){
        state.userData = action.payload.userData;
        state.isAuth = true;
        localStorage.setItem('accessToken', action.payload.userData.accessToken);
      }

    })
    .addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      toast.error(action.payload);
    })
    .addCase(authUser.pending, state => {
      state.isLoading = true;
    })
    .addCase(authUser.fulfilled, (state, action) => {
      state.isLoading = false;
      console.log(action.payload.userData)
      state.userData = action.payload.userData;
      state.isAuth = true;
    })
    .addCase(authUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuth = false;
      state.userData = initialState.userData;
      state.error = action.payload;
      localStorage.removeItem('accessToken');
    })
    .addCase(logoutUser.pending, state => {
      state.isLoading = true;
    })
    .addCase(logoutUser.fulfilled, (state) => {
      state.isLoading = false;
      state.isAuth = false;
      state.userData = initialState.userData;
      localStorage.removeItem('accessToken');
    })
    .addCase(logoutUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;      
    })
    .addCase(bookMark.pending, state => {
      state.isLoading = true;
    })
    .addCase(bookMark.fulfilled, (state, action) => {
      state.isLoading = false;
      if(action.payload.addFlag === 'Y'){
        state.userData.bookmark.push(action.payload.id);
      }else if(action.payload.addFlag === 'N') {
        state.userData.bookmark.splice(state.userData.bookmark.indexOf(action.payload.id), 1);
      }
      toast.info(action.payload.message);
    })
    .addCase(bookMark.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      
    })
    .addCase(kakaoLogin.pending, state => {
      state.isLoading = true;
    })
    .addCase(kakaoLogin.fulfilled, (state, action) => {
      state.isLoading = false;
    
      if(action.payload.kakaoLoginSuccess){
        state.userData = action.payload.userData
        state.isAuth = true;
        state.isKakao = true;
        localStorage.setItem('accessToken', action.payload.userData.accessToken);
      }

    })
    .addCase(kakaoLogin.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      
    })
  }
    

})

export const {resetPayload} = userSlice.actions;
export default userSlice.reducer;