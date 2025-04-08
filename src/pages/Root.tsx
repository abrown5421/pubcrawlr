import { useEffect, useRef, useState, useCallback } from "react";
import * as maplibregl from 'maplibre-gl';
import "maplibre-gl/dist/maplibre-gl.css";
import AnimatedContainer from "../containers/AnimatedContainer";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Box, Theme } from "@mui/system";
import theme from "../styles/theme";
import PlaceAutocomplete from "../components/PlaceAutocomplete";
import { loadGoogleMapsScript } from "../utils/loadGoogleScript";
import "../styles/pages/root.css";
import { SearchHereButton } from "../utils/CustomMapControls";
import { fetchBars } from "../utils/fetchBars";
import { addBars } from "../store/slices/localBarSlice";

const nestedContainerStyles = (theme: Theme) => ({
  root: {
    height: "100%",
    backgroundColor: theme.palette.custom?.light,
  },
});

function Root() {
  const enter = useAppSelector(state => state.activePage);
  const barResults = useAppSelector(state => state.localBars);
  const dispatch = useAppDispatch();
  const styles = nestedContainerStyles(theme);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  useEffect(()=>{console.log(barResults)}, [barResults])
  
  useEffect(() => {
    loadGoogleMapsScript().then(() => {
      setGoogleLoaded(true);
    }).catch(console.error);
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

        mapInstance.addControl(new maplibregl.NavigationControl(), 'top-right');
        mapInstance.addControl(new SearchHereButton(SearchHereClicked), 'top-right');
        new maplibregl.Marker().setLngLat([longitude, latitude]).addTo(mapInstance);
        setMap(mapInstance);
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
      { enableHighAccuracy: true }
    );
  }, [map]);

  const handlePlaceSelect = useCallback(async (lat: number, lng: number) => {
    if (map) {
      map.flyTo({ center: [lng, lat], zoom: 14 });
      new maplibregl.Marker().setLngLat([lng, lat]).addTo(map);
  
      try {
        const results = await fetchBars(lat, lng);
        const bars = results
          .filter((place): place is google.maps.places.PlaceResult & { name: string, geometry: { location: google.maps.LatLng } } =>
            !!place.name && !!place.geometry?.location
          )
          .map(place => ({
            name: place.name!,
            geometry: {
              location: {
                lat: () => place.geometry!.location!.lat(),
                lng: () => place.geometry!.location!.lng(),
              },
            },
            rating: place.rating,
            user_ratings_total: place.user_ratings_total,
            vicinity: place.vicinity,
          }));
  
        dispatch(addBars(bars));
      } catch (err) {
        console.error("Error fetching bars:", err);
      }
    }
  }, [map, dispatch]);
  
  const SearchHereClicked = () => {
    console.log('search here');
  };

  return (
    <AnimatedContainer isEntering={enter.In && enter.Name === "Root"}>
      <Box sx={styles.root} className="root-container">
        <div className="map-controller">
          {googleLoaded && (
            <PlaceAutocomplete onPlaceSelected={handlePlaceSelect} />
          )}
        </div>
        <div ref={mapContainerRef} className="map-container" />
      </Box>
    </AnimatedContainer>
  );
}

export default Root;
