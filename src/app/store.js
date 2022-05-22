import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore, FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage'

// Slices
import userSlice from '../features/user/userSlice'

const rootReducer = combineReducers({
  user: userSlice,
})

// persist config obj
// whitelist a store attribute using it's reducer name. Whitelisted attributes will persist. (I did not find a way to whitelist specific values)
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['user'], //whitelisting a store attribute name, will persist that store attribute.
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  // middleware option needs to be provided for avoiding the error. ref: https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)
export default store
