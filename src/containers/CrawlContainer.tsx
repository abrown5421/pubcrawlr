import { useEffect, useRef, useState } from "react";
import * as maplibregl from 'maplibre-gl';
import "maplibre-gl/dist/maplibre-gl.css";
import { Box, useTheme } from "@mui/system";
import "../styles/pages/root.css";
import '../styles/containers/crawl-container.css';
import { CrawlContainerProps } from '../types/globalTypes';
import { useAppSelector } from "../store/hooks";
import { Button, Divider, Typography } from "@mui/material";
import { formatDate } from "../utils/dateUtils"; 
import GroupsIcon from '@mui/icons-material/Groups';
import PublicIcon from '@mui/icons-material/Public';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BarCard from "../components/BarCard";
import BarCrawlBuilder from "../components/BarCrawlBuilder";
import { useNavigate } from "react-router-dom";
import { setActivePage } from "../store/slices/activePageSlice";
import { useDispatch } from "react-redux";
import AnimatedContainer from "./AnimatedContainer";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { setDrawerOpen } from "../store/slices/selectedBarSlice";

const useCrawlPageStyles = (theme: any) => ({
    logo: {
        color: theme.palette.custom?.dark,
        marginBottom: 1,
        fontWeight: 700,
        fontFamily: "Primary",
    },
    actionButtonDark: {
        backgroundColor: theme.palette.custom?.dark,
        width: 'fit-content',
        color: theme.palette.custom?.light,
        "&:hover": {
          backgroundColor: theme.palette.custom?.light,
          color: theme.palette.custom?.dark,
        },
        marginTop: theme.spacing(2),
    },
    actionButtonLight: {
        backgroundColor: theme.palette.custom?.light,
        color: theme.palette.custom?.dark,
        width: 'fit-content',
        "&:hover": {
          backgroundColor: theme.palette.custom?.grey,
          color: theme.palette.custom?.dark,
        },
        marginTop: theme.spacing(2),
    },
    openCrawlButton: {
        backgroundColor: theme.palette.custom?.dark,
        color: theme.palette.custom?.light,
        "&:hover": {
          backgroundColor: theme.palette.custom?.light,
          color: theme.palette.custom?.dark,
        },
        marginTop: theme.spacing(2),
    },
});

