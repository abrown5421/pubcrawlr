import React, { useRef, useState } from 'react';
import { Box, Button, TextField, Typography, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';  
import Form from "../components/Form";
import { FormHandle, AuthProps, ValidationErrors, FormData } from '../types/globalTypes';
import AnimatedContainer from "../containers/AnimatedContainer";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Theme } from "@mui/system";
import theme from "../styles/theme";
import { setActivePage } from '../store/slices/activePageSlice';
import { useNavigate } from 'react-router-dom';
import "../styles/pages/auth.css";
import { setAlert } from '../store/slices/notificationSlice';
import authService from '../services/authService';
import { setAuthToken, setUser } from '../store/slices/authenticationSlice';
import Cookies from 'js-cookie'
import { setLoading } from '../store/slices/buttonLoadSlice';
import { fetchTrianglifyConfig } from '../services/tryianglifyService';
import { setMultipleTrianglifyValues } from '../store/slices/trianglifySlice';

const nestedAnimatedContainerStyles = (theme: Theme) => ({
  authBox: {
    backgroundColor: theme.palette.custom?.light, 
  },
  formTitle: {
    color: theme.palette.custom?.dark,
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

const Auth: React.FC<AuthProps> = ({ mode }) => {
  const enter = useAppSelector(state => state.activePage);
  const isLoading = useAppSelector((state) => state.buttonLoad['saveAuth'] ?? false);
  const styles = nestedAnimatedContainerStyles(theme);
  const customForm = useRef<FormHandle>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [forgotPw, setForgotPw] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  });

  const handleClickShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const validate = (data: FormData, mode: 'login' | 'signup'): ValidationErrors => {
    const newErrors: ValidationErrors = {};
  
    if (!data.email?.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(data.email)) newErrors.email = "Please enter a valid email";
  
    if (mode === 'signup' || (!forgotPw && mode === 'login')) {
      if (!data.password?.trim()) {
        newErrors.password = "Password is required";
      } else if (data.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(data.password)) {
        newErrors.password = "Password must contain at least one uppercase and one lowercase letter";
      }
    }
  
    if (mode === 'signup') {
      if (!data.firstName?.trim()) newErrors.firstName = "First name is required";
      if (!data.confirmPassword?.trim()) newErrors.confirmPassword = "Please confirm your password";
      else if (data.confirmPassword !== data.password) newErrors.confirmPassword = "Passwords do not match";
    }
  
    return newErrors;
  };
  

  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  
    if (errors[field]) {
      setErrors(prevErrors => {
        const { [field]: _, ...rest } = prevErrors;
        return rest;
      });
    }
  };
  
  const handleForgotPassword = async (email: string) => {
    try {
      await authService.sendPasswordResetEmail(email); 
      dispatch(setAlert({ open: true, message: 'If the email you entered matches an account we will send further reset instructions.', severity: 'success' }));
    } catch (err) {
      dispatch(setAlert({ open: true, message: 'Error sending password reset email', severity: 'error' }));
    }
  };

  const handleLogin = async (data: FormData) => {
    dispatch(setLoading({ key: 'saveAuth', value: true }));
    try {
      const user = await authService.login(data.email, data.password);
  
      if (!user) {
        throw new Error("User not found");
      }
      
      dispatch(setLoading({ key: 'saveAuth', value: false }));
      dispatch(setUser({
        docId: user.docId,
        UserEmail: user.UserEmail,
        UserFirstName: user.UserFirstName,
        UserLastName: user.UserLastName,
      }));

      const trianglifyData = await fetchTrianglifyConfig(user.docId);
      if (trianglifyData) {
        dispatch(setMultipleTrianglifyValues(trianglifyData));
      } else {
        console.log("No trianglify config found for this user.");
      }
  
      Cookies.set('authId', user.docId, { expires: 5 });
      dispatch(setAuthToken(user.docId));

      dispatch(setActivePage({ key: "In", value: false }));
      dispatch(setActivePage({ key: "Name", value: 'Dashboard' }));
  
      setTimeout(() => {
        dispatch(setActivePage({ key: "In", value: true }));
        navigate('/');
      }, 500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        dispatch(setAlert({ open: true, message: "Login failed: " + err.message, severity: 'error' }));
        dispatch(setLoading({ key: 'saveAuth', value: false }));
      } else {
        dispatch(setAlert({ open: true, message: 'Login failed', severity: 'error' }));
        dispatch(setLoading({ key: 'saveAuth', value: false }));
      }
    }
  };
  
  
  const handleRegister = async (data: FormData) => {
    dispatch(setLoading({ key: 'saveAuth', value: true }));
    try {
      const user = await authService.register(
        data.email,
        data.password,
        data.firstName,
        data.lastName!
      );
      if (!user) {
        throw new Error("User not found");
      }
  
      dispatch(setLoading({ key: 'saveAuth', value: false }));
      dispatch(setUser({
        docId: user.docId,
        UserEmail: user.UserEmail,
        UserFirstName: user.UserFirstName,
        UserLastName: user.UserLastName,
      }));

      Cookies.set('authId', user.docId, { expires: 5 });
      dispatch(setAuthToken(user.docId));

      dispatch(setActivePage({ key: "In", value: false }));
      dispatch(setActivePage({ key: "Name", value: 'Root' }));
  
      setTimeout(() => {
        dispatch(setActivePage({ key: "In", value: true }));
        navigate('/');
      }, 500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setForgotPw(false)
        dispatch(setAlert({open: true, message: "Registration failed: " + err.message, severity: 'error',}))
        dispatch(setLoading({ key: 'saveAuth', value: false }));
      } else {
        dispatch(setAlert({open: true, message: 'Registration failed', severity: 'error',}))
        dispatch(setLoading({ key: 'saveAuth', value: false }));
      }
    }
  };
  

  const handleSubmit = (data: unknown) => {
    const extractedData = data as FormData;
    const validationErrors = validate(extractedData, mode);
  
    if (Object.keys(validationErrors).length > 0) {
      dispatch(setLoading({ key: 'saveAuth', value: false }));
      setErrors(validationErrors);
      dispatch(setAlert({ open: true, message: 'Please fix the errors before resubmitting', severity: 'error' }));
      return;
    }
  
    if (mode === 'login' && forgotPw) {
      handleForgotPassword(extractedData.email);
    } else if (mode === 'login') {
      handleLogin(extractedData);
    } else {
      handleRegister(extractedData);
    }
    setFormData({ email: '', password: '', firstName: '', lastName: '', confirmPassword: '' });
    setErrors({});
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
  ) => (
    <TextField 
      size="small"
      name={name}
      label={label}
      type={type}
      variant="outlined"
      fullWidth
      value={formData[name]}
      onChange={handleChange(name)}
      sx={{ mb: 2 }}
      error={Boolean(errors[name])}
      helperText={errors[name] || ''}
      InputProps={name === 'password' || name === 'confirmPassword' ? {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      } : {}}
    />
  );

  return (
    <AnimatedContainer entry="animate__slideInUp" exit="animate__slideOutDown" isEntering={enter.In && enter.Name === 'Auth'} sx={{height: '100%'}}>
      <Box className="auth-box" sx={styles.authBox}>
        <Typography className="auth-title" sx={styles.formTitle} variant="h5">{mode === 'login' ? forgotPw ? "Reset Password" : 'Login' : 'Signup'}</Typography>
        <Form onSave={handleSubmit} ref={customForm}>
          {mode === 'signup' && renderInputField('firstName', 'First Name', 'text')}
          {mode === 'signup' && renderInputField('lastName', 'Last Name')}
          {renderInputField('email', 'Email', 'text')}
          {!forgotPw && renderInputField('password', 'Password', showPassword ? 'text' : 'password')}
          {mode === 'signup' && renderInputField('confirmPassword', 'Confirm Password', showPassword ? 'text' : 'password')}
          {mode === 'login' && (
            <Button 
              variant="text" 
              size="small" 
              className="forgot-pw-button"
              sx={{ 
                color: theme.palette.custom?.accent,                
              }} 
              onClick={() => setForgotPw(prev => !prev)}
            >
              {forgotPw ? "Back to Login" : "Forgot Password?"}
            </Button>
          )}
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={styles.button}
            className="auth-button"
          >
            {mode === 'login' ? forgotPw ? "Reset Password" : (isLoading ? <CircularProgress size="24px" sx={{ color: theme.palette.custom?.light }} /> :  'Login') : (isLoading ? <CircularProgress size="24px" sx={{ color: theme.palette.custom?.light }} /> : 'Sign Up')}
          </Button>
        </Form>

        <Button 
          variant="text" 
          onClick={() => toggleMode(mode === 'login' ? "/Signup" : "/Login", "Auth")} 
          sx={{ mt: 2, color: theme.palette.custom?.dark }}
        >
          {mode === 'login' ? "Don't have an account? Sign up" : "Have an account? Login"}
        </Button>
      </Box>
    </AnimatedContainer>
  );
};

export default Auth;
