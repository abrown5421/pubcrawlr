import { useEffect, useRef, useState } from "react";
import { Drawer, TextField, Button, Typography, MenuItem } from "@mui/material";
import { useTheme } from "@mui/system";
import Form from "./Form";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setAlert } from "../store/slices/notificationSlice";
import { BcFormFormData, BcFormValidationErrors, SearchHereButtonProps, FormHandle } from "../types/globalTypes";
import BarCard from "./BarCard";
import PublicIcon from '@mui/icons-material/Public';
import GroupsIcon from '@mui/icons-material/Groups';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import '../styles/components/bar-crawl-builder.css';
import { saveBarCrawl } from "../services/barCrawlService";

const useBarCrawlStyles = (theme: any) => ({
  logo: {
    color: theme.palette.custom?.dark,
    fontFamily: "Primary",
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

export default function BarCrawlBuilder({ open, onClose, drawerWidth }: SearchHereButtonProps) {
  const theme = useTheme();
  const styles = useBarCrawlStyles(theme);
  const viewport = useAppSelector(state => state.viewport.type);
  const selectedBars = useAppSelector(state => state.selectedBars.selectedBars);
  const token = useAppSelector((state) => state.authentication.token);
  const dispatch = useAppDispatch();
  const crawlForm = useRef<FormHandle>(null);

  const [formData, setFormData] = useState<BcFormFormData>({
    barCrawlName: "",
    selectedBars: selectedBars,
    intimacyLevel: "Public",
    startDate: "",
    endDate: ""
  });
  const [errors, setErrors] = useState<BcFormValidationErrors>({});

  const validate = (data: BcFormFormData): BcFormValidationErrors => {
    const newErrors: BcFormValidationErrors = {};

    if (!data.barCrawlName) {
      newErrors.barCrawlName = "Bar crawl name is required";
    }
    if (selectedBars.length < 2) {
      newErrors.selectedBars = "Please select at least 2 bars";
    }

    const today = new Date();
    if (data.startDate) {
      const startDate = new Date(data.startDate);
      if (startDate < today) {
        newErrors.startDate = "Start date must be today or in the future.";
      }
    }

    if (data.endDate) {
      if (!data.startDate) {
        newErrors.startDate = "Start date is required if an end date is provided.";
      } else {
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        if (endDate < startDate) {
          newErrors.endDate = "End date must be on or after the start date.";
        }
      }
    }

    return newErrors;
  };

  const handleSubmit = (data: unknown) => {
    const extractedData = data as BcFormFormData;
    const validationErrors = validate(extractedData);

    if (Object.keys(validationErrors).length > 0) {
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

    const startDate = formData.startDate ? new Date(formData.startDate) : undefined;
    const endDate = formData.endDate ? new Date(formData.endDate) : undefined;

    const barCrawlData = {
      userID: token,
      selectedBars: selectedBars,
      crawlName: formData.barCrawlName,
      startDate,
      endDate,
      intimacyLevel: formData.intimacyLevel
    };

    saveBarCrawl(barCrawlData)
      .then(() => {
        setFormData({ barCrawlName: "", intimacyLevel: "Public", selectedBars: selectedBars, startDate: "", endDate: "" });
        setErrors({});
        crawlForm.current?.clear();
      })
      .catch(error => {
        console.error('Failed to save bar crawl:', error);
    });
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
          <MenuItem value="Friends" sx={{ display: 'flex', flexDirection: 'row', padding: '6px' }}>
            <div className="bcb-col"><GroupsIcon sx={{ marginRight: 1 }} /></div>
            <div className="bcb-col">
              Friends
              <Typography variant="caption">Only your friends will have access</Typography>
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
        <Typography
          variant={viewport === 'desktop' ? "h6" : "subtitle1"}
          component="div"
          fontWeight={700}
          sx={styles.logo}
        >
          Bar List:
        </Typography>
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
          variant="contained"
          fullWidth
          className="save-crawl-button"
          sx={styles.openCrawlButton}
        >
          Save Bar Crawl
        </Button>
      </Form>
    </Drawer>
  );
}
