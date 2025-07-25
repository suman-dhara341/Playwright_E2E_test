import CssBaseline from "@mui/material/CssBaseline";
import RouteHolder from "./router/routeHolder.tsx";
import theme from "./modules/global/css/miuiExtendTheme.tsx";
import { ThemeProvider } from "@mui/material";
// import NotificationListener from "./modules/global/components/NotificationListener.tsx";
import { useEffect } from "react";
import {
  listenForMessages,
  requestPermission,
} from "./firebase/NotificationService.ts";

const App = () => {
  useEffect(() => {
    requestPermission();
    listenForMessages();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* <NotificationListener /> */}
      <RouteHolder />
    </ThemeProvider>
  );
};
export default App;
