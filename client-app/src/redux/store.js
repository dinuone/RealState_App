import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import {persistReducer, persistStore} from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const rootreducer = combineReducers({user:userReducer})

const persistConfig = {
  key:'root',
  storage,
  version:1,
}

const presistedReducer = persistReducer(persistConfig, rootreducer)

export const store = configureStore({
  reducer: presistedReducer,

  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck:false,
  }),
})


export const persistore = persistStore(store)


