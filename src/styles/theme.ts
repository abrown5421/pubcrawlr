import { createTheme, ThemeOptions } from "@mui/material/styles";

const themeOptions: ThemeOptions = {
  palette: {
    custom: {
      dark: "#00171f", 
      light: "#FFF", 
      accent: "#0090c9", 
      highlight: "#00c3ff", 
      error: "#cc0000",
    },
  },
};

declare module "@mui/material/styles" {
  interface Palette {
    custom?: {
      dark: string;
      light: string;
      accent: string;
      highlight: string;
      error: string;
    };
  }
  interface PaletteOptions {
    custom?: {
      dark: string;
      light: string;
      accent: string;
      highlight: string;
      error: string;
    };
  }
}

const theme = createTheme(themeOptions);

export default theme;