const CrawlContainer: React.FC<CrawlContainerProps> = ({ mode }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const dispatch = useDispatch();
    const styles = useCrawlPageStyles(theme);
    const drawerOpen = useAppSelector(state => state.selectedBars.drawerOpen);
    const viewport = useAppSelector(state => state.viewport.type);
    const token = useAppSelector(state => state.authentication.token);
    const isLoggedIn = useAppSelector(state => state.authentication.isAuthenticated);
    const crawl = useAppSelector(state => state.selectedBarCrawl.selectedBarCrawl);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const ownedCrawl = mode === 'owner';
    const attendeesCount = Array.isArray(crawl?.attendees)
    ? crawl.attendees.filter((attendee) => attendee.attending).length
    : 0;
    const formattedStartDate = formatDate(crawl?.startDate ?? "");
    const formattedEndDate = formatDate(crawl?.endDate ?? "");
    const [isInvited, setIsInvited] = useState<boolean>(false);

    useEffect(() => {
        const isInvitedValue = crawl?.attendeeIds.find(id => id === token);
        setIsInvited(!!isInvitedValue);
    }, [crawl, token]);

    useEffect(() => {
        if (!crawl?.centerLocation || !mapContainerRef.current) return;
    
        const coordObj = crawl.centerLocation as { Lat: number; Lng: number };    
        const mapInstance = new maplibregl.Map({
            container: mapContainerRef.current,
            style: `https://api.maptiler.com/maps/openstreetmap/style.json?key=${import.meta.env.VITE_MAP_TILER_KEY}`,
            center: [coordObj.Lng, coordObj.Lat],
            zoom: 14,
        });
        mapInstance.addControl(new maplibregl.NavigationControl(), "top-right");
    
        new maplibregl.Marker({
            color: theme.palette.custom.error
        }).setLngLat([coordObj.Lng, coordObj.Lat]).addTo(mapInstance);
    
        return () => {
            mapInstance.remove();
        };
    }, [crawl?.centerLocation]);
    
    const handleButtonClick = (path: string, pageName: string) => () => {
        dispatch(setActivePage({ key: "In", value: false }));
        dispatch(setActivePage({ key: "Name", value: pageName }));
    
        setTimeout(() => {
          dispatch(setActivePage({ key: "In", value: true }));
          navigate(path);
        }, 500);
    };

    const toggleDrawer = (open: boolean) => () => {
        dispatch(setDrawerOpen(open)); 
    };
    
    return (
      <Box className="app-flex app-row">
        {isLoggedIn ? (
            <>
                {(crawl?.intimacyLevel ===  'Private' && isInvited) || crawl?.intimacyLevel === 'Public' ? (
                    <>
                        <div className={viewport === 'desktop' ? "app-flex app-col app-overflow-scroll app-fl-3 map-controller" : "app-hidden"}>
                            {ownedCrawl ? (
                                <BarCrawlBuilder
                                    open={true} 
                                    onClose={() => {}} 
                                    drawerWidth={400}
                                    locationCoords={{}}
                                    mode="crawlBeingViewed"
                                />
                            ) : (
                                <>
                                    <Typography sx={styles.logo} variant="h5">
                                    {crawl?.crawlName}
                                    </Typography>
                                    <Typography className="center-row" variant="body2" color="text.secondary" >
                                    <CalendarMonthIcon sx={{mr: 1}} /> {formattedStartDate} - {formattedEndDate}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" className="center-row">
                                    <GroupsIcon sx={{mr: 1}} /> {attendeesCount === 1 ? `${attendeesCount} person going` : `${attendeesCount} people going`}
                                    </Typography>
                                    <Typography className="intimacy center-row" variant="body2" color="text.secondary" >
                                    {crawl?.intimacyLevel === 'Public' ? <PublicIcon sx={{mr: 1}} /> : <AdminPanelSettingsIcon sx={{mr: 1}} />}{crawl?.intimacyLevel}
                                    </Typography>
                                    <Divider sx={{mt: 2}} />
                                    {crawl?.selectedBars.map((bar, index) => (
                                        <BarCard key={index} bar={bar} mode="viewing" />
                                    ))}
                                </>
                            )}
                        </div>
                        <div className='app-flex app-col app-relative app-overflow-hidden app-h-percent-100 app-fl-8 map-container' ref={mapContainerRef} >
                            <AnimatedContainer 
                                entry={viewport !== 'desktop' ? "animate__slideInLeft" : "animate__slideInRight"}
                                exit={viewport !== 'desktop' ? "animate__slideOutLeft" : "animate__slideOutRight"} 
                                isEntering={crawl?.selectedBars.length > 0}
                                sx={{
                                position: 'absolute',
                                minWidth: '200px',
                                top: viewport !== 'desktop' ? 0 : 'unset',
                                left: viewport !== 'desktop' ? 0 : 'unset',
                                right: viewport !== 'desktop' ? 'unset' : -20,
                                bottom: viewport !== 'desktop' ? 'unset' : 0,
                                zIndex: 10
                                }}
                            >
                                <Button
                                    className="app-absolute open-bar-crawl-button"
                                    aria-label="Open Bar Crawl"
                                    sx={styles.openCrawlButton}
                                    startIcon={<OpenInNewIcon />}
                                    onClick={toggleDrawer(true)}
                                >
                                View Bar Crawl
                                </Button>
                            </AnimatedContainer>
                            </div>
                    </>
                ) : (
                    <div className="app-flex app-col app-jc-center app-ai-center app-w-percent-100 no-access-container">
                        <Typography sx={styles.logo} variant="h5">Who do you know here?</Typography>
                        <Typography className="center-row" variant="body2" color="text.secondary" >You are not on the guest list of this private bar crawl.</Typography>
                        <Box className="app-flex app-row app app-jc-between app-gap-1">
                            <Button
                                variant="contained"
                                fullWidth
                                sx={styles.actionButtonLight}
                                onClick={handleButtonClick(`/Dashboard/${token}`, "Dashboard")}
                            >
                                Dashboard
                            </Button>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={styles.actionButtonDark}
                                onClick={handleButtonClick("/", "Root")}
                            >
                                Create a Crawl
                            </Button>
                        </Box>
                    </div>
                )}
            </>
        ) : (
            <div className="app-flex app-col app-jc-center app-ai-center app-w-percent-100 no-access-container">
                <Typography sx={styles.logo} variant="h5">Who do you know here?</Typography>
                <Typography className="center-row" variant="body2" color="text.secondary" >You can only view bar crawl details when you are logged in.</Typography>
                <Box className="app-flex app-row app app-jc-between app-gap-1">
                    <Button
                        variant="contained"
                        fullWidth
                        sx={styles.actionButtonLight}
                        onClick={handleButtonClick("/", "Root")}
                    >
                        Create a Crawl
                    </Button>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={styles.actionButtonDark}
                        onClick={handleButtonClick("/Login", "Auth")}
                    >
                        Login
                    </Button>
                </Box>
            </div>
        )}
        {viewport !== 'desktop' && (
            <BarCrawlBuilder
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                drawerWidth={400}
                locationCoords={{}}
                mode="crawlBeingMadeOnMobile"
            />
        )}
      </Box>
    );
  };

export default CrawlContainer;
