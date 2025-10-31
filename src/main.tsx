import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { initializeTheme } from "./store/themeSlice";
import { PersistGate } from "redux-persist/integration/react";

store.dispatch(initializeTheme());

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
