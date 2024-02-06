import { combineReducers, configureStore } from '@reduxjs/toolkit';
// import userReducer from './userSlice';
import storage from 'redux-persist/lib/storage'
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist';
import userReducer from '../slice/userSlice';

//서로 다른 리듀싱 함수들을 값으로 가지는 객체를 받아서 createStore에 넘길 수 있는 하나의 리듀싱 함수로 변환
const rootReducer = combineReducers({ 
  user: userReducer,
  // stock: stockSlice
})

//redux-persist 설정
const persistConfig = {
  key: 'root', //key 이름
  storage, // localStorage
  //whilelist: [], //여러 reducer 중에 해당 reducer만 localstorage에 저장
  //blacklist: []  //blacklist -> 그것만 제외
}

const pesistedReducer = persistReducer(persistConfig,rootReducer)

export const store = configureStore({
  reducer: pesistedReducer,
  //getDefaultMiddleware: 리덕스 툴킷에서 가지고 있는 기본 미들웨어
  // 기본 미들웨어에서 serializableCheck는 false로
  middleware: getDefaultMiddleware => getDefaultMiddleware({ 
    
    //serializableCheck: false 
    
    serializableCheck:{ 
      //해당 액션만 false
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }

  })
})

export const persistor = persistStore(store)