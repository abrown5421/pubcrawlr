import React from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import { useTheme } from "@emotion/react";
import { FriendCardProps } from "../types/globalTypes";
import "../styles/components/friend-card.css";
import { useAppDispatch } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import { setActivePage } from "../store/slices/activePageSlice";

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

  const renderActions = () => {
    switch (mode) {
      case 'friend':
        return (
          <Button sx={styles.removeButton} variant="contained">Unfriend</Button>
        );
      case 'pend':
        return (
          <Button sx={styles.declineButton} variant="contained">Cancel</Button>
        );
      case 'request':
        return (
          <>
            <Button sx={styles.acceptButton} variant="contained">Accept</Button>
            <Button sx={styles.declineButton} variant="contained">Decline</Button>
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
        <Box className="button-group">
          <Button sx={styles.viewButton} variant="contained" onClick={() => handleViewProfile(friend.FriendDocId)}>View</Button>
          {renderActions()}
        </Box>
      </CardContent>
    </Card>
  );
};

export default FriendCard;
