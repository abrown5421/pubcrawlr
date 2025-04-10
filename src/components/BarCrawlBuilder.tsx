import { useEffect, useRef, useState } from "react";
import { Drawer, TextField, Button, Typography, Divider } from "@mui/material";
import { useTheme } from "@mui/system";
import Form from "./Form";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setAlert } from "../store/slices/notificationSlice";
import { BcFormFormData, BcFormValidationErrors, SearchHereButtonProps, FormHandle} from "../types/globalTypes";
import BarCard from "./BarCard";
import '../styles/components/bar-crawl-builder.css'
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
  const dispatch = useAppDispatch();
  const crawlForm = useRef<FormHandle>(null);

  const [formData, setFormData] = useState<BcFormFormData>({ barCrawlName: "", selectedBars: selectedBars });
  const [errors, setErrors] = useState<BcFormValidationErrors>({});

  const validate = (data: BcFormFormData): BcFormValidationErrors => {
    const newErrors: BcFormValidationErrors = {};
    if (!data.barCrawlName) {
      newErrors.barCrawlName = "Bar crawl name is required";
    }
    if (selectedBars.length < 2) {
      newErrors.selectedBars = "Please select at least 2 bars";
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

    setFormData({ barCrawlName: "" });
    setErrors({});
    crawlForm.current?.clear();
  };

  const handleChange = (field: keyof BcFormFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
  }, [selectedBars, errors.selectedBars]);
  
  return (
    <>
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
            onChange={handleChange("barCrawlName")}
            sx={{ mb: 2 }}
            error={Boolean(errors.barCrawlName)}
            helperText={errors.barCrawlName || ""}
          />
          
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
    </>
  );
}
