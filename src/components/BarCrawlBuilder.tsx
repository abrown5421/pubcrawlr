import { useEffect, useRef, useState } from "react";
import { Drawer, Box, TextField, Button, Typography, MenuItem, CircularProgress, Collapse, Divider } from "@mui/material";
import { useTheme } from "@mui/system";
import Form from "./Form";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setAlert } from "../store/slices/notificationSlice";
import { addBar, clearBars, setDrawerOpen } from '../store/slices/selectedBarSlice';
import { BcFormFormData, BcFormValidationErrors, SearchHereButtonProps, FormHandle, Attendee } from "../types/globalTypes";
import BarCard from "./BarCard";
import PublicIcon from '@mui/icons-material/Public';
import GroupsIcon from '@mui/icons-material/Groups';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import '../styles/components/bar-crawl-builder.css';
import { saveBarCrawl, updateBarCrawl } from "../services/barCrawlService";
import { setLoading } from "../store/slices/buttonLoadSlice";
import { setModal } from "../store/slices/modalSlice";
import { setActivePage } from "../store/slices/activePageSlice";
import { useNavigate } from "react-router-dom";
import FriendAutocomplete from "./FriendAutocomplete";
import AttendeeBox from "./AttendeeBox";
import { formatDate } from "../utils/dateUtils";

