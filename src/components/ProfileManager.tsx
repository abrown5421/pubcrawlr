import { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { useAppSelector } from '../store/hooks';
import BarCrawlCard from './BarCrawlCard';

function TabPanel(props: { children?: React.ReactNode; value: number; index: number }) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box p={2}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function ProfileManager() {
  const userProfile = useAppSelector((state) => state.userProfile);
  const [tab, setTab] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={tab} onChange={handleChange} aria-label="Bar Crawls and Friends Tabs">
        <Tab label="Bar Crawls" />
        <Tab label="Friends" />
      </Tabs>
      <TabPanel value={tab} index={0}>
          <>
            {userProfile.barCrawls.length < 1 && <Typography variant="caption">You don't currently have any bar crawls saved.</Typography>}
            {userProfile.barCrawls.length > 1 && userProfile.barCrawls.map((crawl) => (
              <BarCrawlCard key={crawl.crawlName} crawl={crawl} />
            ))}
          </>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        Your Friends will appear here.
      </TabPanel>
    </Box>
  );
}
