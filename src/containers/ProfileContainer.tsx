import { ReactNode } from 'react';
import { Avatar, Box, Typography, useTheme } from '@mui/material';
import placeholder from '../../public/assets/images/banner-placeholder.png';
import '../styles/containers/profile-container.css'

const useProfileStyles = (theme: any) => ({
    logo: {
      color: theme.palette.custom?.dark,
      fontFamily: "Primary",
    },
});

const ProfileContainer = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  const styles = useProfileStyles(theme);
  
  return (
    <Box className="prof-container">
        <div className="profile-container-banner">
            <img src={placeholder} className="banner-image" />
            <Avatar className="profile-avatar"
                sx={{ backgroundColor: theme.palette.custom?.dark, cursor: "pointer" }}
            >
                AB
            </Avatar>
        </div>
        <div className='profile-container-content'>
            <div className='profile-sidebar'>
                <Typography
                    variant="h5"
                    component="div"
                    fontWeight={700}
                    sx={styles.logo}
                >
                    User Name Here
                </Typography>
                <Typography
                    variant="caption"
                    component="div"
                >
                    User email Here
                </Typography>
                <div className="profile-stat-container">
                    <div className="profile-stat-column">
                        <Typography
                            variant="h5"
                            component="div"
                            fontWeight={700}
                            sx={styles.logo}
                        >
                            15.8K
                        </Typography>
                        <Typography
                            variant="caption"
                            component="div"
                        >
                            Bar Crawls
                        </Typography>
                    </div>
                    <div className="profile-stat-column">
                        <Typography
                            variant="h5"
                            component="div"
                            fontWeight={700}
                            sx={styles.logo}
                        >
                            8
                        </Typography>
                        <Typography
                            variant="caption"
                            component="div"
                        >
                            groups
                        </Typography>
                    </div>
                    <div className="profile-stat-column">
                        <Typography
                            variant="h5"
                            component="div"
                            fontWeight={700}
                            sx={styles.logo}
                        >
                            984
                        </Typography>
                        <Typography
                            variant="caption"
                            component="div"
                        >
                            Friends
                        </Typography>
                    </div>
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
