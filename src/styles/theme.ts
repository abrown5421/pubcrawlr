import { createTheme, ThemeOptions } from "@mui/material/styles";

// Define a type-safe theme
const themeOptions: ThemeOptions = {
  palette: {
    custom: {
      dark: "#00171f", // Added dark color
      light: "#FFF", // Added white
      accent: "#277a73", // Reused primary color for consistency
      highlight: "#00b2a3", // Reused secondary color
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
    };
  }
  interface PaletteOptions {
    custom?: {
      dark: string;
      light: string;
      accent: string;
      highlight: string;
    };
  }
}

const theme = createTheme(themeOptions);

export default theme;
