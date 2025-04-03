import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import AnimatedContainer from "../containers/AnimatedContainer";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { style, Theme } from "@mui/system";
import theme from "../styles/theme";
import { setActivePage } from '../store/slices/activePageSlice';
import { useNavigate } from 'react-router-dom';

type AuthProps = {
  mode: 'login' | 'signup';
};

const nestedAnimatedContainerStyles = (theme: Theme) => ({
  authBox: {
    backgroundColor: theme.palette.custom?.light,
    width: '50%',
    maxWidth: '400px',
    padding: theme.spacing(3),
    borderRadius: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    [theme.breakpoints.down('sm')]: {
      width: '90%',
      padding: theme.spacing(2),
    },
  },
  formTitle: {
    color: theme.palette.custom?.dark,
    fontWeight: "bold",
    cursor: "pointer",
    fontFamily: "Primary, sans-serif",
    marginBottom: '13px'
  },
  button: {
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

const Auth: React.FC<AuthProps> = ({ mode }) => {
  const enter = useAppSelector(state => state.activePage);
  const styles = nestedAnimatedContainerStyles(theme);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password, firstName, lastName, confirmPassword });
  };

  const toggleMode = (x: string, y: string) => {
    dispatch(setActivePage({ key: "In", value: false }));
    dispatch(setActivePage({ key: "Name", value: y }));
    setTimeout(() => {
      dispatch(setActivePage({ key: "In", value: true }));
      navigate(x);
    }, 500)
  };

  return (
    <AnimatedContainer entry="animate__slideInUp" exit="animate__slideOutDown" isEntering={enter.In && enter.Name === 'Auth'}>
      <Box sx={styles.authBox}>
        <Typography sx={styles.formTitle} variant="h4">{mode === 'login' ? 'Login' : 'Signup'}</Typography>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {mode === 'signup' && (
            <TextField 
              size="small"
              label="First Name"
              variant="outlined"
              fullWidth
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}

          {mode === 'signup' && (
            <TextField 
              size="small"
              label="Last Name"
              variant="outlined"
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}

          <TextField 
            size="small"
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField 
            size="small"
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />

          {mode === 'signup' && (
            <TextField 
              size="small"
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
          )}

          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={styles.button}
          >
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </Button>
        </form>

        {mode === 'login' ? (
            <Button 
              variant="text" 
              onClick={() => toggleMode("/signup", "Auth")} 
              sx={{ mt: 2, color: theme.palette.custom?.dark }}
            >
             Don't have an account? Sign up
            </Button>
        ) : (
          <Button 
            variant="text" 
            onClick={() => toggleMode("/Login", "Auth")} 
            sx={{ mt: 2, color: theme.palette.custom?.dark }}
          >
           Have an account? Login
          </Button>
        )}
      </Box>
    </AnimatedContainer>
  );
};

export default Auth;
