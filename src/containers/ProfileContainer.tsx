import { ReactNode, useEffect } from 'react';
import { Avatar, Box, CircularProgress, IconButton, Typography, useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import '../styles/containers/profile-container.css';
import { setModal } from '../store/slices/modalSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import TrianglifyBanner from '../components/TrianglifyBanner';
import TrianglifyCustomizer from '../components/TrianglifyCustomizer';
import { useParams } from 'react-router-dom';
import { getUserDataFromId } from '../services/userService';
import { setProfileUser } from '../store/slices/userProfileSlice';
import { setMultipleTrianglifyValues } from '../store/slices/trianglifySlice';
import { setLoading } from '../store/slices/buttonLoadSlice';
import { fetchTrianglifyConfig } from '../services/tryianglifyService';
import ProfileInfoBuilder from '../components/ProfileInfoBuilder';

const useProfileStyles = (theme: any) => ({
  logo: {
    color: theme.palette.custom?.dark,
    fontFamily: 'Primary',
  },
});

const ProfileContainer = ({ children, mode }: { children: ReactNode, mode?: "personal" | "stranger" | "friend" }) => {
  const theme = useTheme();
  const styles = useProfileStyles(theme);
  const token = useAppSelector((state) => state.authentication.token);
  const userProfile = useAppSelector((state) => state.userProfile);
  const isLoading = useAppSelector((state) => state.buttonLoad['mainApp'] ?? false);
  const dispatch = useAppDispatch();
  const { slug } = useParams();

  const fetchTrianglifyData = async (uid: string) => {
    const trianglifyData = await fetchTrianglifyConfig(uid);
    if (trianglifyData) {
      dispatch(setMultipleTrianglifyValues(trianglifyData));
      console.log(trianglifyData);
    } else {
      console.log("No trianglify config found for this user.");
    }
  };

  const fetchUserData = async (uid: string) => {
    const userData = await getUserDataFromId(uid);
    dispatch(setProfileUser({
      docId: uid,
      UserEmail: userData?.UserEmail ?? '',
      UserFirstName: userData?.UserFirstName ?? '',
      UserLastName: userData?.UserLastName ?? '',
    }));
  }
  
  const handleImageChange = () => {
    dispatch(setModal({
      open: true,
      title: 'Update Your Banner Image',
      body: (
        <TrianglifyCustomizer />
      ),
    }));
  };

  const handleInfoChange = () => {
    dispatch(setModal({
      open: true,
      title: 'Update Your Profile Info',
      body: (
        <ProfileInfoBuilder />
      ),
    }));
  }

  useEffect(() => {
    dispatch(setLoading({ key: 'profilePage', value: true }));
    if (slug) {
      fetchUserData(slug);
      fetchTrianglifyData(slug);
      setTimeout(() => {
        dispatch(setLoading({ key: 'profilePage', value: false }));
      }, 1000)
    } else {
      dispatch(setLoading({ key: 'profilePage', value: true }));
      setTimeout(() => {
        dispatch(setLoading({ key: 'profilePage', value: false }));
      }, 1000)
    }

  }, [slug]);

  useEffect(()=>{console.log(userProfile)}, [userProfile])
  return (
    <Box className="prof-container">
      {isLoading ?
        <CircularProgress size="24px" sx={{ color: "#FFF" }} />
       : (
        <>
          <div className="profile-container-banner">
            <TrianglifyBanner {...(token ? { token } : {})} />
            <Avatar className="profile-avatar"
              sx={{ backgroundColor: theme.palette.custom?.dark, cursor: "pointer" }}
            >
              {userProfile.profileUser?.UserFirstName.charAt(0)} {userProfile.profileUser?.UserLastName.charAt(0)}
            </Avatar>
            {mode === "personal" &&  
              <IconButton onClick={handleImageChange} sx={{backgroundColor: theme.palette.custom?.light}} className="profile-banner-upload">
                <EditIcon />
              </IconButton>
            }
          </div>

          <div className='profile-container-content'>
            <div className='profile-sidebar'>
              {mode === "personal" &&  
                <IconButton onClick={handleInfoChange} sx={{backgroundColor: theme.palette.custom?.light}} className="profile-info-edit">
                  <EditIcon />
                </IconButton>
              }
              <Typography variant="h5" fontWeight={700} sx={styles.logo}>
                {userProfile.profileUser?.UserFirstName} {userProfile.profileUser?.UserLastName}
              </Typography>
              <Typography variant="caption"> {userProfile.profileUser?.UserEmail}</Typography>
              <div className="profile-stat-container">
                {['Bar Crawls', 'Groups', 'Friends'].map((label, index) => (
                  <div className="profile-stat-column" key={index}>
                    <Typography variant="h5" fontWeight={700} sx={styles.logo}>
                      0
                    </Typography>
                    <Typography variant="caption">{label}</Typography>
                  </div>
                ))}
              </div>
            </div>
            <div className='profile-content'>
              {children}
            </div>
          </div>
        </>
      )}
    </Box>
  );
};

export default ProfileContainer;
