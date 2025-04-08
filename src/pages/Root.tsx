import { useEffect, useRef, useState, useCallback } from "react";
import * as maplibregl from 'maplibre-gl';
import "maplibre-gl/dist/maplibre-gl.css";
import AnimatedContainer from "../containers/AnimatedContainer";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Box } from "@mui/system";
import theme from "../styles/theme";
import PlaceAutocomplete from "../components/PlaceAutocomplete";
import { loadGoogleMapsScript } from "../utils/loadGoogleScript";
import "../styles/pages/root.css";
import { SearchHereButton } from "../utils/CustomMapControls";
import { fetchBars } from "../utils/fetchBars";
import { addBars, Place } from "../store/slices/localBarSlice";
import BarCard from "../components/BarCard";

function Root() {
  const dispatch = useAppDispatch();
  const barResults = useAppSelector(state => state.localBars.bars);
  const enter = useAppSelector(state => state.activePage);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<maplibregl.Marker[]>([]);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [visibleBars, setVisibleBars] = useState<Place[]>([]);

  // --- Helpers ---
  const normalizePlace = (
    place: google.maps.places.PlaceResult
  ): Place | null => {
    if (!place.name || !place.geometry?.location) return null;

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

  // --- Effects ---
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

  return (
    <AnimatedContainer isEntering={enter.In && enter.Name === "Root"}>
      <Box
        sx={{
          height: "100%",
          backgroundColor: theme.palette.custom?.light,
        }}
        className="root-container"
      >
        <div className="map-controller">
          {googleLoaded && (
            <PlaceAutocomplete onPlaceSelected={handlePlaceSelect} />
          )}
          {visibleBars.map((bar) => (
            <BarCard key={bar.name} bar={bar} />
          ))}
        </div>
        <div ref={mapContainerRef} className="map-container" />
      </Box>
    </AnimatedContainer>
  );
}

export default Root;
