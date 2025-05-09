import { Typography } from '@mui/material';
import errImage from '../../public/assets/images/404.png';
import { Box } from "@mui/system";
import AnimatedContainer from "../containers/AnimatedContainer";
import { useAppSelector } from "../store/hooks";
import { Theme } from "@mui/system";
import theme from "../styles/theme";
import '../styles/pages/not-found.css'

const nestedContainerStyles = (theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.custom?.light,
  }
});
const NotFound = () => {
  const enter = useAppSelector(state => state.activePage);
  const styles = nestedContainerStyles(theme);
  return (
    <AnimatedContainer isEntering={enter.In && enter.Name === 'NotFound'} sx={{height: '100%'}}>
      <Box className="app-flex app-col app-ai-center app-jc-center app-h-percent-100 not-found-container" sx={styles.root}>
        <Typography variant="h1">
            404
        </Typography>
        <img src={errImage} width="300px" />
        <Typography variant="body1" style={{ marginTop: 16 }}>
            Not all who wander are lost... but you sure are.
        </Typography>
      </Box>
    </AnimatedContainer>
  );
};

export default NotFound;
