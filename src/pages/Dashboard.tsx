import AnimatedContainer from "../containers/AnimatedContainer";
import { useParams } from 'react-router-dom';
import { useAppSelector } from "../store/hooks";
import { Box, Theme } from "@mui/system";
import theme from "../styles/theme";
import PersonalProfile from "./subpages/PersonalProfile";
import FriendProfile from "./subpages/FriendProfile";
import StrangerProfile from "./subpages/StrangerProfile";

const nestedContainerStyles = (theme: Theme) => ({
  root: {
    height: "100%",
    backgroundColor: theme.palette.custom?.light,
  },
});

function Dashboard() {
  const enter = useAppSelector(state => state.activePage);
  const token = useAppSelector((state) => state.authentication.token);
  const styles = nestedContainerStyles(theme);
  const { slug } = useParams();
  
  return (
    <AnimatedContainer isEntering={enter.In && enter.Name === 'Dashboard'} sx={{height: '100%'}}>
      <Box sx={styles.root}>
        {token === slug && <PersonalProfile />}
        {/* {token === check if friend && <FriendProfile />} */}
        {/* for now we are just checking if its not the user profile since we dont have friends setup yet */}
        {token !== slug && <StrangerProfile />}
      </Box>
    </AnimatedContainer>
  );
}

export default Dashboard;

