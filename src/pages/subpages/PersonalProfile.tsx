import { Box, Theme } from "@mui/material";
import ProfileContainer from "../../containers/ProfileContainer";
import "../../styles/containers/profile-container.css";
import theme from "../../styles/theme";
import ProfileManager from "../../components/ProfileManager";

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
            <ProfileManager />
        </ProfileContainer>
    </Box>
  );
}

export default PersonalProfile;

