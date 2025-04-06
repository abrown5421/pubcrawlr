import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import AnimatedContainer from "../containers/AnimatedContainer";
import { useAppSelector } from "../store/hooks";
import { Box, Theme } from "@mui/system";
import theme from "../styles/theme";
import '../styles/root.css';

const nestedContainerStyles = (theme: Theme) => ({
  root: {
    height: "100%",
    backgroundColor: theme.palette.custom?.light,
  },
});

function Root() {
  const enter = useAppSelector(state => state.activePage);
  const styles = nestedContainerStyles(theme);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  
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

        new maplibregl.Marker().setLngLat([longitude, latitude]).addTo(mapInstance);

        setMap(mapInstance);
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
      { enableHighAccuracy: true }
    );
  }, [map]);

  return (
    <AnimatedContainer isEntering={enter.In && enter.Name === "Root"}>
      <Box sx={styles.root}>
        <div ref={mapContainerRef} className="map-container" />
      </Box>
    </AnimatedContainer>
  );
}

export default Root;
