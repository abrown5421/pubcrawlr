import { Box, Typography } from '@mui/material';
import { useAppSelector } from '../../store/hooks';
import "../../styles/components/profile-manager.css";
import FriendCard from '../FriendCard';
import FriendAutocomplete from '../FriendAutocomplete';

export default function MyFriendsTab({ mode }: { mode?: string }) {
  const userProfile = useAppSelector((state) => state.userProfile);
  const filteredFriends = userProfile.friends.filter((friend) => 
    friend.FriendRequestAccepted && friend.FriendRequested
  );

  return (
    <Box sx={{ width: '100%', overflow: 'scroll' }}>
      <FriendAutocomplete />
      <Box className="card-deck">
        {filteredFriends.length < 1 && <Typography variant="caption">{mode === 'owned' ? "You don't currently have any friends." : "This user does not currently have any friends."}</Typography>}
        {filteredFriends.length > 0 && filteredFriends.map((friend) => (
          <FriendCard key={friend.FriendDocId} friend={friend} mode='friend' />
        ))}
      </Box>
    </Box>
  );
}
