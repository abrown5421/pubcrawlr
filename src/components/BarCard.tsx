import React from "react";
import { Place } from "../store/slices/localBarSlice"; 
import { Button, Divider, Typography } from "@mui/material";
import { useTheme } from '@mui/material';
import "../styles/components/bar-card.css";
import placeholderImg from "../../public/assets/images/bar-placeholder.png";

type BarCardProps = {
  bar: Place;  
};
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
});

const BarCard: React.FC<BarCardProps> = ({ bar }) => {
  const theme = useTheme();
  const styles = useBarCardStyles(theme);
  
  return (
    <>
        <div className="bar-card">
            <div className="bar-card-col">
                <img src={placeholderImg} width="150px" />
            </div>
            <div className="bar-card-col add-pad fl-1">
                <Typography
                    variant="h6"
                    component="div"
                    fontWeight={700}
                    sx={styles.logo}
                >
                    {bar.name}
                </Typography>
                <Typography
                    variant="subtitle1"
                    component="div"
                >
                    {bar.vicinity}
                </Typography>
                <Typography
                    variant="caption"
                    component="div"
                >
                    {bar.rating && <p>Rating: {bar.rating}</p>}
                </Typography>
                <Button
                    variant="contained"
                    sx={styles.addButton}
                >
                    Add to Crawl
                </Button>
            </div>
        </div>
        <Divider />
    </>
  );
};

export default BarCard;
