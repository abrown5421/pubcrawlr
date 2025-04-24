import { Box, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import "../../styles/components/profile-manager.css";
import FriendCard from '../FriendCard';
import { useEffect } from 'react';
import { clearRequests } from '../../store/slices/requestSlice';
import { markAllUnseenAsSeen } from '../../services/requestService';

export default function ProfileManager() {
  const dispatch = useAppDispatch();
  const request = useAppSelector((state) => state.requests);
  const token = useAppSelector((state) => state.authentication.token);

  const userProfile = useAppSelector((state) => state.userProfile);
  const filteredFriends = userProfile.friends.filter((friend) => 
    friend.FriendRequestAccepted && !friend.FriendRequested
  );

  useEffect(()=>{
    if (request.open && token) {
      dispatch(clearRequests())
      markAllUnseenAsSeen(token)
    }
  }, [request])

  return (
    <Box sx={{ width: '100%', overflow: 'scroll' }}>
      <Box className="card-deck">
        {filteredFriends.length < 1 && <Typography variant="caption">You don't currently have any friend requests.</Typography>}
        {filteredFriends.length > 0 && filteredFriends.map((friend) => (
          <FriendCard key={friend.FriendDocId} friend={friend} mode='request' />
        ))}
      </Box>
    </Box>
  );
}
