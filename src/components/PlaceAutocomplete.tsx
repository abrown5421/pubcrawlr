import { useState, useRef, useEffect } from "react";
import {
  TextField,
  List,
  ListItemButton,
  Collapse,
  ClickAwayListener,
  InputAdornment,
  CircularProgress,
  Box,
  Divider,
  Typography,
} from "@mui/material";
import { PlaceAutocompleteProps } from "../types/globalTypes";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setLoading } from "../store/slices/buttonLoadSlice";
import { Feature } from "../types/globalTypes";
import theme from "../styles/theme";
import "../styles/components/place-autocomplete.css"

const PlaceAutocomplete = ({ onPlaceSelected }: PlaceAutocompleteProps) => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.buttonLoad["searchForPlace"] ?? false);
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Feature[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const skipFetchRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const controller = useRef<AbortController | null>(null);
  const [recentSearches, setRecentSearches] = useState<Feature[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (skipFetchRef.current) {
      skipFetchRef.current = false;
      return;
    }

    if (!inputValue.trim()) {
      dispatch(setLoading({ key: "searchForPlace", value: false }));
      setSuggestions([]);
      return;
    }

    if (controller.current) {
      controller.current.abort();
    }

    controller.current = new AbortController();

    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(inputValue)}&limit=5`,
          { signal: controller.current?.signal }
        );
        const data = await res.json();
        setSuggestions(data.features || []);
        setShowDropdown(true);
        dispatch(setLoading({ key: "searchForPlace", value: false }));
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Photon error:", error);
        }
        dispatch(setLoading({ key: "searchForPlace", value: false }));
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [inputValue, dispatch]);

  const handleSelect = (feature: Feature) => {
    skipFetchRef.current = true;
    const formattedAddress = `${feature.properties.name}${
      feature.properties.city ? `, ${feature.properties.city}` : ""
    }${feature.properties.state ? `, ${feature.properties.state}` : ""}${
      feature.properties.country ? `, ${feature.properties.country}` : ""
    }`;
  
    setInputValue(formattedAddress);
    setSuggestions([]);
    setShowDropdown(false);
  
    const [lng, lat] = feature.geometry.coordinates;
    onPlaceSelected(lat, lng);
  
    // Store in localStorage
    const newSearches = [feature, ...recentSearches.filter(f => f.properties.name !== feature.properties.name)];
    const trimmed = newSearches.slice(0, 3);
    setRecentSearches(trimmed);
    localStorage.setItem("recentSearches", JSON.stringify(trimmed));
  };
  

  const handleClickAway = () => setShowDropdown(false);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div style={{ position: "relative" }}>
        <TextField
          inputRef={inputRef}
          label="So, where to?"
          variant="outlined"
          size="small"
          fullWidth
          value={inputValue}
          onChange={(e) => {
            dispatch(setLoading({ key: "searchForPlace", value: true }));
            setInputValue(e.target.value);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {isLoading && <CircularProgress size={20} />}
              </InputAdornment>
            ),
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 10000,
          }}
        >
          <Collapse in={showDropdown && suggestions.length > 0}>
            <Box className="box-dropdown" sx={{backgroundColor: theme.palette.custom?.light }}>
              <List dense>
                {suggestions.map((feature, index) => (
                  <ListItemButton key={index} onClick={() => handleSelect(feature)}>
                    {feature.properties.name}
                    {feature.properties.city && `, ${feature.properties.city}`}
                    {feature.properties.state && `, ${feature.properties.state}`}
                    {feature.properties.country && `, ${feature.properties.country}`}
                  </ListItemButton>
                ))}
              </List>
              <Divider />
              <Typography variant="caption">Recent Searches</Typography>
              {recentSearches.length > 0 && (
                <Box sx={{ backgroundColor: theme.palette.custom?.light }}>
                  <List dense>
                    {recentSearches.map((feature, index) => (
                      <ListItemButton key={`recent-${index}`} onClick={() => handleSelect(feature)}>
                        {feature.properties.name}
                        {feature.properties.city && `, ${feature.properties.city}`}
                        {feature.properties.state && `, ${feature.properties.state}`}
                        {feature.properties.country && `, ${feature.properties.country}`}
                      </ListItemButton>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          </Collapse>
          

        </div>
      </div>
    </ClickAwayListener>
  );
};

export default PlaceAutocomplete;
