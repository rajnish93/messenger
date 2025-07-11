import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import messengerReducer from './messengerSlice';

/**
 * Redux store configuration for the messenger app.
 * Uses redux-persist to persist state in local storage.
 */

// Persist Config
const persistConfig = {
  key: 'root',
  storage,
};

// Persisted Reducer
const persistedMessengerReducer = persistReducer(
  persistConfig,
  messengerReducer
);

// Store
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

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
