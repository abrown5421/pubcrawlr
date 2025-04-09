import React, { useState } from "react";
import { Button, Divider, Typography } from "@mui/material";
import { useTheme } from '@mui/material';
import "../styles/components/bar-card.css";
import placeholderImg from "../../public/assets/images/bar-placeholder.png";
import { useAppSelector } from "../store/hooks";
import { BarCardProps } from "../types/globalTypes";

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

const BarCard: React.FC<BarCardProps> = ({ bar }) => {
  const theme = useTheme();
  const styles = useBarCardStyles(theme);
  const viewport = useAppSelector(state => state.viewport.type);

  const [imageSrc, setImageSrc] = useState(bar.photoUrl || placeholderImg);

  const handleImageError = () => {
    setImageSrc(placeholderImg);
  };

  return (
    <>
        <div style={styles.card} className="bar-card">
            <div className="bar-card-col">
                <img
                    src={imageSrc}
                    className="card-image"
                    onError={handleImageError} 
                    alt={bar.name}
                />
            </div>
            <div className="bar-card-col add-pad fl-1">
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

                    <Typography
                        variant="caption"
                        component="div"
                    >
                        {bar.rating && <>Rating: {bar.rating}</>}
                    </Typography>
                </div>
                <Button
                    className="add-button"
                    variant="contained"
                    sx={styles.addButton}
                >
                    Add
                </Button>
            </div>
        </div>
        <Divider />
    </>
  );
};

export default BarCard;
