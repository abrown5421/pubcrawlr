import { ReactNode, useEffect, useState } from 'react';
import { Avatar, Box, CircularProgress, IconButton, Typography, useTheme, Button, Stack } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import EditIcon from '@mui/icons-material/Edit';
import '../styles/containers/profile-container.css';
import { setModal } from '../store/slices/modalSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import TrianglifyBanner from '../components/TrianglifyBanner';
import TrianglifyCustomizer from '../components/TrianglifyCustomizer';
import { useParams } from 'react-router-dom';
import { getUserDataFromId } from '../services/userService';
import { setBarCrawls, setProfileUser } from '../store/slices/userProfileSlice';
import { setMultipleTrianglifyValues } from '../store/slices/trianglifySlice';
import { setLoading } from '../store/slices/buttonLoadSlice';
import { fetchTrianglifyConfig } from '../services/tryianglifyService';
import ProfileInfoBuilder from '../components/ProfileInfoBuilder';
import { getUserBarCrawls } from '../services/barCrawlService';
import TabManager from '../components/TabManager'; 
import MyCrawlsTab from "../components/tabs/MyCrawlsTab";
import AnimatedContainer from './AnimatedContainer';

const useProfileStyles = (theme: any) => ({
  logo: {
    color: theme.palette.custom?.dark,
    fontFamily: 'Primary',
  },
});

