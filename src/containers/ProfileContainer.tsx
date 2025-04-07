import { ReactNode } from 'react';
import { Box } from '@mui/material';

const ProfileContainer = ({ children }: { children: ReactNode }) => {
  
  return (
    <Box>
        <Box>{children}</Box>
    </Box>
  );
};

export default ProfileContainer;
