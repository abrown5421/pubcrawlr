import { useEffect, useRef, useState, useCallback } from "react";
import * as maplibregl from 'maplibre-gl';
import "maplibre-gl/dist/maplibre-gl.css";
import AnimatedContainer from "../containers/AnimatedContainer";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Box, useTheme } from "@mui/system";
import PlaceAutocomplete from "../components/PlaceAutocomplete";
import { loadGoogleMapsScript } from "../utils/loadGoogleScript";
import "../styles/pages/root.css";
import { SearchHereButton } from "../utils/CustomMapControls";
import { fetchBars } from "../utils/fetchBars";
import { addBars } from "../store/slices/localBarSlice";
import { Place } from "../types/globalTypes";
import BarCard from "../components/BarCard";
import { Button } from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import BarCrawlForm from "../components/BarCrawlForm";

const useRootStyles = (theme: any) => ({
  openCrawlButton: {
    backgroundColor: theme.palette.custom?.dark,
    color: theme.palette.custom?.light,
    "&:hover": {
      backgroundColor: theme.palette.custom?.light,
      color: theme.palette.custom?.dark,
    },
    marginTop: theme.spacing(2),
  },
});

function Root() {
  const dispatch = useAppDispatch();
  const barResults = useAppSelector(state => state.localBars.bars);
  const viewport = useAppSelector(state => state.viewport.type);
  const enter = useAppSelector(state => state.activePage);
  const theme = useTheme();
  const styles = useRootStyles(theme);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<maplibregl.Marker[]>([]);
  const mapControllerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [visibleBars, setVisibleBars] = useState<Place[]>([]);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [drawerWidth, setDrawerWidth] = useState<number>(400);

  const normalizePlace = (
    place: google.maps.places.PlaceResult
  ): Place | null => {
    if (!place.name || !place.geometry?.location) return null;
  
    const photoUrl = place.photos?.[0]?.getUrl({ maxHeight: place.photos[0].height });
  
    return {
      name: place.name,
      geometry: {
        location: {
          lat: () => place.geometry!.location!.lat(),
          lng: () => place.geometry!.location!.lng(),
        },
      },
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      vicinity: place.vicinity,
      photoUrl,
    };
  };

  const fetchAndStoreBars = async (lat: number, lng: number) => {
    try {
      const results = await fetchBars(lat, lng);
      const bars = results
        .map(normalizePlace)
        .filter((bar): bar is Place => bar !== null);
      dispatch(addBars(bars));
    } catch (error) {
      console.error("Error fetching bars:", error);
    }
  };

  const SearchHereClicked = (mapInstance: maplibregl.Map) => {
    const center = mapInstance.getCenter();
    new maplibregl.Marker().setLngLat([center.lng, center.lat]).addTo(mapInstance);
    fetchAndStoreBars(center.lat, center.lng);
  };

  const handlePlaceSelect = useCallback(
    async (lat: number, lng: number) => {
      if (!map) return;
      map.flyTo({ center: [lng, lat], zoom: 14 });
      new maplibregl.Marker().setLngLat([lng, lat]).addTo(map);
      await fetchAndStoreBars(lat, lng);
    },
    [map]
  );

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  useEffect(() => {
    loadGoogleMapsScript()
      .then(() => setGoogleLoaded(true))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || map) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const mapInstance = new maplibregl.Map({
          container: mapContainerRef.current!,
          style: `https://api.maptiler.com/maps/openstreetmap/style.json?key=${import.meta.env.VITE_MAP_TILER_KEY}`,
          center: [longitude, latitude],
          zoom: 14,
        });

        mapInstance.addControl(new maplibregl.NavigationControl(), "top-right");
        mapInstance.addControl(new SearchHereButton(SearchHereClicked), "top-right");
        new maplibregl.Marker().setLngLat([longitude, latitude]).addTo(mapInstance);

        setMap(mapInstance);
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true }
    );
  }, [map]);

  useEffect(() => {
    if (!map) return;
  
    const updateVisibleBars = () => {
      const bounds = map.getBounds();
      const inBounds = barResults.filter(bar => {
        const lat = bar.geometry.location.lat();
        const lng = bar.geometry.location.lng();
        return bounds.contains([lng, lat]);
      });
      setVisibleBars(inBounds);
    };
  
    map.on("moveend", updateVisibleBars);
    updateVisibleBars();
  
    return () => {
      map.off("moveend", updateVisibleBars);
    };
  }, [map, barResults]);
  
  useEffect(() => {
    if (!map) return;

    markerRef.current.forEach(marker => marker.remove());
    markerRef.current = [];

    visibleBars.forEach(bar => {
      const lat = bar.geometry.location.lat();
      const lng = bar.geometry.location.lng();
      const marker = new maplibregl.Marker().setLngLat([lng, lat]).addTo(map);
      markerRef.current.push(marker);
    });
  }, [map, visibleBars]);

  useEffect(() => {
    if (mapControllerRef.current) {
      const observer = new ResizeObserver(() => {
        const width = mapControllerRef.current?.offsetWidth ?? 400;
        setDrawerWidth(width);
      });
  
      observer.observe(mapControllerRef.current);
  
      return () => observer.disconnect();
    }
  }, []);
  
  return (
    <AnimatedContainer isEntering={enter.In && enter.Name === "Root"}>
      <Box
        sx={{
          height: "100%",
          backgroundColor: theme.palette.custom?.light,
        }}
        className="root-container"
      >
        <div ref={mapControllerRef} className="map-controller">
          {googleLoaded && (
            <PlaceAutocomplete onPlaceSelected={handlePlaceSelect} />
          )}
          {viewport === 'desktop'  && visibleBars.map((bar) => (
            <BarCard key={bar.name} bar={bar} />
          ))}
        </div>
        <div ref={mapContainerRef} className="map-container" />
        {viewport !== 'desktop' && (
          <Box
            sx={{
              display: "flex",
              overflowX: "auto",
              position: "absolute",
              bottom: 0,
              width: "100%",
              padding: "8px",
              zIndex: 1,
            }}
          >
            {visibleBars.map((bar) => (
              <Box key={bar.name} sx={{ minWidth: 250, marginRight: theme.spacing(2) }}>
                <BarCard bar={bar} />
              </Box>
            ))}
          </Box>
        )}
      </Box>
      <Button
        className="open-bar-crawl-button"
        aria-label="Open Bar Crawl"
        sx={styles.openCrawlButton}
        startIcon={<OpenInNewIcon />}
        onClick={toggleDrawer(true)}
      >
        View Bar Crawl
      </Button>
      <BarCrawlForm
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        drawerWidth={drawerWidth}
      />
    </AnimatedContainer>
  );
}

export default Root;
