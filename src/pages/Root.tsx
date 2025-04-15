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
import { addBars } from "../store/slices/localBarSlice";
import { setDrawerOpen } from '../store/slices/selectedBarSlice';
import { Place } from "../types/globalTypes";
import BarCard from "../components/BarCard";
import { Button } from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import BarCrawlBuilder from "../components/BarCrawlBuilder";
import MapLibreGlDirections, { LoadingIndicatorControl } from "@maplibre/maplibre-gl-directions";
import { getMarkerPopup } from "../utils/getMarkerPopup";

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
  const [directions, setDirections] = useState<MapLibreGlDirections | null>(null);

  // Function to normalize Google Place data into the Place type from globalTypes
  // const normalizePlace = (
  //   place: google.maps.places.PlaceResult
  // ): Place | null => {
  //   if (!place.name || !place.geometry?.location) return null;

  //   const photoUrl = place.photos?.[0]?.getUrl({ maxHeight: place.photos[0].height });

  //   return {
  //     id: place.place_id,
  //     name: place.name,
  //     geometry: {
  //       location: {
  //         lat: () => place.geometry!.location!.lat(),
  //         lng: () => place.geometry!.location!.lng(),
  //       },
  //     },
  //     rating: place.rating,
  //     user_ratings_total: place.user_ratings_total,
  //     vicinity: place.vicinity,
  //     photoUrl,
  //     price: place.price_level,
  //   };
  // };

  // Fetch bars from fetchBars hook based on latitude and longitude
  // const fetchAndStoreBars = async (lat: number, lng: number) => {
  //   try {
  //     const results = await fetchBars(lat, lng);
  //     const bars = results
  //       .map(normalizePlace)
  //       .filter((bar): bar is Place => bar !== null);
  //     dispatch(addBars(bars));
  //   } catch (error) {
  //     console.error("Error fetching bars:", error);
  //   }
  // };

  // Function to add a marker at the center of the map and fetch bars in that area
  const SearchHereClicked = (mapInstance: maplibregl.Map) => {
    const center = mapInstance.getCenter();
    
    if (accentPinRef.current) {
      accentPinRef.current.remove();
    }

    accentPinRef.current = new maplibregl.Marker({
      color: theme.palette.custom.highlight
    }).setLngLat([center.lng, center.lat]).addTo(mapInstance);

    // fetchAndStoreBars(center.lat, center.lng);
  };

  // Handle place selection from autocomplete input list
  const handlePlaceSelect = useCallback(
    async (lat: number, lng: number) => {
      if (!map) return;
      map.flyTo({ center: [lng, lat], zoom: 14 });

      if (accentPinRef.current) {
        accentPinRef.current.remove();
      }

      accentPinRef.current = new maplibregl.Marker({
        color: theme.palette.custom.highlight
      }).setLngLat([lng, lat]).addTo(map);

      // await fetchAndStoreBars(lat, lng);
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
        mapInstance.on('load', () => {
          const newDirections = new MapLibreGlDirections(mapInstance, {
            profile: 'foot'
          });
          mapInstance.addControl(new LoadingIndicatorControl(newDirections));
          setDirections(newDirections);
        });

        // Add error pin
        new maplibregl.Marker({
          color: theme.palette.custom.error
        }).setLngLat([longitude, latitude]).addTo(mapInstance);

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

  // Add and remove markers based on the bars visible within the map. This is also where we are handling marker clicks
  useEffect(() => {
    if (!map) return;
    markerRef.current.forEach(marker => marker.remove());
    markerRef.current = [];

    visibleBars.forEach(bar => {
      const lat = bar.geometry.location.lat();
      const lng = bar.geometry.location.lng();

      const marker = new maplibregl.Marker({
        color: theme.palette.custom.dark
      })
        .setLngLat([lng, lat])
        .setPopup(new maplibregl.Popup().setHTML(getMarkerPopup({
          imageUrl: bar.photoUrl,
          name: bar.name,
          rating: bar.rating,
          includeAddBtn: true
        })))        
        .addTo(map);


      marker.getElement().addEventListener('click', () => {
        map.flyTo({
          center: [lng, lat],
          speed: 0.5,
        });
      });

      markerRef.current.push(marker);
    });
  }, [map, visibleBars]);

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

  useEffect(() => {
    if (selectedBars.length > 1 && directions) {
      directions.setWaypoints(
        selectedBars.map((x): [number, number] => [
          x.geometry.location.lng(),
          x.geometry.location.lat(),
        ])
      );
    } else {
      if (directions) {
        directions.setWaypoints([]);
      }
    }
  }, [selectedBars, directions]);
  
  
  return (
    <AnimatedContainer isEntering={enter.In && enter.Name === "Root"} sx={{height: '100%'}}>
      <Box sx={{ height: "100%", backgroundColor: theme.palette.custom?.light }} className="root-container">
        <div ref={mapControllerRef} className="map-controller">
          <PlaceAutocomplete onPlaceSelected={handlePlaceSelect} />
          {viewport === 'desktop' && visibleBars.map((bar) => (
            <BarCard key={bar.id} bar={bar} mode="not-selected" />
          ))}
        </div>
        <div ref={mapContainerRef} className="map-container">
          <AnimatedContainer 
            entry="animate__slideInRight" 
            exit="animate__slideOutRight" 
            isEntering={selectedBars.length > 0 && viewport !== "desktop"}
            sx={{
              position: 'absolute',
              minWidth: '200px',
              bottom: 0,
              right: 0
            }}
          >
            <Button
              className="open-bar-crawl-button"
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
      <AnimatedContainer 
        entry="animate__slideInRight" 
        exit="animate__slideOutRight" 
        isEntering={selectedBars.length > 0 && viewport === "desktop"}
        sx={{
          position: 'absolute',
          minWidth: '200px',
          bottom: 0,
          right: 0
        }}
      >
        <Button
          className="open-bar-crawl-button"
          aria-label="Open Bar Crawl"
          sx={styles.openCrawlButton}
          startIcon={<OpenInNewIcon />}
          onClick={toggleDrawer(true)}
        >
          View Bar Crawl
        </Button>
      </AnimatedContainer>
      <BarCrawlBuilder
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        drawerWidth={drawerWidth}
      />
    </AnimatedContainer>
  );
}

export default Root;
