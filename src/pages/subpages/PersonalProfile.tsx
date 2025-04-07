import { Box, Theme } from "@mui/material";
import ProfileContainer from "../../containers/ProfileContainer";
import "../../styles/containers/profile-container.css";
import theme from "../../styles/theme";

const nestedContainerStyles = (theme: Theme) => ({
  root: {
    height: "100%",
    backgroundColor: theme.palette.custom?.light,
  },
});

function PersonalProfile() {
  const styles = nestedContainerStyles(theme);

  return (
    <Box sx={styles.root}>
        <ProfileContainer>
            <h2>Personal Profile</h2>
        </ProfileContainer>
    </Box>
  );
}

export default PersonalProfile;

