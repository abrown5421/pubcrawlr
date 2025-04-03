import React, { useRef, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import Form, { type FormHandle } from "../components/Form";
import AnimatedContainer from "../containers/AnimatedContainer";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { style, Theme } from "@mui/system";
import theme from "../styles/theme";
import { setActivePage } from '../store/slices/activePageSlice';
import { useNavigate } from 'react-router-dom';

type AuthProps = {
  mode: 'login' | 'signup';
};

type FormData = {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
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
  const customForm = useRef<FormHandle>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  });

  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (data: unknown) => {
    const extractedData = data as FormData;
    console.log(extractedData);
    setFormData({ email: '', password: '', firstName: '', lastName: '', confirmPassword: '' });
    customForm.current?.clear();
  };

  const toggleMode = (x: string, y: string) => {
    dispatch(setActivePage({ key: "In", value: false }));
    dispatch(setActivePage({ key: "Name", value: y }));
    setTimeout(() => {
      dispatch(setActivePage({ key: "In", value: true }));
      navigate(x);
    }, 500);
  };

  const renderInputField = (
    name: keyof FormData, 
    label: string, 
    type: string = 'text', 
    required: boolean = false
  ) => (
    <TextField 
      size="small"
      name={name}
      label={label}
      type={type}
      variant="outlined"
      fullWidth
      required={required}
      value={formData[name]}
      onChange={handleChange(name)}
      sx={{ mb: 2 }}
    />
  );

  return (
    <AnimatedContainer entry="animate__slideInUp" exit="animate__slideOutDown" isEntering={enter.In && enter.Name === 'Auth'}>
      <Box sx={styles.authBox}>
        <Typography sx={styles.formTitle} variant="h4">{mode === 'login' ? 'Login' : 'Signup'}</Typography>
        <Form onSave={handleSubmit} ref={customForm}>
          {mode === 'signup' && renderInputField('firstName', 'First Name', 'text', true)}
          {mode === 'signup' && renderInputField('lastName', 'Last Name')}
          {renderInputField('email', 'Email', 'email', true)}
          {renderInputField('password', 'Password', 'password', true)}
          {mode === 'signup' && renderInputField('confirmPassword', 'Confirm Password', 'password', true)}

          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={styles.button}
          >
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </Button>
        </Form>

        <Button 
          variant="text" 
          onClick={() => toggleMode(mode === 'login' ? "/signup" : "/Login", "Auth")} 
          sx={{ mt: 2, color: theme.palette.custom?.dark }}
        >
          {mode === 'login' ? "Don't have an account? Sign up" : "Have an account? Login"}
        </Button>
      </Box>
    </AnimatedContainer>
  );
};

export default Auth;
