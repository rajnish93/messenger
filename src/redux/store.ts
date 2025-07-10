import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import messengerReducer from './messengerSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedMessengerReducer = persistReducer(
  persistConfig,
  messengerReducer
);

export const store = configureStore({
  reducer: {
    messenger: persistedMessengerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
