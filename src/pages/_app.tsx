import React from "react";
import type { AppProps } from "next/app";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { ThemeProvider } from "styled-components";
import { Toaster } from "react-hot-toast";
import GlobalStyle from "../constants/globalStyle";
import { lightTheme, darkTheme } from "../constants/theme";
import useConfig from "../store/useConfig";

const theme = createTheme({
  autoContrast: true,
  fontSmoothing: false,
  respectReducedMotion: true,
  cursorType: "pointer",
  fontFamily:
    'system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
  defaultGradient: {
    from: "#388cdb",
    to: "#0f037f",
    deg: 180,
  },
  primaryShade: 8,
  components: {
    Button: {
      defaultProps: {
        fw: 500,
      },
    },
  },
});

function JsonEditor({ Component, pageProps }: AppProps) {
  const darkmodeEnabled = useConfig(state => state.darkmodeEnabled);

  return (
    <MantineProvider defaultColorScheme={darkmodeEnabled ? "dark" : "light"} theme={theme}>
      <ThemeProvider theme={darkmodeEnabled ? darkTheme : lightTheme}>
        <Toaster
          position="bottom-right"
          containerStyle={{
            bottom: 34,
            right: 8,
            fontSize: 14,
          }}
          toastOptions={{
            style: {
              background: "#4D4D4D",
              color: "#B9BBBE",
              borderRadius: 4,
            },
          }}
        />
        <GlobalStyle />
        <Component {...pageProps} />
      </ThemeProvider>
    </MantineProvider>
  );
}

export default JsonEditor;