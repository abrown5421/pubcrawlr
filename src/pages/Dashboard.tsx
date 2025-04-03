import AnimatedContainer from "../containers/AnimatedContainer";
import { useAppSelector } from "../store/hooks";
import { Box, Theme } from "@mui/system";
import theme from "../styles/theme";

const nestedContainerStyles = (theme: Theme) => ({
    root: {
      height: "100%",
      padding: "10px",
      backgroundColor: theme.palette.custom?.light,
    }
});

function Dashboard() {
  const enter = useAppSelector(state => state.activePage);
  const styles = nestedContainerStyles(theme);
  
  return (
    <AnimatedContainer isEntering={enter.In && enter.Name === 'Dashboard'}>
      <Box sx={styles.root}>
        Dashboard
      </Box>
    </AnimatedContainer>
  );
}

export default Dashboard;

