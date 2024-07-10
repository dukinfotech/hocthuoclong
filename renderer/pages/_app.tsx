import React, { useEffect } from "react";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import { NextUIProvider } from "@nextui-org/react";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import { ConfirmPromptProvider } from "../providers/ConfirmPromptProvider";
import { useSettingStore } from "../stores/setting-store";

function MyApp({ Component, pageProps }: AppProps) {
  const loadSettings = useSettingStore((state) => state.loadSettings);

  useEffect(() => {
    window.ipc.invoke("window-ready", true).then(() => {
      window.ipc.on("setting.load", (settings) => {
        loadSettings(settings);
      });
    });
  }, []);

  return (
    <NextUIProvider>
      <ConfirmPromptProvider>
        <div className="bg-gray-200 h-screen p-10 mx-auto">
          <Component {...pageProps} />
        </div>
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
