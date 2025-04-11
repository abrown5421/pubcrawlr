import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Form from "./Form";
import { FormHandle } from "../types/globalTypes";
import { useTheme } from "@emotion/react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { CircularProgress } from "@mui/material";
import { PersonalInfoValidationErrors, PersonalInfoFormData } from '../types/globalTypes';
import { setLoading } from "../store/slices/buttonLoadSlice";
import { setAlert } from "../store/slices/notificationSlice";
import { updateUserData } from "../services/userService";
import { setModal } from "../store/slices/modalSlice";
import { setProfileUser } from "../store/slices/userProfileSlice";

const usePIBStyles = (theme: any) => ({
    saveButton: {
      marginRight: "8px",
      backgroundColor: theme.palette?.custom?.grey,
      color: theme.palette?.custom?.dark,
      "&:hover": {
        backgroundColor: theme.palette?.custom?.light,
        color: theme.palette?.custom?.dark,
      },
    }
});
  
const ProfileInfoBuilder: React.FC = () => {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const styles = usePIBStyles(theme);
    const token = useAppSelector((state) => state.authentication.token);
    const profileFormRef = useRef<FormHandle>(null);
    const isLoading = useAppSelector((state) => state.buttonLoad['saveInfo'] ?? false);
    const userProfile = useAppSelector((state) => state.userProfile);
    const [errors, setErrors] = useState<PersonalInfoValidationErrors>({});
    const [formValues, setFormValues] = useState({
        firstName: "",
        lastName: "",
        email: ""
    });
      
    const handleSubmit = async (data: unknown) => {
        dispatch(setLoading({ key: 'saveInfo', value: true }));
        const extractedData = data as PersonalInfoFormData;
        const validationErrors = validate(extractedData);

        if (Object.keys(validationErrors).length > 0) {
            dispatch(setLoading({ key: 'saveAuth', value: false }));
            setErrors(validationErrors);
            dispatch(setAlert({ open: true, message: 'Please fix the errors before resubmitting', severity: 'error' }));
            dispatch(setLoading({ key: 'saveInfo', value: false }));
            return;
        }

        try {
            if (token) {
                await updateUserData(token, formValues.firstName, formValues.lastName, formValues.email);
                console.log('User updated successfully');
                dispatch(setAlert({ open: true, message: 'Profile Updated Successful!', severity: 'success' }));   
                dispatch(setLoading({ key: 'saveInfo', value: false }));
            }
        } catch (error) {
            console.error('Failed to update user:', error);
            dispatch(setAlert({ open: true, message: 'Failed to update user, pklease try again later.', severity: 'success' }));  
            dispatch(setLoading({ key: 'saveInfo', value: false })); 
        } finally {
            if (token) {
                dispatch(setProfileUser({
                    docId: token,
                    UserEmail: formValues.email ?? '',
                    UserFirstName: formValues.firstName ?? '',
                    UserLastName: formValues.lastName ?? '',
                }));
            }
            dispatch(setModal({
                open: false,
                title: '',
                body: '',
            }))
            dispatch(setLoading({ key: 'saveInfo', value: false }));
        }
    };

    const validate = (data: PersonalInfoFormData): PersonalInfoValidationErrors => {
        const newErrors: PersonalInfoValidationErrors = {};
      
        if (!data.email?.trim()) newErrors.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(data.email)) newErrors.email = "Please enter a valid email";
      
        if (!data.firstName?.trim()) newErrors.firstName = "First name is required";
      
        return newErrors;
    };

    useEffect(() => {
        if (userProfile.profileUser) {
          setFormValues({
            firstName: userProfile.profileUser.UserFirstName || "",
            lastName: userProfile.profileUser.UserLastName || "",
            email: userProfile.profileUser.UserEmail || ""
          });
        }
    }, [userProfile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <Form onSave={handleSubmit} ref={profileFormRef}>
            <TextField
                size="small"
                name="firstName"
                label="First Name"
                variant="outlined"
                value={formValues.firstName}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2, mt: 2 }}
                error={Boolean(errors["firstName"])}
                helperText={errors["firstName"] || ''}
            />
            <TextField
                size="small"
                name="lastName"
                label="Last Name"
                variant="outlined"
                value={formValues.lastName}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
            />
            <TextField
                size="small"
                name="email"
                label="Email"
                variant="outlined"
                value={formValues.email}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
                error={Boolean(errors["email"])}
                helperText={errors["email"] || ''}
            />
            <Button
                type="submit"
                loading={isLoading}
                variant="contained"
                fullWidth
                className="save-crawl-button"
                sx={styles.saveButton}
            >
                {isLoading ? <CircularProgress size="24px" sx={{ color: "#fff" }} /> :  'Save'}
            </Button>
        </Form>
    );
};

export default ProfileInfoBuilder;
