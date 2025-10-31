import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import productReducer from "./slices/productSlice";
import paymentReducer from "./slices/paymentSlice";

const themeReducerPersistConfig = {
  key: "theme",
  storage,
};

const productPersistConfig = {
  key: "product",
  storage,
};

const paymentPersistConfig = {
  key: "payment",
  storage,
  // Solo persistir datos sensibles de pagos
  whitelist: ["transactions"],
};

export const store = configureStore({
  reducer: {
    theme: persistReducer(themeReducerPersistConfig, themeReducer),
    product: persistReducer(productPersistConfig, productReducer),
    payment: persistReducer(paymentPersistConfig, paymentReducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
