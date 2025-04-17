import React, { useState } from "react";
import placeholderImg from "../../public/assets/images/bar-placeholder.png";
import "../styles/components/bar-crawl-card.css";
import { BarCrawlCardProps } from "../types/globalTypes";
import { useTheme } from "@emotion/react";
import { deleteBarCrawl } from "../services/barCrawlService";
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Collapse,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import { setLoading } from "../store/slices/buttonLoadSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setAlert } from "../store/slices/notificationSlice";
import { setBarCrawls } from "../store/slices/userProfileSlice";

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
  deleteButton: {
    backgroundColor: "#d32f2f",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#b71c1c",
    },
    marginLeft: theme.spacing(1),
  },
});

const BarItem: React.FC<{ bar: any }> = ({ bar }) => {
  return (
    <Box className="bar-item" display="flex" mb={2}>
        <Typography variant="subtitle1">{bar.name}</Typography>
        <Typography variant="body2">{bar.vicinity}</Typography>
    </Box>
  );
};

const BarCrawlCard: React.FC<BarCrawlCardProps> = ({ crawl }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const styles = useBarCrawlCardStyles(theme);
  const [showBars, setShowBars] = useState(false);
  const isLoading = useAppSelector((state) => state.buttonLoad["deleteCrawl"] ?? false);
  const barCrawls = useAppSelector((state) => state.userProfile.barCrawls);

  const handleDelete = async (id: string) => {
    dispatch(setLoading({ key: "deleteCrawl", value: true }));
  
    try {
      await deleteBarCrawl(id);
  
      const updatedCrawls = barCrawls.filter((crawlItem) => crawlItem.id !== id);
      dispatch(setBarCrawls(updatedCrawls));
  
      dispatch(
        setAlert({
          open: true,
          message: "Bar Crawl Deleted Successfully!",
          severity: "success",
        })
      );
    } catch (error) {
      console.error("Failed to delete bar crawl:", error);
      dispatch(
        setAlert({
          open: true,
          message: "Failed to delete bar crawl.",
          severity: "error",
        })
      );
    } finally {
      dispatch(setLoading({ key: "deleteCrawl", value: false }));
    }
  };

  return (
    <Card className="bar-crawl-card" variant="outlined">
      <CardContent className="mui-cc-ovrd">
        <Box
          className="bar-crawl-header"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box className="bar-crawl-header-col">
            <Typography sx={styles.logo} variant="h5">
              {crawl.crawlName}
            </Typography>
            <Typography className="intimacy" variant="body2" color="text.secondary">
              {crawl.intimacyLevel}
            </Typography>
          </Box>
          <Box className="bar-crawl-header-col">
            <Collapse in={showBars} timeout="auto" unmountOnExit>
              <Box className="bar-list" mt={2}>
                {crawl.selectedBars.map((bar) => (
                  <BarItem key={bar.id} bar={bar} />
                ))}
              </Box>
            </Collapse>
          </Box>
        </Box>
      </CardContent>

      <Divider />

      <CardActions className="button-group" sx={{ justifyContent: "flex-end" }}>
        <Button
          sx={styles.viewButton}
          variant="contained"
          onClick={() => setShowBars((prev) => !prev)}
        >
          {showBars ? "Hide" : "View"}
        </Button>

        <Button sx={styles.editButton} variant="contained">
          Edit
        </Button>

        <Button
          onClick={() => crawl.id && handleDelete(crawl.id)}
          variant="contained"
          sx={styles.deleteButton}
        >
          {isLoading ? (
            <CircularProgress size="24px" />
          ) : (
            "Delete"
          )}
        </Button>
      </CardActions>
    </Card>
  );
};

export default BarCrawlCard;
