import React from "react"; 
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { style, Theme } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { setActivePage } from "../store/slices/activePageSlice";
import { useAppDispatch } from "../store/hooks";
import '../styles/navbar.css';

const useNavbarStyles = (theme: Theme) => ({
  appBar: {
    backgroundColor: theme.palette.custom?.light,
  },
  logo: {
    color: theme.palette.custom?.dark,
    fontFamily: "Primary", 
  },
  button: {
    backgroundColor: theme.palette.custom?.dark,
    color: theme.palette.custom?.light,
    "&:hover": {
      backgroundColor: theme.palette.custom?.light,
      color: theme.palette.custom?.dark,
    },
  },
});

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const styles = useNavbarStyles(theme);

  const handleNavClick = (x: string, y: string) => (event: React.MouseEvent) => {
    event.preventDefault(); 
    dispatch(setActivePage({ key: "In", value: false }));
    dispatch(setActivePage({ key: "Name", value: y }));
    setTimeout(() => {
      dispatch(setActivePage({ key: "In", value: true }));
      navigate(x);
    }, 500)
    
  };

  return (
    <AppBar position="static" className="nav-appBar" sx={styles.appBar}>
      <Toolbar disableGutters className="nav-toolbar">
        <Typography
          variant="h4"
          component="div"
          fontWeight={700}
          sx={styles.logo}
          className="nav-logo"
          onClick={handleNavClick("/", "Root")} 
        >
          Pubcrawlr
        </Typography>

        <Box>
          <Button
            variant="contained"
            className="nav-button"
            sx={styles.button}
            onClick={handleNavClick("/Login", "Auth")} 
          >
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
