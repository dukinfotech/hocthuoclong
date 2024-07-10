import React from "react";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import { NextUIProvider } from "@nextui-org/react";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import { ConfirmPromptProvider } from "../providers/ConfirmPromptProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <ConfirmPromptProvider>
        <Component {...pageProps} />
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </ConfirmPromptProvider>
    </NextUIProvider>
  );
}

export default MyApp;
