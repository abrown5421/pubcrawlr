import { Box, Typography } from '@mui/material';
import { useAppSelector } from '../../store/hooks';
import BarCrawlCard from '../BarCrawlCard';
import "../../styles/components/profile-manager.css";

export default function ProfileManager() {
  const userProfile = useAppSelector((state) => state.userProfile);

  return (
    <Box sx={{ width: '100%' }}>
        <Box className="bar-crawl-deck">
        {userProfile.barCrawls.length < 1 && <Typography variant="caption">You don't currently have any bar crawls saved.</Typography>}
        {userProfile.barCrawls.length > 0 && userProfile.barCrawls.map((crawl) => (
            <BarCrawlCard key={crawl.crawlName} crawl={crawl} />
        ))}
        </Box>
    </Box>
  );
}
