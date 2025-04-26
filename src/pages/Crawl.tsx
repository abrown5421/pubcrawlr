import { Box, CircularProgress } from "@mui/material";
import AnimatedContainer from "../containers/AnimatedContainer";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import theme from "../styles/theme";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { getBarCrawlByID } from "../services/barCrawlService";
import { setSelectedBarCrawl } from "../store/slices/selectedBarCrawlSlice";
import CrawlContainer from "../containers/CrawlContainer";
import { setLoading } from "../store/slices/buttonLoadSlice";

const nestedContainerStyles = (theme: any) => ({
  root: {
    height: "100%",
    overflow: "scroll",
    backgroundColor: theme.palette.custom?.light,
  },
});

function Crawl() {
  const dispatch = useAppDispatch();
  const enter = useAppSelector(state => state.activePage);
  const token = useAppSelector(state => state.authentication.token);
  const crawl = useAppSelector(state => state.selectedBarCrawl.selectedBarCrawl);
  const isLoading = useAppSelector(state => state.buttonLoad['crawlPage'] ?? false);
  const styles = nestedContainerStyles(theme);
  const { slug } = useParams();

  useEffect(() => {
    const fetchCrawl = async () => {
      dispatch(setLoading({ key: 'crawlPage', value: true }));
      try {
        if (slug) {
          const crawlData = await getBarCrawlByID(slug);
          if (crawlData) {
            dispatch(setSelectedBarCrawl(crawlData));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        dispatch(setLoading({ key: 'crawlPage', value: false }));
      }
    };

    fetchCrawl();
  }, [slug, dispatch]);

  return (
    <AnimatedContainer isEntering={enter.In && enter.Name === 'Crawl'} sx={{ height: '100%' }}>
      <Box sx={styles.root}>
        {isLoading ? (
          <CircularProgress size="24px" sx={{ color: "#FFF" }} />
        ) : (
          <>
            {token === crawl?.userID ? (
              <CrawlContainer mode="owner" />
            ) : (
              <CrawlContainer mode="viewer" />
            )}
          </>
        )}
      </Box>
    </AnimatedContainer>
  );
}

export default Crawl;