const ProfileContainer = ({ mode }: { children?: ReactNode, mode?: "personal" | "stranger" | "friend" }) => {
  const theme = useTheme();
  const styles = useProfileStyles(theme);
  const token = useAppSelector((state) => state.authentication.token);
  const userProfile = useAppSelector((state) => state.userProfile);
  const isLoading = useAppSelector((state) => state.buttonLoad['mainApp'] ?? false);
  const dispatch = useAppDispatch();
  const { slug } = useParams();
  const [activeSection, setActiveSection] = useState<{ name: string; in: boolean }>({
    name: 'barCrawls',
    in: true
  });

  const fetchTrianglifyData = async (uid: string) => {
    const trianglifyData = await fetchTrianglifyConfig(uid);
    if (trianglifyData) {
      dispatch(setMultipleTrianglifyValues(trianglifyData));
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
  };

  const fetchUserbarCrawls = async (uid: string) => {
    const userBarCrawls = await getUserBarCrawls(uid);
    const formattedCrawls = userBarCrawls.map(crawl => ({
      id: crawl.id,
      crawlName: crawl.crawlName,
      intimacyLevel: crawl.intimacyLevel,
      userID: crawl.userID ?? "",
      selectedBars: crawl.selectedBars.map(place => ({
        id: place.id,
        name: place.name,
        vicinity: place.vicinity,
        geometry: {
          location: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
          }
        }
      }))
    }));
    dispatch(setBarCrawls(formattedCrawls)); 
  };

  useEffect(() => {
    dispatch(setLoading({ key: 'profilePage', value: true }));
    if (slug) {
      fetchUserData(slug);
      fetchTrianglifyData(slug);
      fetchUserbarCrawls(slug);
    }
    setTimeout(() => {
      dispatch(setLoading({ key: 'profilePage', value: false }));
    }, 1000);
  }, [slug]);

  const handleImageChange = () => {
    dispatch(setModal({
      open: true,
      title: 'Update Your Banner Image',
      body: <TrianglifyCustomizer />,
    }));
  };

  const handleInfoChange = () => {
    dispatch(setModal({
      open: true,
      title: 'Update Your Profile Info',
      body: <ProfileInfoBuilder />,
    }));
  };

  const changeSection = (newSection: string) => {
    if (newSection === activeSection.name) return;
  
    setActiveSection(prev => ({ ...prev, in: false }));
  
    setTimeout(() => {
      setActiveSection({ name: newSection, in: true });
    }, 300);
  };

  const renderTabs = () => {
    switch (activeSection.name) {
      case 'barCrawls':
        return (
          <TabManager tabs={['My Crawls', 'Invites', 'Discover']}>
            <MyCrawlsTab />
            <div>Invites content here</div>
            <div>Discover new crawls content here</div>
          </TabManager>
        );
      case 'friends':
        return (
          <TabManager tabs={['My Friends', 'Pending', 'Requests']}>
            <div>My Friends content here</div>
            <div>Pending Requests content here</div>
            <div>Incoming Requests content here</div>
          </TabManager>
        );
      case 'groups':
        return (
          <TabManager tabs={['My Groups', 'New Group']}>
            <div>My Groups content here</div>
            <div>Create a New Group form here</div>
          </TabManager>
        );
      default:
        return null;
    }
  };

  return (
    <Box className="prof-container">
      {isLoading ? (
        <CircularProgress size="24px" sx={{ color: "#FFF" }} />
      ) : (
        <>
          <div className="profile-container-banner">
            <TrianglifyBanner {...(token ? { token } : {})} />
            <Avatar
              className="profile-avatar"
              sx={{ backgroundColor: theme.palette.custom?.dark, cursor: "pointer" }}
            >
              {userProfile.profileUser?.UserFirstName.charAt(0)} {userProfile.profileUser?.UserLastName.charAt(0)}
            </Avatar>
            {mode === "personal" && (
              <IconButton onClick={handleImageChange} sx={{ backgroundColor: theme.palette.custom?.light }} className="profile-banner-upload">
                <EditIcon />
              </IconButton>
            )}
          </div>

          <div className="profile-container-content">
            <div className="profile-sidebar">
              <div className="profile-container-row">
                <Typography variant="h5" fontWeight={700} sx={styles.logo}>
                  {userProfile.profileUser?.UserFirstName} {userProfile.profileUser?.UserLastName}
                </Typography>
                {mode === "personal" && (
                  <IconButton onClick={handleInfoChange} sx={{ backgroundColor: theme.palette.custom?.light }} className="profile-info-edit">
                    <EditIcon />
                  </IconButton>
                )}
              </div>
              <Typography variant="caption">{userProfile.profileUser?.UserEmail}</Typography>
              <div className="profile-stat-container">
                <div className="profile-stat-column">
                  <Typography variant="h5" fontWeight={700} sx={styles.logo}>
                    {userProfile.barCrawls.length}
                  </Typography>
                  <Typography variant="caption">Bar Crawls</Typography>
                </div>
                <div className="profile-stat-column">
                  <Typography variant="h5" fontWeight={700} sx={styles.logo}>0</Typography>
                  <Typography variant="caption">Friends</Typography>
                </div>
                <div className="profile-stat-column">
                  <Typography variant="h5" fontWeight={700} sx={styles.logo}>0</Typography>
                  <Typography variant="caption">Groups</Typography>
                </div>
              </div>
              <Stack spacing={1} sx={{ mt: 2 }}>
              <Button
                startIcon={<LocalBarIcon />}
                fullWidth
                onClick={() => changeSection('barCrawls')}
                className="sidebar-button"
              >
                Bar Crawls
              </Button>
              <Button
                startIcon={<PeopleAltIcon />}
                fullWidth
                onClick={() => changeSection('friends')}
                className="sidebar-button"
              >
                Friends
              </Button>
              <Button
                startIcon={<GroupsIcon />}
                fullWidth
                onClick={() => changeSection('groups')}
                className="sidebar-button"
              >
                Groups
              </Button>
              </Stack>
            </div>
            <div className="profile-content">
            <AnimatedContainer
              entry="animate__fadeIn"
              exit="animate__fadeOut"
              isEntering={activeSection.in}
              sx={{ height: '100%' }}
            >
                {renderTabs()}
              </AnimatedContainer>
            </div>
          </div>
        </>
      )}
    </Box>
  );
};


export default ProfileContainer;
