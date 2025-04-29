import React from "react";
import "../styles/components/bar-crawl-card.css";
import { BarCrawlCardProps } from "../types/globalTypes";
import { useTheme } from "@emotion/react";
import { declineBarCrawlInvite, deleteBarCrawl, markUserAsAttending } from "../services/barCrawlService";
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import { setLoading } from "../store/slices/buttonLoadSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setAlert } from "../store/slices/notificationSlice";
import { setBarCrawls } from "../store/slices/userProfileSlice";
import { formatDate } from "../utils/dateUtils"; 
import GroupsIcon from '@mui/icons-material/Groups';
import PublicIcon from '@mui/icons-material/Public';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { setActivePage } from "../store/slices/activePageSlice";
import { useNavigate } from "react-router-dom";

const useBarCrawlCardStyles = (theme: any) => ({
  logo: {
    color: theme.palette.custom?.dark,
    marginBottom: 1,
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
  acceptButton: {
    backgroundColor: theme.palette.custom?.accent,
    color: theme.palette.custom?.light,
    "&:hover": {
      backgroundColor: theme.palette.custom?.highlight,
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

const BarCrawlCard: React.FC<BarCrawlCardProps> = ({ crawl, mode }) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const styles = useBarCrawlCardStyles(theme);
  const isDeleteCrawlLoading = useAppSelector((state) => state.buttonLoad[`deleteCrawl-${crawl.id}`] ?? false);
  const isAttendCrawlLoading = useAppSelector((state) => state.buttonLoad[`attendCrawl-${crawl.id}`] ?? false);
  const isDeclineCrawlLoading = useAppSelector((state) => state.buttonLoad[`declineCrawl-${crawl.id}`] ?? false);
  const barCrawls = useAppSelector((state) => state.userProfile.barCrawls);
  const token = useAppSelector((state) => state.authentication.token);

  const attendeesCount = crawl.attendeess.filter(attendee => attendee.attending).length;
  const formattedStartDate = formatDate(crawl?.startDate ?? "");
  const formattedEndDate = formatDate(crawl?.endDate ?? "");

  const handleDelete = async (id: string) => {
    dispatch(setLoading({ key: `deleteCrawl-${id}`, value: true }));
  
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
      dispatch(setLoading({ key: `deleteCrawl-${id}`, value: false }));
    }
  };

  const handleAttendBarCrawl = async (barCrawlId: string, userId: string) => {
    dispatch(setLoading({ key: `attendCrawl-${barCrawlId}`, value: true }));
    try {
      await markUserAsAttending(barCrawlId, userId);
  
      dispatch(
        setAlert({
          open: true,
          message: "You are going to the bar crawl!",
          severity: "success",
        })
      );
    } catch (error) {
      console.error("Failed to mark bar crawl attendance:", error);
      dispatch(
        setAlert({
          open: true,
          message: "Failed to mark bar crawl attendance.",
          severity: "error",
        })
      );
    } finally {
      dispatch(setLoading({ key: `attendCrawl-${barCrawlId}`, value: false }));
    }
  }

  const handleDeclinedBarCrawl = async (barCrawlId: string, userId: string) => {
    dispatch(setLoading({ key: `declineCrawl-${barCrawlId}`, value: true }));
    try {
      await declineBarCrawlInvite(barCrawlId, userId);
  
      dispatch(
        setAlert({
          open: true,
          message: "You are not going to the bar crawl!",
          severity: "success",
        })
      );
    } catch (error) {
      console.error("Failed to mark bar crawl attendance:", error);
      dispatch(
        setAlert({
          open: true,
          message: "Failed to mark bar crawl attendance.",
          severity: "error",
        })
      );
    } finally {
      dispatch(setLoading({ key: `declineCrawl-${barCrawlId}`, value: false }));
    }
  }

  const handleEditCrawl = (barCrawlId: string) => {
    dispatch(setActivePage({ key: "In", value: false }));
    dispatch(setActivePage({ key: "Name", value: 'Crawl' }));

    setTimeout(() => {
      dispatch(setActivePage({ key: "In", value: true }));
      navigate(`/Crawl/${barCrawlId}`);
    }, 500);
  }

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
            {formattedStartDate && (
              <Typography className="center-row" variant="body2" color="text.secondary" >
                <CalendarMonthIcon sx={{mr: 1}} /> {formattedStartDate} - {formattedEndDate}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" className="center-row">
              <GroupsIcon sx={{mr: 1}} /> {attendeesCount === 1 ? `${attendeesCount} person going` : `${attendeesCount} people going`}
            </Typography>
            <Typography className="intimacy center-row" variant="body2" color="text.secondary" >
              {crawl.intimacyLevel === 'public' ? <PublicIcon sx={{mr: 1}} /> : <AdminPanelSettingsIcon sx={{mr: 1}} />}{crawl.intimacyLevel}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <Divider />

      <CardActions className="button-group" sx={{ justifyContent: "flex-end" }}>
        {mode === 'owned' && (
          <>
            <Button 
              sx={styles.editButton} 
              variant="contained" 
              onClick={() => {
                if (crawl.id) {
                  handleEditCrawl(crawl.id);
                }
              }}
            >
              Edit
            </Button>

            <Button
              onClick={() => crawl.id && handleDelete(crawl.id)}
              variant="contained"
              sx={styles.deleteButton}
            >
              {isDeleteCrawlLoading ? (
                <CircularProgress size="24px" sx={{ color: "#FFF" }}/>
              ) : (
                "Delete"
              )}
            </Button>
          </>
        )}
        {mode === 'invited' && crawl.id && token && (
          <>
            <Button
              sx={styles.viewButton}
              variant="contained"
            >
              View
            </Button>

            <Button 
              sx={styles.acceptButton} 
              variant="contained" 
              onClick={() => {
                if (crawl.id && token) {
                  handleAttendBarCrawl(crawl.id, token);
                }
              }}
            >
              {isAttendCrawlLoading ? (
                <CircularProgress size="24px" sx={{ color: "#FFF" }}/>
              ) : (
                "Accept"
              )}
            </Button>

            <Button
              variant="contained"
              sx={styles.deleteButton}
              onClick={() => {
                if (crawl.id && token) {
                  handleDeclinedBarCrawl(crawl.id, token);
                }
              }}
            >
              {isDeclineCrawlLoading ? (
                <CircularProgress size="24px" sx={{ color: "#FFF" }}/>
              ) : (
                "Decline"
              )}
            </Button>
          </>
        )}
        {mode === 'attendee' && (
          <>
            <Button
              sx={styles.viewButton}
              variant="contained"
            >
              View
            </Button>

            <Button
              variant="contained"
              sx={styles.deleteButton}
              onClick={() => {
                if (crawl.id && token) {
                  handleDeclinedBarCrawl(crawl.id, token);
                }
              }}
            >
              {isDeclineCrawlLoading ? (
                <CircularProgress size="24px" sx={{ color: "#FFF" }}/>
              ) : (
                "Back out"
              )}
            </Button>
          </>
        )}
        {mode === 'public' && (
          <>
            <Button
              sx={styles.viewButton}
              variant="contained"
            >
              View
            </Button>

            <Button sx={styles.acceptButton} variant="contained">
              {isAttendCrawlLoading ? (
                <CircularProgress size="24px" sx={{ color: "#FFF" }}/>
              ) : (
                "Attend"
              )}
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
};

export default BarCrawlCard;
