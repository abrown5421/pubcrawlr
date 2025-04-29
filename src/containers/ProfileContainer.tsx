import { ReactNode, useEffect, useState } from 'react';
import { Avatar, Box, CircularProgress, IconButton, Typography, useTheme, Button, Stack, Badge } from '@mui/material';
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
import { setBarCrawls, setProfileUser, setFriends, setInvitedBarCrawls } from '../store/slices/userProfileSlice';
import { setMultipleTrianglifyValues } from '../store/slices/trianglifySlice';
import { setLoading } from '../store/slices/buttonLoadSlice';
import { fetchTrianglifyConfig } from '../services/tryianglifyService';
import ProfileInfoBuilder from '../components/ProfileInfoBuilder';
import { getUserBarCrawls, getUserInvitedBarCrawls, subscribeToBarCrawls } from '../services/barCrawlService';
import TabManager from '../components/TabManager'; 
import MyCrawlsTab from "../components/tabs/MyCrawlsTab";
import InvitedBarCrawlsTab from "../components/tabs/InvitedBarCrawlsTab";
import MyFriendsTab from "../components/tabs/MyFriendsTab";
import PendingFriendsTab from "../components/tabs/PendingFriendsTab";
import RequestedFriendsTab from "../components/tabs/RequestedFriendsTab";
import AnimatedContainer from './AnimatedContainer';
import { getFriends, isAlreadyFriend, requestFriend, subscribeToFriends } from '../services/friendService';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { setAlert } from '../store/slices/notificationSlice';

const useProfileStyles = (theme: any) => ({
  logo: {
    color: theme.palette.custom?.dark,
    fontFamily: 'Primary',
  },
  addButton: {
    backgroundColor: theme.palette.custom?.accent,
    color: theme.palette.custom?.light,
    "&:hover": {
      backgroundColor: theme.palette.custom?.highlight,
    },
  },
  sidebarButton: {
    backgroundColor: theme.palette.custom?.lgtGrey,
    color: theme.palette.custom?.dark,
    "&:hover": {
      color: theme.palette.custom?.accent,
    },
  },
});

