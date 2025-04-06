import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { setActivePage } from "../store/slices/activePageSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearUser, User } from "../store/slices/authenticationSlice";
import '../styles/navbar.css';
import Cookies from 'js-cookie'
import { useLocation } from "react-router-dom";

export interface UserState {
  isAuthenticated: boolean;
  user: User | null;
}

const useNavbarStyles = (theme: any) => ({
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
  const location = useLocation();
  const theme = useTheme();
  const styles = useNavbarStyles(theme);
  const user = useAppSelector((state: { authentication: UserState }) => state.authentication);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleNavClick = (path: string, pageName: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    dispatch(setActivePage({ key: "In", value: false }));
    dispatch(setActivePage({ key: "Name", value: pageName }));

    setTimeout(() => {
      dispatch(setActivePage({ key: "In", value: true }));
      navigate(path);
    }, 500);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    Cookies.remove('authId');
  
    dispatch(setActivePage({ key: "In", value: false }));
    dispatch(setActivePage({ key: "Name", value: "Root" }));
  
    setTimeout(() => {
      dispatch(setActivePage({ key: "In", value: true }));
      navigate("/");
    }, 500);
  
    dispatch(clearUser());
    handleMenuClose(); 
  };
  

  return (
    <AppBar position="static" sx={styles.appBar} className="nav-appBar">
      <Toolbar className="nav-toolbar" disableGutters sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          variant="h4"
          className="nav-logo"
          component="div"
          fontWeight={700}
          sx={styles.logo}
          onClick={handleNavClick("/", "Root")}
        >
          Pubcrawlr
        </Typography>

        {user?.isAuthenticated && (
          <Box display="flex" alignItems="center">
            <Avatar
              className="nav-avatar"
              sx={{ backgroundColor: theme.palette.custom?.dark }}
              onClick={handleMenuClick}
            >
              {user.user?.UserFirstName.charAt(0)}{user.user?.UserLastName.charAt(0)}
            </Avatar>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom', 
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              sx={{
                mt: '12px', 
              }}
            >
              <MenuItem onClick={handleNavClick("/Dashboard", "Dashboard")}>
                Dashboard
              </MenuItem>
              <MenuItem onClick={handleNavClick("/", "Root")}>
                Create a Crawl
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}

        {!user?.isAuthenticated && location.pathname !== "/Login" && location.pathname !== "/signup" && (
          <Box>
            <Button
              className="nav-button"
              variant="contained"
              sx={styles.button}
              onClick={handleNavClick("/Login", "Auth")}
            >
              Login
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
