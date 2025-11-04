import { createListenerMiddleware } from "@reduxjs/toolkit";
import { fetchProducts } from "../slices/productSlice";
import { createTransactionThunk } from "../thunks";

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: createTransactionThunk.fulfilled,
  effect: async (_, listenerApi) => {
    listenerApi.dispatch(fetchProducts());
  },
});
