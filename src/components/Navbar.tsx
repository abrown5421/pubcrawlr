import React from "react"; 
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Theme } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const useNavbarStyles = (theme: Theme) => ({
  appBar: {
    backgroundColor: "white",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
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
    backgroundColor: theme.palette.custom?.dark,
    color: theme.palette.custom?.light,
    border: `2px solid ${theme.palette.custom?.dark}`,
    "&:hover": {
      backgroundColor: theme.palette.custom?.light,
      color: theme.palette.custom?.dark,
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
