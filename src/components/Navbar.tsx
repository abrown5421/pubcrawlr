import React from "react"; 
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { SxProps, Theme } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const useNavbarStyles = (theme: Theme) => ({
  appBar: {
    backgroundColor: "white",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0px 13px",
  },
  logo: {
    color: "black",
    fontWeight: "bold",
    cursor: "pointer",
    fontFamily: "Primary, sans-serif",
  },
  button: {
    mx: 1,
    borderRadius: "9999px",
    padding: "6px 20px",
    textTransform: "none",
    backgroundColor: theme.palette.custom?.dark, // Dark background
    color: theme.palette.custom?.light, // White text
    border: `2px solid ${theme.palette.custom?.dark}`, // Border with dark color
    "&:hover": {
      backgroundColor: theme.palette.custom?.light, // White background
      color: theme.palette.custom?.dark, // Dark text
    },
  },
});

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const styles = useNavbarStyles(theme);

  const handleNavClick = (x: string) => (event: React.MouseEvent) => {
    event.preventDefault(); 
    navigate(x);
  };

  return (
    <AppBar position="static" sx={styles.appBar}>
      <Toolbar disableGutters sx={styles.toolbar}>
        <Typography
          variant="h4"
          component="div"
          sx={styles.logo}
          onClick={handleNavClick("/")} 
        >
          Pubcrawlr
        </Typography>

        <Box>
          <Button
            variant="contained"
            sx={styles.button}
            onClick={handleNavClick("/Login")} 
          >
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
