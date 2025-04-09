import React, { useState } from "react";
import { Button, Divider, IconButton, Typography } from "@mui/material";
import { useTheme } from '@mui/material';
import "../styles/components/bar-card.css";
import placeholderImg from "../../public/assets/images/bar-placeholder.png";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { BarCardProps } from "../types/globalTypes";
import { addBar, setDrawerOpen } from '../store/slices/selectedBarSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import { removeBar } from "../store/slices/selectedBarSlice";

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
      },
      marginTop: theme.spacing(2),
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

  const [imageSrc, setImageSrc] = useState(bar.photoUrl || placeholderImg);

  const handleImageError = () => {
    setImageSrc(placeholderImg);
  };

  const handleAddBar = () => {
    dispatch(addBar(bar));
    dispatch(setDrawerOpen(true));
  };
  
  const handleRemoveBar = (x: string) => {
    dispatch(removeBar(x));
  };

  return (
    <>
        <div style={styles.card} className={mode === 'selected' ? "bar-card bar-card-row" : (viewport === 'desktop' ? "bar-card bar-card-row" : "bar-card bar-card-mobile")}>
            <div className="bar-card-col">
                <img
                    src={imageSrc}
                    className={mode === 'selected' ? "card-image-small" : "card-image"}
                    onError={handleImageError} 
                    alt={bar.name}
                />
            </div>
            <div className={mode === 'selected' ? "bar-card-col add-pad fl-1" : "bar-card-col add-pad fl-1 jc-cent"}>
                <div>
                    <Typography
                        variant={viewport === 'desktop' ? "h6" : "subtitle1"}
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
                        {bar.price && (
                            <>
                                <Typography
                                    variant="caption"
                                    component="div"
                                >
                                    <span>{'$'.repeat(bar.price)}</span>
                                </Typography>
                                <div className="pipe">|</div>
                            </>
                        )}
                        <Typography
                            variant="caption"
                            component="div"
                        >
                            {bar.rating && <>Rating: {bar.rating}</>}
                        </Typography>
                    </div>
                </div>
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
