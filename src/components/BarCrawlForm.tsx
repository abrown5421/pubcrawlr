import { useRef, useState } from "react";
import { Drawer, TextField, Button } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useTheme } from "@mui/system";
import Form, { type FormHandle } from "./Form";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setAlert } from "../store/slices/notificationSlice";

type ValidationErrors = Partial<Record<keyof FormData, string>>;

type FormData = {
  barCrawlName: string;
};

const useBarCrawlStyles = (theme: any) => ({
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

type BarCrawlFormProps = {
  open: boolean;
  onClose: () => void;
  drawerWidth: number;
};

export default function BarCrawlForm({ open, onClose, drawerWidth }: BarCrawlFormProps) {
  const theme = useTheme();
  const styles = useBarCrawlStyles(theme);
  const viewport = useAppSelector(state => state.viewport.type);
  const dispatch = useAppDispatch();
  const crawlForm = useRef<FormHandle>(null);

  const [formData, setFormData] = useState<FormData>({ barCrawlName: "" });
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = (data: FormData): ValidationErrors => {
    const newErrors: ValidationErrors = {};
    if (!data.barCrawlName) {
      newErrors.barCrawlName = "Bar crawl name is required";
    }
    return newErrors;
  };

  const handleSubmit = (data: unknown) => {
    const extractedData = data as FormData;
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

  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prevErrors => {
        const { [field]: _, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  return (
    <>
      <Drawer
        anchor="left"
        open={open}
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
        </Form>
      </Drawer>
    </>
  );
}
