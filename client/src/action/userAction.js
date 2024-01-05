import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axios';


//사용자 회원가입 로직
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async(body, thunkAPI) => {

    try{

      const response = await axiosInstance.post(
        `/users/register`,
        body
      )

      return response.data;

    }catch(error){
      console.log(error);
      return thunkAPI.rejectWithValue(error.response.data || error.message)
    }//end catch

  }
)

//사용자 로그인 로직
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async(body, thunkAPI) => {

    try{

      const response = await axiosInstance.post(
        `/users/login`,
        body
      )

      return response.data;

    }catch(error){
      console.log(error)
      return thunkAPI.rejectWithValue(error.response.data || error.message);
    }//end catch

  }
)

//사용자 로그인 권한 검사
export const authUser = createAsyncThunk(
  "user/authUser",
  async(_, thunkAPI) => {

    try{

      const response = await axiosInstance.get(
        `/users/auth`
      )

      return response.data;

    }catch(error){
      console.log(error)
      return thunkAPI.rejectWithValue(error.response.data || error.message);
    }//end catch

  }
)

//사용자 로그인 권한 검사
export const logoutUser = createAsyncThunk(
  "user/logutUser",
  async(body, thunkAPI) => {

    try{

      const response = await axiosInstance.post(
        `/users/logout`,
        body
    )

      return response.data;

    }catch(error){
      console.log(error)
      return thunkAPI.rejectWithValue(error.response.data || error.message);
    }//end catch

  }
)

//즐겨찾기 추가/삭제
export const bookMark = createAsyncThunk(
  "user/bookMark",
  async(body, thunkAPI) => {

    try{

      const response = await axiosInstance.post(
        `/users/bookmark`,
        body
    )

      return response.data;

    }catch(error){
      console.log(error)
      return thunkAPI.rejectWithValue(error.response.data || error.message);
    }//end catch

  }
)

//카카오 로그인
export const kakaoLogin = createAsyncThunk(
  "user/kakaoLogin",
  async(body, thunkAPI) => {

    try{

      const response = await axiosInstance.post(
        `/users/kakao/login`,
        body
    )

      return response.data;

    }catch(error){
      console.log(error)
      return thunkAPI.rejectWithValue(error.response.data || error.message);
    }//end catch

  }
)



//카카오 로그인
export const kakaoAddTel = createAsyncThunk(
  "user/addTel",
  async(body, thunkAPI) => {

    try{

      const response = await axiosInstance.post(
        `/users/kakao/addTel`,
        body
    )

      return response.data;

    }catch(error){
      console.log(error)
      return thunkAPI.rejectWithValue(error.response.data || error.message);
    }//end catch

  }
)