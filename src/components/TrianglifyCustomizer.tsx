import { Slider, Typography, IconButton, Button, TextField, InputAdornment, CircularProgress } from '@mui/material';
import { SketchPicker, ColorResult } from 'react-color';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setTrianglifyValue } from '../store/slices/trianglifySlice';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { Theme } from "@mui/system";
import theme from "../styles/theme";
import '../styles/components/trianglify-customizer.css';
import TrianglifyBanner from './TrianglifyBanner';
import { saveTrianglifyConfig } from '../services/tryianglifyService';
import { setLoading } from '../store/slices/buttonLoadSlice';
import { setModal } from '../store/slices/modalSlice';
import { setAlert } from '../store/slices/notificationSlice';

const useTCFStyles = (theme: Theme) => ({
    saveButton: {
      marginTop: "16px",
      backgroundColor: theme.palette.custom?.dark,
      color: theme.palette.custom?.light,
      "&:hover": {
        backgroundColor: theme.palette.custom?.light,
        color: theme.palette.custom?.dark,
      },
    },
  });

const TrianglifyCustomizer = () => {
  const dispatch = useAppDispatch();
  const styles = useTCFStyles(theme);
  const trianglify = useAppSelector((state) => state.trianglify);
  const token = useAppSelector((state) => state.authentication.token);
  const viewport = useAppSelector(state => state.viewport.type);
  const isLoading = useAppSelector((state) => state.buttonLoad['saveTrianglifyConfig'] ?? false);
  const [openXPicker, setOpenXPicker] = useState<number | null>(null);
  const [openYPicker, setOpenYPicker] = useState<number | null>(null);

  const updateColor = (key: 'xColors' | 'yColors', index: number, color: string) => {
    const updatedColors = [...trianglify[key]];
    updatedColors[index] = color;
    dispatch(setTrianglifyValue({ key, value: updatedColors }));
  };

  const addColor = (key: 'xColors' | 'yColors') => {
    const updatedColors = [...trianglify[key], '#000000'];
    dispatch(setTrianglifyValue({ key, value: updatedColors }));
  };

  const removeColor = (key: 'xColors' | 'yColors', index: number) => {
    const updatedColors = trianglify[key].filter((_, i) => i !== index);
    dispatch(setTrianglifyValue({ key, value: updatedColors }));
  };

  const handleColorClick = (key: 'xColors' | 'yColors', index: number) => {
    if (key === 'xColors') {
      setOpenXPicker(openXPicker === index ? null : index);
    } else if (key === 'yColors') {
      setOpenYPicker(openYPicker === index ? null : index);
    }
  };

  const handleSaveTrianglify = () => {
    dispatch(setLoading({ key: 'saveTrianglifyConfig', value: true }));
    if (token) {
      dispatch(
        setAlert({
          open: true,
          message: "Banner saved successfully",
          severity: "success",
        })
      );
      dispatch(setModal({
        open: false,
        title: '',
        body:''
      }))
      saveTrianglifyConfig(token, trianglify);
      dispatch(setLoading({ key: 'saveTrianglifyConfig', value: false }));
    } else {
      dispatch(setLoading({ key: 'saveTrianglifyConfig', value: false }));
      console.error("User is not authenticated. Cannot save trianglify config.");
    }
  };
  

  const renderColorPickers = (label: string, key: 'xColors' | 'yColors') => (
    <div>
      <Typography>{label}</Typography>
      {trianglify[key].map((color, index) => (
        <div className='tc-row'>
          {key === 'xColors' && (
            <div className='tc-col flx-1'>
                <IconButton onClick={() => removeColor(key, index)} color="error">
                    <DeleteIcon />
                </IconButton>
            </div>
          )}
          <div className='tc-col flx-3'>
          <TextField
            value={color}
            onClick={() => handleColorClick(key, index)}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" style={{ backgroundColor: color, width: '20px', height: '20px' }} />
              ),
            }}
          />
          </div>
          
          {key !== 'xColors' && (
            <div className='tc-col flx-1'>
                <IconButton onClick={() => removeColor(key, index)} color="error">
                    <DeleteIcon />
                </IconButton>
            </div>
          )}
        </div>
      ))}
      <div className={label !== 'X Colors' ? 'tc-row-rev' : 'tc-row'}>
        <div className='tc-col flx-1'>
            &nbsp;
        </div>
        <div className='tc-col flx-3'>
        <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => addColor(key)}
            sx={{ mt: 2 }}
        >
            {viewport !== 'mobile' && 'Add Color'}
        </Button>
        </div>
      </div>
  
      {(key === 'xColors' ? openXPicker : openYPicker) !== null && (
        <SketchPicker
            color={trianglify[key][(key === 'xColors' ? openXPicker : openYPicker) ?? 0]}
            onChangeComplete={(color: ColorResult) => 
            updateColor(key, (key === 'xColors' ? openXPicker : openYPicker) ?? 0, color.hex)}
            disableAlpha
        />
       )}

    </div>
  );
  
  return (
    <div>
      <TrianglifyBanner {...(token ? { token } : {})} />
      <Typography sx={{ mt: 3 }}>Cell Size</Typography>
      <Slider
        value={trianglify.cellSize}
        min={20}
        max={200}
        step={10}
        onChange={(e, val) =>
          dispatch(setTrianglifyValue({ key: 'cellSize', value: val as number }))
        }
      />

      <Typography gutterBottom>Variance</Typography>
      <Slider
        value={trianglify.variance}
        min={0}
        max={1}
        step={0.05}
        onChange={(e, val) =>
          dispatch(setTrianglifyValue({ key: 'variance', value: val as number }))
        }
      />
      <div className="tc-row">
        <div className="tc-col mr-2">
            {renderColorPickers('X Colors', 'xColors')}
        </div>
        <div className="tc-col">
            {renderColorPickers('Y Colors', 'yColors')}
        </div>
      </div>
        <Button
            variant="contained"
            fullWidth
            style={styles.saveButton}
            onClick={handleSaveTrianglify}
        >
            {isLoading ? <CircularProgress size="24px" sx={{ color: theme.palette?.custom?.light }} /> :  'Save'}
        </Button>
    </div>
  );
};

export default TrianglifyCustomizer;
