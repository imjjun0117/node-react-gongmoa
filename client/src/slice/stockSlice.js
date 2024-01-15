import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { stockList } from '../action/stockAction'

const initialState = {
  
  stocks : [],
  search : {
    skip : 0,
    limit : 12,
    keyword: '',
    menuType: ''
  },
  initPage : true,
  isLoading : false,
  hasMore: true
}

const stockSlice = createSlice({

  name: 'stock',
  initialState: initialState,
  reducers: {
    resetStocks : (state) => {
      state.stocks = [];
      state.search = initialState.search;
      state.initPage = true;
      state.isLoading = false;
      state.hasMore = true;
      
    }
  },
  extraReducers: (builder) => {
    builder
    //register 관련
    .addCase(stockList.pending, state => {
      state.isLoading = true;
    })
    .addCase(stockList.fulfilled, (state, action) => {

      if(state.hasMore){

        if (state.initPage) {
  
          // 초기 진입 && 검색
          state.stocks = action.payload.stocks;
          state.search.skip = Number(action.payload.params.skip);
          state.search.limit = Number(action.payload.params.limit);
          state.search.keyword = action.payload.params.keyword;
          state.search.menuType = action.payload.params.menuType;
          state.initPage = false;
          
          if(action.payload.stocks.length < state.limit){
            state.hasMore = false;
          }
  
        } else {
  
          console.log(action.payload.stocks);
          // 기존 데이터에 새로운 데이터를 추가
          state.stocks = state.stocks.concat(action.payload.stocks);
          state.search.skip = Number(action.payload.params.skip);
          state.search.limit = Number(action.payload.params.limit);
          state.search.keyword = action.payload.params.keyword;
          state.search.menuType = action.payload.params.menuType;
          
          state.initPage = false;
  
        }
        
        if(action.payload.stocks.length < state.limit){
          state.hasMore = false;
        }
        
      }
      

      state.isLoading = false;
    })
    .addCase(stockList.rejected, (state, action) => {
      state.isLoading = false;
      toast.error(action.payload);
    })
  }
    

})

export const {resetStocks} = stockSlice.actions;
export default stockSlice.reducer;