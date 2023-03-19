import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import { userReducer } from "./reducers";

//This is redux store, here we are telling redux that, 
//"these are some actions that we are going to use through out our application please take care of them"

const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({
  userReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
  });

  export const persistor = persistStore(store)