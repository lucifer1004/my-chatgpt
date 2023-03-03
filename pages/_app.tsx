import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "next-themes";
import React from "react";
import { MyChatGPTProvider } from "../contexts/MyChatGPTContext";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <MyChatGPTProvider>
        <Component {...pageProps} />
        <Analytics />
      </MyChatGPTProvider>
    </ThemeProvider>
  );
}