const useBarCrawlStyles = (theme: any) => ({
  logo: {
    color: theme.palette.custom?.dark,
    fontFamily: "Primary",
    marginBottom: "16px"
  },
  loginButton: {
    marginRight: "8px",
    backgroundColor: theme.palette.custom?.grey,
    color: theme.palette.custom?.dark,
    "&:hover": {
      backgroundColor: theme.palette.custom?.light,
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

export default function BarCrawlBuilder({ open, onClose, drawerWidth, locationCoords, mode = 'crawlBeingMade' }: SearchHereButtonProps) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const styles = useBarCrawlStyles(theme);
  const viewport = useAppSelector(state => state.viewport.type);
  const selectedBars = useAppSelector(state => state.selectedBars.selectedBars);
  const crawl = useAppSelector(state => state.selectedBarCrawl.selectedBarCrawl);
  const token = useAppSelector((state) => state.authentication.token);
  const user = useAppSelector((state) => state.authentication.user ?? null);
  const isLoading = useAppSelector((state) => state.buttonLoad['saveCrawl'] ?? false);
  const navigate = useNavigate();
  const crawlForm = useRef<FormHandle>(null);
  const [attendees, setAttendees] = useState<Attendee[]>(user ? [{
    docId: user?.docId ,
    UserFirstName: user?.UserFirstName,
    UserLastName: user?.UserLastName,
    invited: true,
    attending: true,
    creator: true,
    seen: true
  }] : [])
  const [formData, setFormData] = useState<BcFormFormData>({
    barCrawlName: "",
    selectedBars: selectedBars,
    intimacyLevel: "Public",
    startDate: "",
    endDate: ""
  });
  const [errors, setErrors] = useState<BcFormValidationErrors>({});
  const isoStartDate = crawl?.startDate?.slice(0, 10) ?? "";
  const isoEndDate = crawl?.endDate?.slice(0, 10) ?? "";

  useEffect(() => {
    if (mode === 'crawlBeingViewed' && crawl) {
      
      crawl.selectedBars.map((bar) => {
        dispatch(addBar(bar));
      })

      setFormData({
        barCrawlName: crawl.crawlName || "",
        selectedBars: [],
        intimacyLevel: (crawl.intimacyLevel === "Public" || crawl.intimacyLevel === "Groups" || crawl.intimacyLevel === "Private")
          ? crawl.intimacyLevel
          : "Public",
          startDate: isoStartDate,
          endDate: isoEndDate,
      });
  
      setAttendees(Array.isArray(crawl.attendees) ? crawl.attendees : []);
    }
  }, [mode, crawl]);

  useEffect(()=>{console.log(crawl)}, [crawl])

  const parseDate = (dateStr: string): Date => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };
  
  const validate = (data: BcFormFormData): BcFormValidationErrors => {
    const newErrors: BcFormValidationErrors = {};
  
    if (!data.barCrawlName) {
      newErrors.barCrawlName = "Bar crawl name is required";
    }
  
    if (selectedBars.length < 2) {
      newErrors.selectedBars = "Please select at least 2 bars";
    }
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const hasStart = Boolean(data.startDate);
    const hasEnd = Boolean(data.endDate);
  
    if (hasStart) {
      const startDate = parseDate(data.startDate!);
      startDate.setHours(0, 0, 0, 0);
  
      if (startDate < today) {
        newErrors.startDate = "Start date must be today or in the future.";
      }
  
      if (hasEnd) {
        const endDate = parseDate(data.endDate!);
        endDate.setHours(0, 0, 0, 0);
  
        if (endDate < startDate) {
          newErrors.endDate = "End date must be on or after the start date.";
        }
      }
    } else if (hasEnd) {
      newErrors.startDate = "Start date is required if an end date is provided.";
    }
  
    return newErrors;
  };

  const handleAuthFromMod = (path: string, pageName: string) => {
    dispatch(setModal({
      open: false,
      title: '',
      body:''
    }))
    dispatch(setDrawerOpen(false));
    dispatch(setActivePage({ key: "In", value: false }));
    dispatch(setActivePage({ key: "Name", value: pageName }));

    setTimeout(() => {
      dispatch(setActivePage({ key: "In", value: true }));
      navigate( path);
    }, 500);
  }

  const handleSubmit = (data: unknown) => {
    dispatch(setLoading({ key: 'saveCrawl', value: true }));
    const extractedData = data as BcFormFormData;
    const validationErrors = validate(extractedData);

    if (Object.keys(validationErrors).length > 0) {
      dispatch(setLoading({ key: 'saveCrawl', value: false }));
      setErrors(validationErrors);
      dispatch(
        setAlert({
          open: true,
          message: "Please fix the errors before resubmitting",
          severity: "error",
        })
      );
      return;
    }

    if (!token) {
      dispatch(setLoading({ key: 'saveCrawl', value: false }));
      dispatch(setModal({
        open: true,
        title: 'Nice Looking Crawl, Log in to save it!',
        body: (
          <div>
            <Typography id="auth-modal-description" sx={{ mb: 3 }}>
              Log into your account to save it and start inviting friends. Or alternatively, you can create an account and save it then!
            </Typography>
            <div className="bcb-row">
            <Button
              type="submit"
              loading={isLoading}
              variant="contained"
              fullWidth
              onClick={() => handleAuthFromMod("/Login", "Auth")}
              className="save-crawl-button"
              sx={styles.loginButton}
            >
                Login
              </Button>
              <Button
                type="submit"
                loading={isLoading}
                variant="contained"
                fullWidth
                onClick={() => handleAuthFromMod("/Signup", "Auth")}
                className="save-crawl-button"
                sx={styles.openCrawlButton}
              >
                Sign Up
              </Button>
            </div>
          </div>
        ),
      }))
      return;
    }

    const barCrawlData = {
      userID: token,
      selectedBars: selectedBars,
      crawlName: formData.barCrawlName,
      startDate: formData.startDate,
      endDate: formData.endDate,
      intimacyLevel: formData.intimacyLevel,
      attendees: attendees, 
      attendeeIds: [], 
      centerLocation: locationCoords
    };

    if (mode === 'crawlBeingMade') {
      saveBarCrawl(barCrawlData)
        .then(() => {
          setFormData({ barCrawlName: "", intimacyLevel: "Public", selectedBars: selectedBars, startDate: "", endDate: "" });
          setErrors({});
          crawlForm.current?.clear();
          dispatch(clearBars())
          dispatch(setDrawerOpen(false));
          dispatch(
            setAlert({
              open: true,
              message: "Bar crawl saved successfully",
              severity: "success",
            })
          );
        })
        .catch(error => {
          console.error('Failed to save bar crawl:', error);
          dispatch(
            setAlert({
              open: true,
              message: "Bar crawl failed to save, please try again later",
              severity: "error",
            })
          );
        })
        .finally(() => {
          dispatch(setLoading({ key: 'saveCrawl', value: false }));
        })
    } else {
      if (crawl?.id) {
        const { centerLocation, ...barCrawlDataWithoutCenter } = barCrawlData;

      updateBarCrawl(crawl?.id, barCrawlDataWithoutCenter)
          .then(() => {
            setFormData({ barCrawlName: "", intimacyLevel: "Public", selectedBars: selectedBars, startDate: "", endDate: "" });
            setErrors({});
            crawlForm.current?.clear();
            dispatch(clearBars())
            dispatch(setDrawerOpen(false));
            dispatch(
              setAlert({
                open: true,
                message: "Bar crawl saved successfully",
                severity: "success",
              })
            );
          })
          .catch(error => {
            console.error('Failed to save bar crawl:', error);
            dispatch(
              setAlert({
                open: true,
                message: "Bar crawl failed to save, please try again later",
                severity: "error",
              })
            );
          })
          .finally(() => {
            dispatch(setLoading({ key: 'saveCrawl', value: false }));
          })
      }
    }
  };

  const handleTextFieldChange = (field: keyof BcFormFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors.barCrawlName) {
      setErrors(prevErrors => {
        const { barCrawlName: _, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const creatorAttendancePersists = (attendees: Attendee[], creatorID: string): Attendee[] => {
    const creatorExists = attendees.some(a => a.docId === creatorID);
    
    if (!creatorExists) {
      return [
        {
          docId: user?.docId ?? null,
          UserFirstName: user?.UserFirstName ?? "",
          UserLastName: user?.UserLastName ?? "",
          invited: true,
          attending: true,
          creator: true,
          seen: true
        },
        ...attendees
      ];
    }
    
    return attendees;
  };

  const handleAddAttendee = (newAttendee: Attendee) => {
    setAttendees(prev => {
      const alreadyExists = prev.some(att => att.docId === newAttendee.docId);
      if (alreadyExists) return prev;
      return creatorAttendancePersists([...prev, newAttendee], user?.docId ?? '');
    });
  };

  const handleRemoveAttendee = (docIdToRemove: string) => {
    setAttendees(prevAttendees =>
      prevAttendees.filter(att => att.docId !== docIdToRemove || att.creator) 
    );
  };

  useEffect(() => {
    if (selectedBars.length >= 2 && errors.selectedBars) {
      setErrors(prevErrors => {
        const { selectedBars, ...rest } = prevErrors;
        return rest;
      });
    }
    setFormData(prevData => ({
      ...prevData,
      selectedBars: selectedBars, 
    }));
  }, [selectedBars, errors.selectedBars]);

  const formContent = (
    <Form onSave={handleSubmit} ref={crawlForm}>
        <TextField
          size="small"
          name="barCrawlName"
          label="Name Your Bar Crawl"
          variant="outlined"
          fullWidth
          value={formData.barCrawlName}
          onChange={handleTextFieldChange("barCrawlName")}
          sx={{ mb: 2 }}
          error={Boolean(errors.barCrawlName)}
          helperText={errors.barCrawlName || ""}
        />
        <TextField
          value={formData.intimacyLevel}
          size="small"
          onChange={handleTextFieldChange("intimacyLevel")}
          select 
          label="Intimacy Level"
          fullWidth
          sx={{ width: '100%', mb: 1 }}
          inputProps={{
            sx: { display: 'flex', alignItems: 'center' },
          }}
        >
          <MenuItem value="Public" sx={{ display: 'flex', flexDirection: 'row', padding: '6px' }}>
            <div className="bcb-col"><PublicIcon sx={{ marginRight: 1 }} /></div>
            <div className="bcb-col">
              Public
              <Typography variant="caption">Everyone will have access</Typography>
            </div>
          </MenuItem>
          <MenuItem value="Groups" sx={{ display: 'flex', flexDirection: 'row', padding: '6px' }}>
            <div className="bcb-col"><GroupsIcon sx={{ marginRight: 1 }} /></div>
            <div className="bcb-col">
              Group
              <Typography variant="caption">Only a specified group will have access</Typography>
            </div>
          </MenuItem>
          <MenuItem value="Private" sx={{ display: 'flex', flexDirection: 'row', padding: '6px' }}>
            <div className="bcb-col"><LockPersonIcon sx={{ marginRight: 1 }} /></div>
            <div className="bcb-col">
              Private
              <Typography variant="caption">Only invited individuals will have access</Typography>
            </div>
          </MenuItem>
        </TextField>
        <div className="bcb-row">
          <TextField
            size="small"
            name="startDate"
            label="Start Date"
            type="date"
            variant="outlined"
            fullWidth
            value={formData.startDate || ""}
            onChange={handleTextFieldChange("startDate")}
            sx={{ mb: 1, mr: 1 }}
            InputLabelProps={{ shrink: true }}
            error={Boolean(errors.startDate)}
            helperText={errors.startDate || ""}
          />

          <TextField
            size="small"
            name="endDate"
            label="End Date"
            type="date"
            variant="outlined"
            fullWidth
            value={formData.endDate || ""}
            onChange={handleTextFieldChange("endDate")}
            sx={{ mb: 1 }}
            InputLabelProps={{ shrink: true }}
            error={Boolean(errors.endDate)}
            helperText={errors.endDate || ""}
          />
        </div>
        <Collapse in={formData.intimacyLevel === "Private"} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2, mb: 2 }}>
            <FriendAutocomplete friendsOnly={true} onUserSelect={(selectedUser) => {
                handleAddAttendee({
                  docId: selectedUser.docId,
                  UserFirstName: selectedUser.UserFirstName,
                  UserLastName: selectedUser.UserLastName,
                  invited: true,
                  attending: false,
                  creator: false,
                  seen: false
                });
              }}
            />
          </Box>
          <Box style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap'}}>
            {attendees.map((att, index) => {
              if (att.UserFirstName) {
                return (
                  <AttendeeBox
                    key={index}
                    creator={att.creator}
                    firstName={att.UserFirstName}
                    lastName={att.UserLastName ?? undefined}
                    onRemove={() => handleRemoveAttendee(att.docId ?? '')}
                    />
                );
              }
            })}
          </Box>
          
        </Collapse>
        <Collapse in={formData.intimacyLevel === "Groups"} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Select Group
            </Typography>
            {/* group selection module will go here */}
          </Box>
        </Collapse>
        <Divider sx={{mt: 2}} />
        {selectedBars.length > 0 && (
          <div style={{ marginBottom: theme.spacing(2) }}>
            {selectedBars.map((bar, index) => (
              <BarCard key={index} bar={bar} mode="selected" />
            ))}
          </div>
        )}
        {errors.selectedBars && (
          <Typography
            variant="caption"
            color="error"
            sx={{ mb: 1, mt: -1 }}
          >
            {errors.selectedBars}
          </Typography>
        )}
        <Button
          type="submit"
          loading={isLoading}
          variant="contained"
          fullWidth
          className="save-crawl-button"
          sx={styles.openCrawlButton}
        >
          {isLoading ? <CircularProgress size="24px" sx={{ color: theme.palette.custom?.light }} /> :  'Save Bar Crawl'}
        </Button>
      </Form>
  )

  if (mode === 'crawlBeingMade') {
    return (
      <Drawer
        anchor="left"
        open={selectedBars.length > 0 && open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: viewport === "desktop" ? drawerWidth : viewport === "tablet" ? "75%" : "85%",
            backgroundColor: theme.palette.custom?.light,
            padding: 2,
          },
        }}
      >
        {formContent}
      </Drawer>
    );
  }

  return formContent;
}
