import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedContainer from "../containers/AnimatedContainer";
import { useAppSelector } from "../store/hooks";
import { Box, Theme } from "@mui/system";
import theme from "../styles/theme";
import { UserState } from "../components/Navbar";

const nestedContainerStyles = (theme: Theme) => ({
  root: {
    height: "100%",
    padding: "10px",
    backgroundColor: theme.palette.custom?.light,
  }
});

function Dashboard() {
  const navigate = useNavigate();
  const user = useAppSelector((state: { authentication: UserState }) => state.authentication);
  const enter = useAppSelector(state => state.activePage);
  const styles = nestedContainerStyles(theme);

  useEffect(() => {
    if (!user.isAuthenticated) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <AnimatedContainer isEntering={enter.In && enter.Name === 'Dashboard'}>
      <Box sx={styles.root}>
        Dashboard
      </Box>
    </AnimatedContainer>
  );
}

export default Dashboard;
