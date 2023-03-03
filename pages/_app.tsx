import "../styles/globals.css";
import React from "react";
import { MyChatGPTProvider } from "../contexts/MyChatGPTContext";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <MyChatGPTProvider>
      <Component {...pageProps} />;
    </MyChatGPTProvider>
  );
}
