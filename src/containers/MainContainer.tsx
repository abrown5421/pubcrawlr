import { ReactNode } from 'react';
import { Box } from '@mui/material';
import { Theme } from "@mui/system";
import Navbar from '../components/Navbar';
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../styles/theme";

const useMainContainerStyles = (theme: Theme) => ({
  root: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  main: {
    flex: 1,
    overflow: "auto",
    backgroundColor: theme.palette.custom?.dark
  },
});

const MainContainer = ({ children }: { children: ReactNode }) => {
  const styles = useMainContainerStyles(theme);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={styles.root}>
        <Navbar />
        <Box sx={styles.main}>{children}</Box>
      </Box>
    </ThemeProvider>
  );
};

export default MainContainer;
