import { useEffect, useRef, useState, useCallback } from "react";
import * as maplibregl from 'maplibre-gl';
import "maplibre-gl/dist/maplibre-gl.css";
import AnimatedContainer from "../containers/AnimatedContainer";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Box, useTheme } from "@mui/system";
import PlaceAutocomplete from "../components/PlaceAutocomplete";
import "../styles/pages/root.css";
import { SearchHereButton } from "../utils/CustomMapControls";
import { fetchBars } from "../utils/fetchBars";
import { addBars, clearLocalBars } from "../store/slices/localBarSlice";
import { setDrawerOpen } from '../store/slices/selectedBarSlice';
import { Place } from "../types/globalTypes";
import BarCard from "../components/BarCard";
import { Button, CircularProgress, Collapse, Typography } from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import BarCrawlBuilder from "../components/BarCrawlBuilder";
import { getMarkerPopup } from "../utils/getMarkerPopup";
import { setModal } from "../store/slices/modalSlice";

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
  clearButton: {
    backgroundColor: theme.palette.custom?.error,
    color: theme.palette.custom?.light,
    "&:hover": {
      backgroundColor: theme.palette.custom?.light,
      color: theme.palette.custom?.dark,
    }
  },
});

function Root() {
  const dispatch = useAppDispatch();
  const barResults = useAppSelector(state => state.localBars.bars);
  const viewport = useAppSelector(state => state.viewport.type);
  const enter = useAppSelector(state => state.activePage);
  const drawerOpen = useAppSelector(state => state.selectedBars.drawerOpen);
  const selectedBars = useAppSelector(state => state.selectedBars.selectedBars);
  const theme = useTheme();
  const styles = useRootStyles(theme);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<maplibregl.Marker[]>([]);
  const accentPinRef = useRef<maplibregl.Marker | null>(null); 
  const mapControllerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [visibleBars, setVisibleBars] = useState<Place[]>([]);
  const [drawerWidth, setDrawerWidth] = useState<number>(400);
  const [locationCoords, setLocationCoords] = useState<object>({Lat: '', Lng: ''});

  const normalizePlace = async (place: any): Promise<Place | null> => {
    const name = place.tags?.name;
    const lat = place.lat ?? place.center?.lat;
    const lng = place.lon ?? place.center?.lon;
  
    if (!name || !lat || !lng) return null;
  
    let vicinity = '';
  
    try {
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
      const data = await response.json();
      const { city, state, zipCode } = data.address;
  
      vicinity = [city, state, zipCode].filter(Boolean).join(', ');
    } catch (error) {
      console.error('Failed to fetch reverse geocode data:', error);
      const fallbackParts = [
        place.tags?.["addr:housenumber"],
        place.tags?.["addr:street"],
        place.tags?.["addr:city"],
      ].filter(Boolean);
      vicinity = fallbackParts.join(' ');
    }
  
    return {
      id: place.id.toString(),
      name,
      geometry: {
        location: {
          lat,
          lng,
        },
      },
      vicinity,
    };
  };  
  
  // Fetch bars from fetchBars hook based on latitude and longitude
  const fetchAndStoreBars = async (lat: number, lng: number) => {
    dispatch(setModal({
      open: true,
      title: '',
      body: (
        <div className="app-flex app-col app-jc-center app-ai-center app-w-percent-100 app-h-percent-100">
          <CircularProgress size="24px" sx={{ color: "#000" }} />
          <Typography sx={{mt: 2}}>Fetching Bars, Please Wait...</Typography>
        </div>
      ),
      closeable: false,
    }))
    try {
      const results = await fetchBars(lat, lng);
      const normalizedPlaces = await Promise.all(results.map(normalizePlace));
      const bars: Place[] = normalizedPlaces.filter(
        (bar): bar is Place => bar !== null
      );
  
      dispatch(addBars(bars));
      dispatch(setModal({
          open: false,
          title: '',
          body: '',
          closeable: true,
      }))
    } catch (error) {
      console.error("Error fetching bars:", error);
      dispatch(setModal({
        open: false,
        title: '',
        body: '',
        closeable: true,
    }))
    }
  };

  // Function to add a marker at the center of the map and fetch bars in that area
  const SearchHereClicked = (mapInstance: maplibregl.Map) => {
    const center = mapInstance.getCenter();
    
    if (accentPinRef.current) {
      accentPinRef.current.remove();
    }

    fetchAndStoreBars(center.lat, center.lng);
    setLocationCoords({Lat: center.lat, Lng: center.lng})
  };

  // Handle place selection from autocomplete input list
  const handlePlaceSelect = useCallback(
    async (lat: number, lng: number) => {
      if (!map) return;
      map.flyTo({ center: [lng, lat], zoom: 14 });

      if (accentPinRef.current) {
        accentPinRef.current.remove();
      }

      await fetchAndStoreBars(lat, lng);
    },
    [map]
  );

  // Toggle the drawer open/closed
  const toggleDrawer = (open: boolean) => () => {
    dispatch(setDrawerOpen(open)); 
  };

  // Initialize the map and set user's location
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

        // Add original clocked location pin
        new maplibregl.Marker({
          color: theme.palette.custom.error
        }).setLngLat([longitude, latitude]).addTo(mapInstance);
        setLocationCoords({Lat: latitude, Lng: longitude})
        setMap(mapInstance);
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true }
    );
  }, [map]);

  // Update the visible pins based on map movements
  useEffect(() => {
    if (!map) return;

    const updateVisibleBars = () => {
      const bounds = map.getBounds();
      const inBounds = barResults.filter(bar => {
        const lat = bar.geometry.location.lat;
        const lng = bar.geometry.location.lng;
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

  // Add and remove markers based on the bars visible within the map. This is also where we are handling marker clicks
  useEffect(() => {
    if (!map) return;
    markerRef.current.forEach(marker => marker.remove());
    markerRef.current = [];

    selectedBars.forEach(bar => {
      const lat = bar.geometry.location.lat;
      const lng = bar.geometry.location.lng;

      const marker = new maplibregl.Marker({
        color: theme.palette.custom.highlight
      })
        .setLngLat([lng, lat])
        .setPopup(new maplibregl.Popup().setHTML(getMarkerPopup({
          name: bar.name,
          vicinity: bar.vicinity,
          includeAddBtn: false,
          includeRemBtn: true,
        })))        
        .addTo(map);
        setLocationCoords({Lat: lat, Lng: lng})
      
        markerRef.current.push(marker);
    })

    visibleBars.forEach(bar => {
      const lat = bar.geometry.location.lat;
      const lng = bar.geometry.location.lng;

      const marker = new maplibregl.Marker({
        color: theme.palette.custom.dark
      })
        .setLngLat([lng, lat])
        .setPopup(new maplibregl.Popup().setHTML(getMarkerPopup({
          name: bar.name,
          vicinity: bar.vicinity,
          includeAddBtn: true,
          includeRemBtn: false,
        })))        
        .addTo(map);
        setLocationCoords({Lat: lat, Lng: lng})

      markerRef.current.push(marker);
    });
  }, [map, visibleBars, selectedBars]);

  // Adjust drawer width based on map container size
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
  
  const handleClearBarResults = () => {
    dispatch(clearLocalBars())
  }
  
  return (
    <AnimatedContainer isEntering={enter.In && enter.Name === "Root"} sx={{height: '100%'}}>
      <Box sx={{ height: "100%", backgroundColor: theme.palette.custom?.light }} className={viewport === 'desktop' ? "app-flex app-row" : "app-flex app-col"}>
        <div ref={mapControllerRef} className="app-flex app-col app-overflow-scroll app-h-percent-100 app-fl-3 map-controller">
          <div className={barResults.length > 0 ? "app-flex app-row app-gap-1" : "app-flex app-row"}>
            <div style={{ flexGrow: 1 }}>
              <PlaceAutocomplete onPlaceSelected={handlePlaceSelect} />
            </div>
            {barResults.length > 0 && (
              <div className='app-flex app-ai-center'>
                <Collapse orientation="horizontal" in={barResults.length > 0}>
                  <div>
                    <Button
                      variant="contained"
                      sx={styles.clearButton}
                      onClick={handleClearBarResults}
                    >
                      Clear Results
                    </Button>
                  </div>
                </Collapse>
              </div>
            )}
          </div>
          {viewport === 'desktop' && visibleBars.map((bar) => {
            // console.log(bar)
            return (
              <BarCard key={bar.id} bar={bar} mode="not-selected" />
            )
          })}
        </div>
        <div ref={mapContainerRef} className="app-flex app-col app-relative app-overflow-hidden app-h-percent-100 app-fl-8 map-container">
          <AnimatedContainer 
            entry={viewport !== 'desktop' ? "animate__slideInLeft" : "animate__slideInRight"}
            exit={viewport !== 'desktop' ? "animate__slideOutLeft" : "animate__slideOutRight"} 
            isEntering={selectedBars.length > 0}
            sx={{
              position: 'absolute',
              minWidth: '200px',
              top: viewport !== 'desktop' ? 0 : 'unset',
              left: viewport !== 'desktop' ? 0 : 'unset',
              right: viewport !== 'desktop' ? 'unset' : -20,
              bottom: viewport !== 'desktop' ? 'unset' : 0,
              zIndex: 10
            }}
          >
            <Button
              className="app-absolute open-bar-crawl-button"
              aria-label="Open Bar Crawl"
              sx={styles.openCrawlButton}
              startIcon={<OpenInNewIcon />}
              onClick={toggleDrawer(true)}
            >
              View Bar Crawl
            </Button>
          </AnimatedContainer>
        </div>
        {viewport !== 'desktop' && (
          <Box sx={{ display: "flex", overflowX: "auto", position: "absolute", bottom: 0, width: "100%", padding: "8px", zIndex: 1 }}>
            {visibleBars.map((bar) => (
              <Box key={bar.id} sx={{ minWidth: viewport !== 'mobile' ? 250 : 215, marginRight: theme.spacing(2) }}>
                <BarCard bar={bar} mode="not-selected" />
              </Box>
            ))}
          </Box>
        )}
      </Box>
      
      <BarCrawlBuilder
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        drawerWidth={drawerWidth}
        locationCoords={locationCoords}
      />
    </AnimatedContainer>
  );
}

export default Root;
