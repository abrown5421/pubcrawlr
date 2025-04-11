import { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';

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
        Your Bar Crawls will appear here.
      </TabPanel>
      <TabPanel value={tab} index={1}>
        Your Friends will appear here.
      </TabPanel>
    </Box>
  );
}
