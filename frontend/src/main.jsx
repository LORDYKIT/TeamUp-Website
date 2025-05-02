import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { extendTheme } from "@chakra-ui/theme-utils";
import { ColorModeScript } from "@chakra-ui/color-mode";
import { BrowserRouter } from "react-router-dom";
import { PostProvider } from './context/PostContext';
import { FollowProvider } from "./context/FollowContext";
import { UserProvider } from "./context/UserContext.jsx";
import { LikeProvider } from "./context/LikeContext.jsx";
import { RecoilRoot } from "recoil";



const styles = {
  global: (props) => ({
    body: {
      color: mode("gray.800", "whiteAlpha.900")(props),
      bg: mode("#F4F3F2", "#101010")(props),
    },
  }),
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const colors = {
  gray: {
    light: "#616161",
    dark: "#1e1e1e",
  },
};

const theme = extendTheme({ config, styles, colors });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    
    <UserProvider>
    <RecoilRoot>
      <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <PostProvider>
      <LikeProvider>
      <FollowProvider>
          <App /> {/* App is already wrapped with RecoilRoot inside */}
      </FollowProvider>
      </LikeProvider>
      </PostProvider>
      </ChakraProvider>
      </RecoilRoot>
      </UserProvider>
   
    </BrowserRouter>

  </React.StrictMode>
);
