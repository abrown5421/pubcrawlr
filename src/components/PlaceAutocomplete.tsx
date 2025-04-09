import { useEffect, useRef } from "react";
import { TextField } from "@mui/material";
import { PlaceAutocompleteProps } from "../types/globalTypes";

const PlaceAutocomplete = ({ onPlaceSelected }: PlaceAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["geocode"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      const lat = place.geometry.location?.lat();
      const lng = place.geometry.location?.lng();

      if (lat && lng) onPlaceSelected(lat, lng);
    });

    return () => {
      window.google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [onPlaceSelected]);

  return (
    <TextField
      inputRef={inputRef}
      label="So, where too?"
      variant="outlined"
      size="small"
      sx={{margin: '0px'}}
      fullWidth
    />
  );
};

export default PlaceAutocomplete;
