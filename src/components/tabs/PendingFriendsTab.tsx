import { Box, Typography } from '@mui/material';
import { useAppSelector } from '../../store/hooks';
import "../../styles/components/card-deck.css";
import FriendCard from '../FriendCard';

export default function ProfileManager() {
  const userProfile = useAppSelector((state) => state.userProfile);
  const filteredFriends = userProfile.friends.filter((friend) => 
    !friend.FriendRequestAccepted && friend.FriendRequested
  );

  return (
    <Box className="app-w-percent-100 app-overflow-scroll">
      <Box className="app-flex app-wrap app-gap-1 card-deck">
        {filteredFriends.length < 1 && <Typography variant="caption">You don't currently have any pending friend requests.</Typography>}
        {filteredFriends.length > 0 && filteredFriends.map((friend) => (
          <FriendCard key={friend.FriendDocId} friend={friend} mode='pend' />
        ))}
      </Box>
    </Box>
  );
}
