import { useEffect } from 'react';
import { Box, CircularProgress, useTheme } from '@mui/material';
import '../styles/containers/crawl-container.css';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useParams } from 'react-router-dom';
import { setLoading } from '../store/slices/buttonLoadSlice';
import { CrawlContainerProps } from '../types/globalTypes';
import TrianglifyBanner from '../components/TrianglifyBanner';

const useCrawlPageStyles = (theme: any) => ({
});

const CrawlContainer: React.FC<CrawlContainerProps> = ({ mode }) => {
    const theme = useTheme();
    const styles = useCrawlPageStyles(theme);
    const isLoading = useAppSelector((state) => state.buttonLoad['crawlPage'] ?? false);
    const dispatch = useAppDispatch();
    const { slug } = useParams();
  
    useEffect(() => {
      if (!slug) return;
  
      dispatch(setLoading({ key: 'crawlPage', value: true }));
  
      const timeout = setTimeout(() => {
        dispatch(setLoading({ key: 'crawlPage', value: false }));
      }, 1000);
  
      return () => {
        clearTimeout(timeout);
      };
    }, [slug]);
  
    return (
      <Box className="crawl-container">
        {isLoading ? (
          <CircularProgress size="24px" sx={{ color: "#FFF" }} />
        ) : (
          <>
            <TrianglifyBanner />
            {mode === 'owner'
              ? "You are the creator of this crawl"
              : "You are not the creator of this crawl"}
          </>
        )}
      </Box>
    );
  };

export default CrawlContainer;
