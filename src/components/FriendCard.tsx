import React from "react";
import { Card, CardContent, Typography, Box, Button, CircularProgress } from "@mui/material";
import { useTheme } from "@emotion/react";
import { FriendCardProps } from "../types/globalTypes";
import "../styles/components/friend-card.css";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import { setActivePage } from "../store/slices/activePageSlice";
import { setLoading } from "../store/slices/buttonLoadSlice";
import { setAlert } from "../store/slices/notificationSlice";
import { acceptFriendRequest, removeFriend } from "../services/friendService";

const useFriendCardStyles = (theme: any) => ({
  viewButton: {
    backgroundColor: theme.palette.custom?.grey,
    color: theme.palette.custom?.dark,
    "&:hover": {
      backgroundColor: theme.palette.custom?.light,
      color: theme.palette.custom?.dark,
    },
  },
  removeButton: {
    backgroundColor: theme.palette.custom?.error,
    color: theme.palette.custom?.light,
    "&:hover": {
      backgroundColor: "#b71c1c",
    },
  },
  rescindButton: {
    backgroundColor: theme.palette.custom?.highlight,
    color: theme.palette.custom?.light,
    "&:hover": {
      backgroundColor: theme.palette.custom?.accent,
    },
  },
  acceptButton: {
    backgroundColor: theme.palette.custom?.accent,
    color: theme.palette.custom?.light,
    "&:hover": {
      backgroundColor: theme.palette.custom?.highlight,
    },
  },
  declineButton: {
    backgroundColor: theme.palette.error.main,
    color: "#fff",
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
  },
});

const FriendCard: React.FC<FriendCardProps> = ({ friend, mode }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const styles = useFriendCardStyles(theme);
  const token = useAppSelector((state) => state.authentication.token);
  const isAcceptLoading = useAppSelector((state) => state.buttonLoad['acceptFriend'] ?? false);
  const isDeclineLoading = useAppSelector((state) => state.buttonLoad['declineFriend'] ?? false);

  const handleAnswerRequest = async (x: string) => {
    if (x === 'accept') {
      dispatch(setLoading({ key: 'acceptFriend', value: true }));
    } else {
      dispatch(setLoading({ key: 'declineFriend', value: true }));
    }
    if (token && friend.FriendDocId) {
        try {
          if (x === 'accept') {
            dispatch(setLoading({ key: 'acceptFriend', value: false }));
            acceptFriendRequest(token, friend.FriendDocId)
          } else {
            dispatch(setLoading({ key: 'declineFriend', value: false }));
            removeFriend(token, friend.FriendDocId)
          }
        } catch (error) {
            if (x === 'accept') {
              dispatch(setLoading({ key: 'acceptFriend', value: false }));
            } else {
              dispatch(setLoading({ key: 'declineFriend', value: false }));
            }
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
        if (x === 'accept') {
          dispatch(setLoading({ key: 'acceptFriend', value: false }));
        } else {
          dispatch(setLoading({ key: 'declineFriend', value: false }));
        }
    }
  };
  
  const renderActions = () => {
    switch (mode) {
      case 'friend':
        return (
          <Button onClick={() => handleAnswerRequest('decline')} sx={styles.removeButton} variant="contained">
            {isDeclineLoading ? <CircularProgress size="24px" sx={{ color: "#fff" }} /> : "Unfriend"}
          </Button>
        );
      case 'pend':
        return (
          <Button onClick={() => handleAnswerRequest('decline')} sx={styles.declineButton} variant="contained">
            {isDeclineLoading ? <CircularProgress size="24px" sx={{ color: "#fff" }} /> : "Cancel"}
          </Button>
        );
      case 'request':
        return (
          <>
            <Button onClick={() => handleAnswerRequest('accept')} sx={styles.acceptButton} variant="contained">
              {isAcceptLoading ? <CircularProgress size="24px" sx={{ color: "#fff" }} /> : "Accept"}
            </Button>
            <Button onClick={() => handleAnswerRequest('decline')} sx={styles.declineButton} variant="contained">
              {isDeclineLoading ? <CircularProgress size="24px" sx={{ color: "#fff" }} /> : "Decline"}
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  const handleViewProfile = (slug: string) => {
    dispatch(setActivePage({ key: "In", value: false }));
    dispatch(setActivePage({ key: "Name", value: 'Dashboard' }));

    setTimeout(() => {
      dispatch(setActivePage({ key: "In", value: true }));
      navigate(`/Dashboard/${slug}`);
    }, 500);
  }

  return (
    <Card className="friend-card" variant="outlined">
      <CardContent>
        <Typography variant="h6">
          {friend.FriendFirstName} {friend.FriendLastName}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Email: {friend.FriendEmail}
        </Typography>
        <Box className="app-flex app-jc-end button-group">
          <Button sx={styles.viewButton} variant="contained" onClick={() => handleViewProfile(friend.FriendDocId)}>View</Button>
          {renderActions()}
        </Box>
      </CardContent>
    </Card>
  );
};

export default FriendCard;
