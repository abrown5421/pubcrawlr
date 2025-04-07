import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setActivePage } from "../store/slices/activePageSlice";
import { clearUser, User } from "../store/slices/authenticationSlice";
import Cookies from "js-cookie";
import "../styles/navbar.css";

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
  drawerContent: {
    width: 250,
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-between',
  },
  logoutButton: {
    backgroundColor: theme.palette.custom?.dark,
    color: theme.palette.custom?.light,
    "&:hover": {
      backgroundColor: theme.palette.custom?.light,
      color: theme.palette.custom?.dark,
    },
    marginTop: theme.spacing(2),
  },
});

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const theme = useTheme();
  const styles = useNavbarStyles(theme);

  const user = useAppSelector((state: { authentication: UserState }) => state.authentication);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNavClick = (path: string, pageName: string) => () => {
    dispatch(setActivePage({ key: "In", value: false }));
    dispatch(setActivePage({ key: "Name", value: pageName }));

    setTimeout(() => {
      dispatch(setActivePage({ key: "In", value: true }));
      navigate(path);
    }, 500);

    setDrawerOpen(false);
  };

  const handleLogout = () => {
    Cookies.remove("authId");
    dispatch(clearUser());
    dispatch(setActivePage({ key: "In", value: false }));
    dispatch(setActivePage({ key: "Name", value: "Root" }));

    setTimeout(() => {
      dispatch(setActivePage({ key: "In", value: true }));
      navigate("/");
    }, 500);

    setDrawerOpen(false);
  };

  const getFullName = () => {
    if (!user.user) return "";
    const { UserFirstName, UserLastName } = user.user;
    return `${UserFirstName}${UserLastName ? " " + UserLastName : ""}`;
  };

  return (
    <>
      <AppBar position="static" sx={styles.appBar} className="nav-appBar">
        <Toolbar className="nav-toolbar" disableGutters sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
                sx={{ backgroundColor: theme.palette.custom?.dark, cursor: "pointer" }}
                onClick={() => setDrawerOpen(true)}
              >
                {user.user?.UserFirstName.charAt(0)}
                {user.user?.UserLastName?.charAt(0)}
              </Avatar>
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

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={styles.drawerContent}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Welcome, {getFullName()}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={handleNavClick("/Dashboard", "Dashboard")}>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={handleNavClick("/", "Root")}>
                  <ListItemText primary="Create a Crawl" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>

          <Box>
            <Divider sx={{ mt: 2 }} />
            <Button fullWidth variant="contained" sx={styles.logoutButton} onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
