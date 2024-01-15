import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axios';


//사용자 회원가입 로직
export const stockList = createAsyncThunk(
  "stocks/stockList",
  async(params, thunkAPI) => {

    try{

      const response = await axiosInstance.get(
        `/stocks`,
        {params}
      )

      return response.data;

    }catch(error){
      console.log(error);
      return thunkAPI.rejectWithValue(error.response.data || error.message)
    }//end catch

  }
)
