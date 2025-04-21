import { Box, Theme } from "@mui/material";
import ProfileContainer from "../../containers/ProfileContainer";
import TabManager from "../../components/TabManager";
import MyCrawlsTab from "../../components/tabs/MyCrawlsTab";
import theme from "../../styles/theme";

const nestedContainerStyles = (theme: Theme) => ({
  root: {
    height: "100%",
    overflow: "scroll",
    backgroundColor: theme.palette.custom?.light,
  },
});

function PersonalProfile() {
  const styles = nestedContainerStyles(theme);

  return (
    <Box sx={styles.root}>
      <ProfileContainer mode="personal">
        <TabManager
          tabs={["My Crawls", "Invites", "Discover"]}
        >
          {[<MyCrawlsTab />, 'invited', 'public']}
        </TabManager>
      </ProfileContainer>
    </Box>
  );
}

export default PersonalProfile;
