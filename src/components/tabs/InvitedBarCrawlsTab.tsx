import { Box, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import BarCrawlCard from '../BarCrawlCard';
import "../../styles/components/card-deck.css";
import { useEffect } from 'react';
import { clearBarCrawlInvites } from '../../store/slices/requestSlice';
import { markBarCrawlInvitesAsSeen } from '../../services/requestService';

export default function InvitedBarCrawlsTab({ mode }: { mode?: string }) {
  const dispatch = useAppDispatch();
  const request = useAppSelector((state) => state.requests);
  const token = useAppSelector((state) => state.authentication.token);
  const userProfile = useAppSelector((state) => state.userProfile);

  useEffect(()=>{
    if (request.open && token) {
      dispatch(clearBarCrawlInvites())
      markBarCrawlInvitesAsSeen(token);
    }
  }, [request])

  return (
    <Box className="app-w-percent-100 app-overflow-scroll">
        <Box className={userProfile.invitedBarCrawls.length > 0 ? "app-flex app-wrap app-gap-1 card-deck" : "disclaim-box"}>
        {userProfile.invitedBarCrawls.length < 1 && <Typography variant="caption">{mode === 'owned' ? "You aren't currently invited to any bar crawls." : "This user is not currently invited to any bar crawls."}</Typography>}
        {userProfile.invitedBarCrawls.length > 0 && userProfile.invitedBarCrawls.map((crawl) => (
            <BarCrawlCard key={crawl.crawlName} crawl={crawl} mode="invited" />
        ))}
        </Box>
    </Box>
  );
}
