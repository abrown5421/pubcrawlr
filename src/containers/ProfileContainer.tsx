import { ReactNode, useState } from 'react';
import { Avatar, Box, IconButton, Slider, Typography, useTheme, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import '../styles/containers/profile-container.css';
import { setModal } from '../store/slices/modalSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import TrianglifyBanner from '../components/TrianglifyCustomizer';

const useProfileStyles = (theme: any) => ({
  logo: {
    color: theme.palette.custom?.dark,
    fontFamily: 'Primary',
  },
});

const ProfileContainer = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  const styles = useProfileStyles(theme);
  const token = useAppSelector((state) => state.authentication.token);
  const dispatch = useAppDispatch();

  const [cellSize, setCellSize] = useState(100);
  const [variance, setVariance] = useState(0.75);
  const [xColors, setXColors] = useState('Spectral');
  const [yColors, setYColors] = useState<string | string[]>('YlOrBr');

  const handleImageChange = () => {
    dispatch(setModal({
      open: true,
      title: 'Update Your Banner Image',
      body: '',
    }));
  };

  return (
    <Box className="prof-container">
      <div className="profile-container-banner">
        <TrianglifyBanner 
          cellSize={cellSize} 
          variance={variance} 
          xColors={xColors} 
          yColors={yColors} 
          {...(token ? { seed: token } : {})}
        />
        <Avatar className="profile-avatar"
          sx={{ backgroundColor: theme.palette.custom?.dark, cursor: "pointer" }}
        >
          AB
        </Avatar>
        <IconButton onClick={handleImageChange} sx={{backgroundColor: theme.palette.custom?.light}} className="profile-banner-upload">
          <EditIcon />
        </IconButton>
      </div>

      {/* 🎛️ Controls */}
      <Box sx={{ padding: 2 }}>
        <Typography variant="h6">Customize Your Banner</Typography>

        <Typography gutterBottom>Cell Size</Typography>
        <Slider
          value={cellSize}
          min={20}
          max={200}
          step={10}
          onChange={(e, val) => setCellSize(val as number)}
        />

        <Typography gutterBottom>Variance</Typography>
        <Slider
          value={variance}
          min={0}
          max={1}
          step={0.05}
          onChange={(e, val) => setVariance(val as number)}
        />

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>X Color Palette</InputLabel>
          <Select
            value={xColors}
            label="X Color Palette"
            onChange={(e) => setXColors(e.target.value)}
          >
            <MenuItem value="Spectral">Spectral</MenuItem>
            <MenuItem value="Viridis">Viridis</MenuItem>
            <MenuItem value="RdYlBu">RdYlBu</MenuItem>
            <MenuItem value="Blues">Blues</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Y Color Palette</InputLabel>
          <Select
            value={typeof yColors === 'string' ? yColors : ''}
            label="Y Color Palette"
            onChange={(e) => setYColors(e.target.value)}
          >
            <MenuItem value="YlOrBr">YlOrBr</MenuItem>
            <MenuItem value="BuGn">BuGn</MenuItem>
            <MenuItem value="Reds">Reds</MenuItem>
            <MenuItem value="Greens">Greens</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Profile content */}
      <div className='profile-container-content'>
        <div className='profile-sidebar'>
          <Typography variant="h5" fontWeight={700} sx={styles.logo}>User Name Here</Typography>
          <Typography variant="caption">User email Here</Typography>
          <div className="profile-stat-container">
            {/* Repeatable stats */}
            {['Bar Crawls', 'Groups', 'Friends'].map((label, index) => (
              <div className="profile-stat-column" key={index}>
                <Typography variant="h5" fontWeight={700} sx={styles.logo}>
                  {index === 0 ? '15.8K' : index === 1 ? '8' : '984'}
                </Typography>
                <Typography variant="caption">{label}</Typography>
              </div>
            ))}
          </div>
        </div>
        <div className='profile-content'>
          user profile content here
        </div>
      </div>
    </Box>
  );
};

export default ProfileContainer;
