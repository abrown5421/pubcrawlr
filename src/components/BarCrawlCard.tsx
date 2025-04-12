import React, { useState } from "react";
import placeholderImg from "../../public/assets/images/bar-placeholder.png";
import "../styles/components/bar-crawl-card.css";
import { BarCrawlCardProps } from "../types/globalTypes";
import { useTheme } from "@emotion/react";
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Collapse,
  Box,
  Divider,
} from "@mui/material";

const useBarCrawlCardStyles = (theme: any) => ({
  logo: {
    color: theme.palette.custom?.dark,
    fontFamily: "Primary",
  },
  editButton: {
    backgroundColor: theme.palette.custom?.dark,
    color: theme.palette.custom?.light,
    "&:hover": {
      backgroundColor: theme.palette.custom?.light,
      color: theme.palette.custom?.dark,
    },
  },
  viewButton: {
    backgroundColor: theme.palette.custom?.grey,
    color: theme.palette.custom?.dark,
    "&:hover": {
      backgroundColor: theme.palette.custom?.light,
      color: theme.palette.custom?.dark,
    },
  },
});

const BarCrawlCard: React.FC<BarCrawlCardProps> = ({ crawl }) => {
  const theme = useTheme();
  const styles = useBarCrawlCardStyles(theme);
  const [showBars, setShowBars] = useState(false);

  return (
    <Card className="bar-crawl-card" variant="outlined">
      <CardContent>
        <Box className="bar-crawl-header" display="flex" justifyContent="space-between" alignItems="center">
          <Box className="bar-crawl-header-col">
            <Typography sx={styles.logo} variant="h5">{crawl.crawlName}</Typography>
            <Typography className="intimacy" variant="body2" color="text.secondary">
              {crawl.intimacyLevel}
            </Typography>
          </Box>
          <Box className="bar-crawl-header-col">
            <Collapse in={showBars} timeout="auto" unmountOnExit>
              <Box className="bar-list" mt={2}>
                {crawl.selectedBars.map((bar) => {
                  const [imageSrc, setImageSrc] = useState(bar.photoUrl || placeholderImg);

                  const handleImageError = () => {
                    setImageSrc(placeholderImg);
                  };

                  return (
                    <Box key={bar.id} className="bar-item" display="flex" mb={2}>
                      <img
                        src={imageSrc}
                        alt={bar.name}
                        className="bar-image"
                        onError={handleImageError}
                        style={{ width: 100, height: 100, objectFit: "cover", marginRight: 16 }}
                      />
                      <Box className="bar-details">
                        <Typography variant="subtitle1">{bar.name}</Typography>
                        <Typography variant="body2">{bar.vicinity}</Typography>
                        <Typography variant="body2">
                          ⭐ {bar.rating} ({bar.user_ratings_total} reviews)
                        </Typography>
                        {bar.price !== null && (
                          <Typography variant="body2">Price Level: {bar.price}</Typography>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Collapse>
          </Box>
        </Box>

        

        
      </CardContent>
      <Divider />
      <CardActions className="button-group" sx={{ justifyContent: "flex-end" }}>
        <Button
          sx={styles.viewButton} variant="contained"
          onClick={() => setShowBars(!showBars)}
        >
          {showBars ? "Hide" : "View"}
        </Button>
        <Button sx={styles.editButton} variant="contained">
          Edit
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#d32f2f",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#b71c1c",
            },
            ml: 1,
          }}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default BarCrawlCard;
