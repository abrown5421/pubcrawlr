import { Box, Typography } from '@mui/material';
import { useAppSelector } from '../../store/hooks';
import BarCrawlCard from '../BarCrawlCard';
import "../../styles/components/profile-manager.css";

export default function InvitedBarCrawlsTab({ mode }: { mode?: string }) {
  const userProfile = useAppSelector((state) => state.userProfile);

  return (
    <Box sx={{ width: '100%', overflow: 'scroll' }}>
        <Box className={userProfile.invitedBarCrawls.length > 0 ? "card-deck" : "disclaim-box"}>
        {userProfile.invitedBarCrawls.length < 1 && <Typography variant="caption">{mode === 'owned' ? "You aren't currently invited to any bar crawls." : "This user is not currently invited to any bar crawls."}</Typography>}
        {userProfile.invitedBarCrawls.length > 0 && userProfile.invitedBarCrawls.map((crawl) => (
            <BarCrawlCard key={crawl.crawlName} crawl={crawl} mode="invited" />
        ))}
        </Box>
    </Box>
  );
}
