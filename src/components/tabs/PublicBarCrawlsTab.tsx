import { Box, Typography } from '@mui/material';
import { useAppSelector } from '../../store/hooks';
import BarCrawlCard from '../BarCrawlCard';
import "../../styles/components/card-deck.css";
import { useEffect, useState } from 'react';

export default function PubclicCrawlsTab({ mode }: { mode?: string }) {
  const userProfile = useAppSelector((state) => state.userProfile);
  const token = useAppSelector((state) => state.authentication.token);

  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          setLocationError(error.message);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  }, []);

  return (
    <Box className="app-w-percent-100 app-overflow-scroll">
      {location ? (
        <Typography>
          Your location: Latitude {location.lat}, Longitude {location.lon}
        </Typography>
      ) : locationError ? (
        <Typography color="error">{locationError}</Typography>
      ) : (
        <Typography>Getting your location...</Typography>
      )}
    </Box>
  );
}
