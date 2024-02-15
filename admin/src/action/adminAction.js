import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axios';

//관리자 로그인 로직
export const loginAdmin = createAsyncThunk(
  "admin/loginAdmin",
  async(body, thunkAPI) => {

    try{

      const response = await axiosInstance.post(
        `/admin/login`,
        body
      )

      return response.data;

    }catch(error){
      console.log(error)
      return thunkAPI.rejectWithValue(error.response.data || error.message);
    }//end catch

  }
)

//관리자 로그인 권한 검사
export const authAdmin = createAsyncThunk(
  "admin/authAdmin",
  async(_, thunkAPI) => {

    try{

      const response = await axiosInstance.get(
        `/admin/auth`
      )

      return response.data;

    }catch(error){
      console.log(error)
      return thunkAPI.rejectWithValue(error.response.data || error.message);
    }//end catch

  }
)

//관리자 로그인 권한 검사
export const logoutAdmin = createAsyncThunk(
  "admin/logutAdmin",
  async(body, thunkAPI) => {

    try{

      const response = await axiosInstance.post(
        `/admin/logout`,
        body
    )

      return response.data;

    }catch(error){
      console.log(error)
      return thunkAPI.rejectWithValue(error.response.data || error.message);
    }//end catch

  }
)

// //즐겨찾기 추가/삭제
// export const bookMark = createAsyncThunk(
//   "user/bookMark",
//   async(body, thunkAPI) => {

//     try{

//       const response = await axiosInstance.post(
//         `/users/bookmark`,
//         body
//     )

//       return response.data;

//     }catch(error){
//       console.log(error)
//       return thunkAPI.rejectWithValue(error.response.data || error.message);
//     }//end catch

//   }
// )

// //카카오 로그인
// export const kakaoLogin = createAsyncThunk(
//   "user/kakaoLogin",
//   async(body, thunkAPI) => {

//     try{

//       const response = await axiosInstance.post(
//         `/users/kakao/login`,
//         body
//     )

//       return response.data;

//     }catch(error){
//       console.log(error)
//       return thunkAPI.rejectWithValue(error.response.data || error.message);
//     }//end catch

//   }
// )



// //카카오 로그인
// export const kakaoAddTel = createAsyncThunk(
//   "user/addTel",
//   async(body, thunkAPI) => {

//     try{

//       const response = await axiosInstance.post(
//         `/users/kakao/addTel`,
//         body
//     )

//       return response.data;

//     }catch(error){
//       console.log(error)
//       return thunkAPI.rejectWithValue(error.response.data || error.message);
//     }//end catch

//   }
// )

// //회원 정보 관리 비밀번호 확인
// export const checkPwd = createAsyncThunk(
//   "user/checkPwd",
//   async(body, thunkAPI) => {

//     try{

//       const response = await axiosInstance.post(
//         `/users/checkPwd`,
//         body
//     )

//       return response.data;

//     }catch(error){
//       console.log(error)
//       return thunkAPI.rejectWithValue(error.response.data || error.message);
//     }//end catch

//   }
// )

// export const updateUser = createAsyncThunk(
//   "user/updateUser",
//   async(body, thunkAPI) => {

//     try{

//       const response = await axiosInstance.post(
//         `/users/updateUser`,
//         body
//       )

//       return response.data;

//     }catch(error){
//       console.log(error);
//       return thunkAPI.rejectWithValue(error.response.data || error.message)
//     }//end catch

//   }
// )

// export const updateKakao = createAsyncThunk(
//   "user/updateKakao",
//   async(body, thunkAPI) => {

//     try{

//       const response = await axiosInstance.post(
//         `/users/updateKakao`,
//         body
//       )

//       return response.data;

//     }catch(error){
//       console.log(error);
//       return thunkAPI.rejectWithValue(error.response.data || error.message)
//     }//end catch

//   }
// )

// export const deleteUser = createAsyncThunk(
//   "user/deleteUser",
//   async(_, thunkAPI) => {

//     try{

//       const response = await axiosInstance.post(
//         `/users/delete`
//       )

//       return response.data;

//     }catch(error){
//       console.log(error);
//       return thunkAPI.rejectWithValue(error.response.data || error.message)
//     }//end catch

//   }
// )
