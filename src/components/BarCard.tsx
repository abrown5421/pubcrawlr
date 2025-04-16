import React from "react";
import { Button, Divider, IconButton, Typography } from "@mui/material";
import { useTheme } from '@mui/material';
import "../styles/components/bar-card.css";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { BarCardProps } from "../types/globalTypes";
import { addBar, setDrawerOpen } from '../store/slices/selectedBarSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import { removeBar } from "../store/slices/selectedBarSlice";
import { setModal } from "../store/slices/modalSlice";

const useBarCardStyles = (theme: any) => ({
    logo: {
      color: theme.palette.custom?.dark,
      fontFamily: "Primary",
    },
    addButton: {
      backgroundColor: theme.palette.custom?.dark,
      color: theme.palette.custom?.light,
      "&:hover": {
        backgroundColor: theme.palette.custom?.light,
        color: theme.palette.custom?.dark,
      }
    },
    card: {
        backgroundColor: theme.palette.custom?.light,
    }
});

const BarCard: React.FC<BarCardProps> = ({ bar, mode }) => {
  const theme = useTheme();
  const styles = useBarCardStyles(theme);
  const viewport = useAppSelector(state => state.viewport.type);
  const dispatch = useAppDispatch();

  const handleAddBar = () => {
    dispatch(addBar(bar));
    dispatch(setDrawerOpen(true));
  };
  
  const handleRemoveBar = (x: string) => {
    dispatch(removeBar(x));
  };

  const handleLearnMore = async (name: string, lat: number, lng: number) => {
    try {
      const queryParams = new URLSearchParams({
        name: name,
        lat: lat.toString(),
        lng: lng.toString(),
      });
  
      const res = await fetch(`/api/place?${queryParams.toString()}`);
  
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
  
      const data = await res.json();
      console.log("Fetched place data:", data);
  
      dispatch(setModal({
        open: true,
        title: name,
        body: 'fiddle pop',
      }));
  
      return data;
    } catch (err) {
      console.error("Failed to fetch rich place data:", err);
      return null;
    }
  };

  return (
    <>
        <div style={styles.card} className={mode === 'selected' ? "bar-card bar-card-row" : (viewport === 'desktop' ? "bar-card bar-card-row" : "bar-card bar-card-mobile")}>
            <div className="bar-card-col fl-6">
                <Typography
                    variant="h6"
                    component="div"
                    fontWeight={700}
                    sx={styles.logo}
                >
                    {bar.name}
                </Typography>
                <Typography variant="subtitle1" component="div">
                    {typeof bar.vicinity === 'string' ? bar.vicinity.length > 40 ? `${bar.vicinity.slice(0, 37)}...` : bar.vicinity : ''}
                </Typography>
                <div className="bar-card-row ai-cent">
                    <Typography
                        onClick={() => handleLearnMore(bar.name, bar.geometry.location.lat, bar.geometry.location.lng)}
                        variant={viewport === "mobile" ? "subtitle1" : "caption"}
                        sx={{
                            color: theme => theme.palette.custom?.accent,
                            cursor: 'pointer',
                            '&:hover': {
                            color: theme => theme.palette.custom?.highlight,
                            },
                        }}
                    >
                        Learn More
                    </Typography>
                </div>
            </div>
            <div className={mode === 'selected' ? "bar-card-col add-pad fl-1 jc-cent" : "bar-card-col fl-1 jc-cent"}>
                {mode !== 'selected' && (
                    <Button
                        className="add-button"
                        variant="contained"
                        sx={styles.addButton}
                        onClick={handleAddBar}
                    >
                        Add
                    </Button>
                )}
            </div>
            {mode === 'selected' && (
                <IconButton color="error" sx={{height: '40px'}} onClick={() => {handleRemoveBar(bar.name)}}>
                    <DeleteIcon />
                </IconButton>
            )}
        </div>
        <Divider />
    </>
  );
};

export default BarCard;
