import { Box, Typography } from '@mui/material';
import { useAppSelector } from '../../store/hooks';
import BarCrawlCard from '../BarCrawlCard';
import "../../styles/components/card-deck.css";

export default function MyCrawlsTab({ mode }: { mode?: string }) {
  const userProfile = useAppSelector((state) => state.userProfile);
  const token = useAppSelector((state) => state.authentication.token);

  return (
    <Box className="app-w-percent-100 app-overflow-scroll">
        <Box className={userProfile.barCrawls.length > 0 ? "app-flex app-wrap app-gap-1 card-deck" : "disclaim-box"}>
        {userProfile.barCrawls.length < 1 && <Typography variant="caption">{mode === 'owned' ? "You don't currently have any bar crawls saved." : "This user does not currently have any bar crawls saved."}</Typography>}
        {userProfile.barCrawls.length > 0 && userProfile.barCrawls.map((crawl) => (
            <BarCrawlCard key={crawl.crawlName} crawl={crawl} mode={token === crawl.userID ? "owned" : "attendee"} />
        ))}
        </Box>
    </Box>
  );
}
