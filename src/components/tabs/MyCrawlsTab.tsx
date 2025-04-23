import { Box, Typography } from '@mui/material';
import { useAppSelector } from '../../store/hooks';
import BarCrawlCard from '../BarCrawlCard';
import "../../styles/components/profile-manager.css";

export default function MyCrawlsTab({ mode }: { mode?: string }) {
  const userProfile = useAppSelector((state) => state.userProfile);

  return (
    <Box sx={{ width: '100%', overflow: 'scroll' }}>
        <Box className={userProfile.barCrawls.length > 0 ? "card-deck" : "disclaim-box"}>
        {userProfile.barCrawls.length < 1 && <Typography variant="caption">{mode === 'owned' ? "You don't currently have any bar crawls saved." : "This user does not currently have any bar crawls saved."}</Typography>}
        {userProfile.barCrawls.length > 0 && userProfile.barCrawls.map((crawl) => (
            <BarCrawlCard key={crawl.crawlName} crawl={crawl} />
        ))}
        </Box>
    </Box>
  );
}
