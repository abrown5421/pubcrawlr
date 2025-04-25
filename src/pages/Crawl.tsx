import { Box } from "@mui/system";
import AnimatedContainer from "../containers/AnimatedContainer";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Theme } from "@mui/system";
import theme from "../styles/theme";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { getBarCrawlByID } from "../services/barCrawlService";
import { setSelectedBarCrawl } from "../store/slices/selectedBarCrawlSlice";
import CrawlContainer from "../containers/CrawlContainer";

const nestedContainerStyles = (theme: Theme) => ({
  root: {
    height: "100%",
    overflow: 'scroll',
    backgroundColor: theme.palette.custom?.light,
  }
});

function Crawl() {
  const dispatch = useAppDispatch();
  const enter = useAppSelector(state => state.activePage);
  const token = useAppSelector((state) => state.authentication.token);
  const crawl = useAppSelector((state) => state.selectedBarCrawl.selectedBarCrawl);
  const styles = nestedContainerStyles(theme);
  const { slug } = useParams();
  
  useEffect(() => {
    if (slug) {
      getBarCrawlByID(slug).then((crawl) => {
        if (crawl) dispatch(setSelectedBarCrawl(crawl));
      })
      .catch(console.error);
    }
  }, [slug]);

  return (
    <AnimatedContainer isEntering={enter.In && enter.Name === 'Crawl'} sx={{height: '100%'}}>
      <Box sx={styles.root}>
        {token === crawl?.userID && <CrawlContainer mode="owner" /> }
        {token !== crawl?.userID && <CrawlContainer mode="viewer" /> }
      </Box>
    </AnimatedContainer>
  );
}

export default Crawl;

