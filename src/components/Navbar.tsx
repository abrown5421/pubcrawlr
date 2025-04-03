import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { SxProps, Theme } from "@mui/system";

const styles: Record<string, SxProps<Theme>> = {
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
  },
};

const Navbar: React.FC = () => {
  return (
    <AppBar position="static" sx={styles.appBar}>
      <Toolbar disableGutters sx={styles.toolbar}>
        <Typography variant="h4" component="div" sx={styles.logo}>
          Pubcrawlr
        </Typography>

        <Box>
          <Button color="primary" variant="outlined" sx={styles.button}>
            Login
          </Button>
          <Button color="primary" variant="contained" sx={styles.button}>
            Sign Up
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
