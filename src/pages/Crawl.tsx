import { Box } from "@mui/system";
import AnimatedContainer from "../containers/AnimatedContainer";
import { useAppSelector } from "../store/hooks";
import { Theme } from "@mui/system";
import theme from "../styles/theme";

const nestedContainerStyles = (theme: Theme) => ({
  root: {
    height: "100%",
    padding: "10px",
    backgroundColor: theme.palette.custom?.light,
  }
});

function Crawl() {
  const enter = useAppSelector(state => state.activePage);
  const styles = nestedContainerStyles(theme);
  
  return (
    <AnimatedContainer isEntering={enter.In && enter.Name === 'Crawl'} sx={{height: '100%'}}>
      <Box sx={styles.root}>
        Crawl
      </Box>
    </AnimatedContainer>
  );
}

export default Crawl;

