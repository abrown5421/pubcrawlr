import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import BarCrawlCard from '../BarCrawlCard';
import "../../styles/components/card-deck.css";
import { useEffect, useState } from 'react';
import { getNearbyBarCrawls, subscribeToBarCrawls } from '../../services/barCrawlService';
import { setLoading } from '../../store/slices/buttonLoadSlice';
import PlaceAutocomplete from '../PlaceAutocomplete'; 

export default function PublicCrawlsTab() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const token = useAppSelector((state) => state.authentication.token);
  const isLoading = useAppSelector(state => state.buttonLoad['discoverPage'] ?? false);

  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [distance, setDistance] = useState<number>(15); 
  const [crawls, setCrawls] = useState<any[]>([]);

  useEffect(() => {
    if (!location) {
      dispatch(setLoading({ key: 'discoverPage', value: true }));
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
            dispatch(setLoading({ key: 'discoverPage', value: false }));
          },
          () => dispatch(setLoading({ key: 'discoverPage', value: false }))
        );
      } else {
        dispatch(setLoading({ key: 'discoverPage', value: false }));
      }
    }
  }, [location, dispatch]);

  useEffect(() => {
    if (!location || !token) return;
  
    const fetchNearestCrawls = async () => {
      dispatch(setLoading({ key: 'discoverPage', value: true }));
      try {
        const crawlData = await getNearbyBarCrawls(location.lat, location.lon, token, distance);
        if (crawlData) setCrawls(crawlData);
      } catch (err) {
        console.error(err);
      } finally {
        dispatch(setLoading({ key: 'discoverPage', value: false }));
      }
    };
  
    const unsubscribeBarCrawls = subscribeToBarCrawls(() => {
      fetchNearestCrawls();
    });

    return () => {
      unsubscribeBarCrawls?.();
    };
  }, [location, distance, token, dispatch]);

  return (
    <Box className="app-w-percent-100 app-overflow-scroll" >
      <div className='app-flex app-row app-jc-between app-gap-1 app-v-m'>
        <div className='app-flex app-col app-fl-10'>
        <PlaceAutocomplete onPlaceSelected={(lat, lon) => setLocation({ lat, lon })} />
        </div>
        <div className='app-flex app-col app-fl-2'>
          <FormControl size="small" fullWidth>
            <InputLabel id="distance-select-label">Search Radius</InputLabel>
            <Select
              labelId="distance-select-label"
              value={distance}
              label="Search Radius"
              onChange={(e) => setDistance(Number(e.target.value))}
            >
              {[5, 10, 15, 20, 25, 30].map((mile) => (
                <MenuItem key={mile} value={mile}>{mile} miles</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
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
