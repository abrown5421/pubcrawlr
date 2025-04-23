import { Box, Typography } from '@mui/material';
import { useAppSelector } from '../../store/hooks';
import "../../styles/components/profile-manager.css";
import FriendCard from '../FriendCard';

export default function ProfileManager() {
  const userProfile = useAppSelector((state) => state.userProfile);
  const filteredFriends = userProfile.friends.filter((friend) => 
    friend.FriendRequestAccepted && !friend.FriendRequested
  );

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