const ProfileContainer = ({ mode }: { children?: ReactNode, mode?: "personal" | "stranger" | "friend" }) => {
  const theme = useTheme();
  const styles = useProfileStyles(theme);
  const token = useAppSelector((state) => state.authentication.token);
  const request = useAppSelector((state) => state.requests);
  const userProfile = useAppSelector((state) => state.userProfile);
  const isLoading = useAppSelector((state) => state.buttonLoad['profilePage'] ?? false);
  const isAddLoading = useAppSelector((state) => state.buttonLoad['addFriend'] ?? false);
  const dispatch = useAppDispatch();
  const { slug } = useParams();
  const isThisTheirProfile = token === slug;
  const acceptedFriendCount = userProfile.friends.filter(
    (friend) => friend.FriendRequestAccepted && friend.FriendRequested
  );
  const [activeSection, setActiveSection] = useState<{ name: string; in: boolean }>({
    name: 'barCrawls',
    in: true
  });
  const [alreadyFriend, setAlreadyFriend] = useState<boolean | null>(null);

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
    const userInvitedBarCrawls = await getUserInvitedBarCrawls(uid);
    const formattedCrawls = userBarCrawls.map(crawl => ({
      id: crawl.id ?? null,
      attendeeIds: crawl.attendeeIds, 
      attendeess: typeof crawl.attendees === 'string' ? [] : crawl.attendees,
      crawlName: crawl.crawlName,
      startDate: crawl.startDate,
      endDate: crawl.endDate,
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
  
    const formattedInvitedCrawls = userInvitedBarCrawls.map(crawl => ({
      id: crawl.id ?? null,
      attendeeIds: crawl.attendeeIds, 
      attendeess: typeof crawl.attendees === 'string' ? [] : crawl.attendees,
      crawlName: crawl.crawlName,
      startDate: crawl.startDate,
      endDate: crawl.endDate,
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
    
    dispatch(setBarCrawls(formattedCrawls)); // first err here
    dispatch(setInvitedBarCrawls(formattedInvitedCrawls)); // Second err here
  };

  const fetchUserFriends = async (uid: string) => {
    const userFriends = await getFriends(uid);
    dispatch(setFriends(userFriends)); 
  };

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
        if (isThisTheirProfile) {
          return (
            <TabManager tabs={['Crawls', 'Invites', 'Discover']}>
              <MyCrawlsTab mode="owned" />
              <InvitedBarCrawlsTab mode="owned" />
              <div>Discover new crawls content here</div>
            </TabManager>
          );
        } else {
          return(
            <MyCrawlsTab />
          )
        }
        
      case 'friends':
        if (isThisTheirProfile) {
          return (
            <TabManager tabs={['Friends', 'Pending', 'Requests']}>
              <MyFriendsTab mode="owned" />
              <PendingFriendsTab />
              <RequestedFriendsTab />
            </TabManager>
          );
        } else {
          return(
            <MyFriendsTab />
          )
        }
      case 'groups':
        if (isThisTheirProfile) {
          return (
            <TabManager tabs={['Groups', 'New Group']}>
              <div>My Groups content here</div>
              <div>Create a New Group form here</div>
            </TabManager>
          );
        } else {
          return(
            <div>My Groups content here</div>
          )
        }
      default:
        return null;
    }
  };

  const handleRequestFriend = async () => {
    dispatch(setLoading({ key: 'addFriend', value: true }));
    if (token && userProfile.profileUser) {
        try {
            const requesterData = await getUserDataFromId(token);
            if (requesterData) {
              const requester = {
                FriendDocId: userProfile.profileUser.docId,
                FriendFirstName: userProfile.profileUser.UserFirstName,
                FriendLastName: userProfile.profileUser.UserLastName,
                FriendEmail: userProfile.profileUser.UserEmail,
                FriendRequested: true,
                FriendRequestAccepted: false,
                DateRequested: new Date().toISOString(),
                Seen: true,
              };

              const requestee = {
                  FriendDocId: token,
                  FriendFirstName: requesterData.UserFirstName,
                  FriendLastName: requesterData.UserLastName,
                  FriendEmail: requesterData.UserEmail,
                  FriendRequested: false,
                  FriendRequestAccepted: false,
                  DateRequested: new Date().toISOString(),
                  Seen: false,
              };

              await requestFriend(token, requester, requestee);
              setAlreadyFriend(true);
              dispatch(setLoading({ key: 'addFriend', value: false }));
            }
        } catch (error) {
            dispatch(setLoading({ key: 'addFriend', value: false }));
            dispatch(
              setAlert({
                open: true,
                message: "Error fetching user data or processing friend request",
                severity: "error",
              })
            );
        }
    } else {
        dispatch(
          setAlert({
            open: true,
            message: "Missing token or profile data",
            severity: "error",
          })
        );
        dispatch(setLoading({ key: 'addFriend', value: false }));
    }
  };

  useEffect(() => {
    const checkFriendStatus = async () => {
      if (token && userProfile?.profileUser?.docId) {
        const isFriend = await isAlreadyFriend(token, userProfile.profileUser.docId);
        setAlreadyFriend(isFriend);
      }
    };

    checkFriendStatus();
  }, [token, userProfile?.profileUser?.docId]);

  useEffect(() => {
    if (!slug) return;
  
    dispatch(setLoading({ key: 'profilePage', value: true }));
  
    fetchUserData(slug);
    fetchTrianglifyData(slug);
    fetchUserFriends(slug);

    const unsubscribeBarCrawls = subscribeToBarCrawls(() => {
      fetchUserbarCrawls(slug);
    });
  
    const unsubscribeFriends = subscribeToFriends(slug, () => {
      fetchUserFriends(slug);
    });
  
    const timeout = setTimeout(() => {
      dispatch(setLoading({ key: 'profilePage', value: false }));
    }, 1000);
  
    return () => {
      unsubscribeBarCrawls?.(); 
      unsubscribeFriends?.(); 
      clearTimeout(timeout);
    };
  }, [slug]);

  return (
    <Box className="app-flex app-col">
      {isLoading ? (
        <CircularProgress size="24px" sx={{ color: "#FFF" }} />
      ) : (
        <>
          <div className="app-relative app-w-percent-100 profile-container-banner">
            <TrianglifyBanner {...(token ? { token } : {})} />
            <Avatar
              className="app-absolute-imp profile-avatar"
              sx={{ backgroundColor: theme.palette.custom?.dark, cursor: "pointer" }}
            >
              {userProfile.profileUser?.UserFirstName.charAt(0)} {userProfile.profileUser?.UserLastName.charAt(0)}
            </Avatar>
            {mode === "personal" && (
              <IconButton onClick={handleImageChange} sx={{ backgroundColor: theme.palette.custom?.light }} className="app-absolute-imp profile-banner-upload">
                <EditIcon />
              </IconButton>
            )}
          </div>

          <div className="app-flex app-row profile-container-content">
            <div className="app-flex app-col app-relative profile-sidebar app-fl-3">
              <div className="app-flex app-row">
                <Typography variant="h5" fontWeight={700} sx={styles.logo}>
                  {userProfile.profileUser?.UserFirstName} {userProfile.profileUser?.UserLastName}
                </Typography>
                {mode === "personal" ? (
                  <IconButton onClick={handleInfoChange} sx={{ backgroundColor: theme.palette.custom?.light }} className="app-absolute-imp profile-info-edit">
                    <EditIcon />
                  </IconButton>
                ) : (
                  <Button
                    sx={styles.addButton}
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    className="app-absolute-imp profile-info-edit"
                    onClick={handleRequestFriend}
                    disabled={alreadyFriend === true}
                  >
                    {isAddLoading ? <CircularProgress size="24px" sx={{ color: "#fff" }} /> : (alreadyFriend === true ? "Pending" : "Add Friend")}
                  </Button>
                )}
              </div>
              <Typography variant="caption">{userProfile.profileUser?.UserEmail}</Typography>
              <div className="app-flex app-row app-jc-between profile-stat-container">
                <div className="app-flex app-col app-ai-center app-jc-center">
                  <Typography variant="h5" fontWeight={700} sx={styles.logo}>
                    {userProfile.barCrawls.length}
                  </Typography>
                  <Typography variant="caption">Bar Crawls</Typography>
                </div>
                <div className="app-flex app-col app-ai-center app-jc-center">
                  <Typography variant="h5" fontWeight={700} sx={styles.logo}>
                    {acceptedFriendCount.length}
                  </Typography>
                  <Typography variant="caption">Friends</Typography>
                </div>
                <div className="app-flex app-col app-ai-center app-jc-center">
                  <Typography variant="h5" fontWeight={700} sx={styles.logo}>0</Typography>
                  <Typography variant="caption">Groups</Typography>
                </div>
              </div>
              <Stack spacing={1} sx={{ mt: 2 }}>
              <Button
                startIcon={<LocalBarIcon />}
                fullWidth
                onClick={() => changeSection('barCrawls')}
                sx={styles.sidebarButton} 
                className="app-flex app-row app-jc-start-imp sidebar-button"
              >
                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                  <span>Bar Crawls</span>
                  <Badge
                    color="error"
                    badgeContent={request.open ? request.requests.barCrawlInvites : null}
                    invisible={!request.open || !request.requests.total}
                    sx={{ mr: 1 }}
                  />
                </Box>
              </Button>
              <Button
                startIcon={<PeopleAltIcon />}
                fullWidth
                onClick={() => changeSection('friends')}
                sx={styles.sidebarButton} 
                className="app-flex app-row app-jc-start-imp sidebar-button"
              >
                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                  <span>Friends</span>
                  <Badge
                    color="error"
                    badgeContent={request.open ? request.requests.friendRequests : null}
                    invisible={!request.open || !request.requests.total}
                    sx={{ mr: 1 }}
                  />
                </Box>
              </Button>
              <Button
                startIcon={<GroupsIcon />}
                fullWidth
                onClick={() => changeSection('groups')}
                sx={styles.sidebarButton} 
                className="app-flex app-row app-jc-start-imp sidebar-button"
              >
                Groups
              </Button>
              </Stack>
            </div>
            <div className="app-flex app-col app-fl-8">
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
