import { ReactNode } from 'react';
import { Avatar, Box, IconButton, Typography, useTheme } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import '../styles/containers/profile-container.css';
import { setModal } from '../store/slices/modalSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import TrianglifyBanner from '../components/TrianglifyBanner';
import TrianglifyCustomizer from '../components/TrianglifyCustomizer';

const useProfileStyles = (theme: any) => ({
  logo: {
    color: theme.palette.custom?.dark,
    fontFamily: 'Primary',
  },
});

const ProfileContainer = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  const styles = useProfileStyles(theme);
  const token = useAppSelector((state) => state.authentication.token);
  const dispatch = useAppDispatch();

  const handleImageChange = () => {
    dispatch(setModal({
      open: true,
      title: 'Update Your Banner Image',
      body: (
        <TrianglifyCustomizer />
      ),
    }));
  };

  return (
    <Box className="prof-container">
      <div className="profile-container-banner">
        <TrianglifyBanner {...(token ? { token } : {})} />
        <Avatar className="profile-avatar"
          sx={{ backgroundColor: theme.palette.custom?.dark, cursor: "pointer" }}
        >
          AB
        </Avatar>
        <IconButton onClick={handleImageChange} sx={{backgroundColor: theme.palette.custom?.light}} className="profile-banner-upload">
          <EditIcon />
        </IconButton>
      </div>

      <div className='profile-container-content'>
        <div className='profile-sidebar'>
          <Typography variant="h5" fontWeight={700} sx={styles.logo}>User Name Here</Typography>
          <Typography variant="caption">User email Here</Typography>
          <div className="profile-stat-container">
            {['Bar Crawls', 'Groups', 'Friends'].map((label, index) => (
              <div className="profile-stat-column" key={index}>
                <Typography variant="h5" fontWeight={700} sx={styles.logo}>
                  {index === 0 ? '15.8K' : index === 1 ? '8' : '984'}
                </Typography>
                <Typography variant="caption">{label}</Typography>
              </div>
            ))}
          </div>
        </div>
        <div className='profile-content'>
          user profile content here
        </div>
      </div>
    </Box>
  );
};

export default ProfileContainer;
