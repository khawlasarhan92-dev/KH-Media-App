// Redux store configuration and root reducer setup
import { configureStore ,combineReducers } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import  postSlice  from './postSlice'
import chatSlice from './chatSlice';
import notificationsSlice from './notificationsSlice';
import userSlice from './userSlice';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
}
const rootReducer = combineReducers({
  // Add your reducers here
  auth:authSlice,
  posts: postSlice,
  chat: chatSlice,
  notifications: notificationsSlice,
  user: userSlice,

});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

