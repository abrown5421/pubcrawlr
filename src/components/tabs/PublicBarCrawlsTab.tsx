import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import BarCrawlCard from '../BarCrawlCard';
import "../../styles/components/card-deck.css";
import { useEffect, useState } from 'react';
import { getNearbyBarCrawls } from '../../services/barCrawlService';
import { setLoading } from '../../store/slices/buttonLoadSlice';

export default function PublicCrawlsTab() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const token = useAppSelector((state) => state.authentication.token);
  const isLoading = useAppSelector(state => state.buttonLoad['discoverPage'] ?? false);

  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [crawls, setCrawls] = useState<any[]>([]);

  useEffect(() => {
    dispatch(setLoading({ key: 'discoverPage', value: true }));
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          dispatch(setLoading({ key: 'discoverPage', value: false }));
        }
      );
    } else {
      dispatch(setLoading({ key: 'discoverPage', value: false }));
    }
  }, []);

  useEffect(() => {
    const fetchNearestCrawls = async () => {
      dispatch(setLoading({ key: 'discoverPage', value: true }));
      try {
        if (location && token) {
          const crawlData = await getNearbyBarCrawls(location.lat, location.lon, token);
          if (crawlData) {
            setCrawls(crawlData);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        dispatch(setLoading({ key: 'discoverPage', value: false }));
      }
    };

    fetchNearestCrawls();
  }, [location]);

  return (
    <Box className="app-w-percent-100 app-overflow-scroll">
      {isLoading ? (
        <CircularProgress size="24px" sx={{ color: theme.palette.custom?.dark }} />
      ) : (
        <>
          {crawls.length > 0 ? (
            crawls.map((crawl) => (
              <BarCrawlCard key={crawl.crawlName} crawl={crawl} mode="public" />
            ))
          ) : (
            <Typography variant="caption">No public bar crawls found near your location.</Typography>
          )}
        </>
      )}
    </Box>
  );
}
