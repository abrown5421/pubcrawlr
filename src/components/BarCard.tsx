import React from "react";
import { Button, Divider, IconButton, Typography } from "@mui/material";
import { useTheme } from '@mui/material';
import "../styles/components/bar-card.css";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { BarCardProps } from "../types/globalTypes";
import { addBar, setDrawerOpen } from '../store/slices/selectedBarSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import { removeBar } from "../store/slices/selectedBarSlice";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { removeLocalBar } from "../store/slices/localBarSlice";

const useBarCardStyles = (theme: any) => ({
    logo: {
      color: theme.palette.custom?.dark,
      fontFamily: "Primary",
    },
    addButton: {
      backgroundColor: theme.palette.custom?.dark,
      color: theme.palette.custom?.light,
      "&:hover": {
        backgroundColor: theme.palette.custom?.light,
        color: theme.palette.custom?.dark,
      }
    },
    card: {
        backgroundColor: theme.palette.custom?.light,
    }
});

const BarCard: React.FC<BarCardProps> = ({ bar, mode }) => {
  const theme = useTheme();
  const styles = useBarCardStyles(theme);
  const viewport = useAppSelector(state => state.viewport.type);
  const dispatch = useAppDispatch();

  const handleAddBar = () => {
    dispatch(addBar(bar));
    dispatch(removeLocalBar(bar.name))
    dispatch(setDrawerOpen(true));
  };
  
  const handleRemoveBar = (x: string) => {
    dispatch(removeBar(x));
  };

  const handleLearnMore = async (name: string, vicinity: string) => {
    const query = `${name} ${vicinity}`;
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
        <div style={styles.card} className={mode === 'selected' ? "bar-card app-flex app-row" : (viewport === 'desktop' ? "bar-card app-flex app-row" : "bar-card bar-card-mobile")}>
            <div className="app-flex app-col app-fl-6">
                <Typography
                    variant="h6"
                    component="div"
                    fontWeight={700}
                    sx={styles.logo}
                >
                    {bar.name}
                </Typography>
                <Typography variant="subtitle1" component="div">
                    {typeof bar.vicinity === 'string' ? bar.vicinity.length > 40 ? `${bar.vicinity.slice(0, 37)}...` : bar.vicinity : ''}
                </Typography>
                <div className="app-flex app-row app-ai-center">
                    <Typography
                        onClick={() => handleLearnMore(bar.name, bar.vicinity ?? '')}
                        variant={viewport === "mobile" ? "subtitle1" : "caption"}
                        sx={{
                            color: theme => theme.palette.custom?.accent,
                            cursor: 'pointer',
                            '&:hover': {
                            color: theme => theme.palette.custom?.highlight,
                            },
                        }}
                    >
                        Learn More
                    </Typography>
                </div>
            </div>
            <div className={mode === 'selected' ? "app-flex app-col add-pad app-fl-1 app-jc-center" : "app-flex app-col app-fl-1 app-jc-center"}>
                {mode !== 'selected' && mode !== 'viewing' && (
                    <Button
                        className="add-button"
                        variant="contained"
                        sx={styles.addButton}
                        onClick={handleAddBar}
                    >
                        Add
                    </Button>
                )}
            </div>
            {mode === 'selected' && (
                <IconButton color="error" sx={{height: '40px'}} onClick={() => {handleRemoveBar(bar.name)}}>
                    <DeleteIcon />
                </IconButton>
            )}
            {mode === 'viewing' && (
                <>
                    <IconButton color="success" sx={{ height: '40px', color: theme => theme.palette.custom?.accent}}>
                    <ThumbUpIcon />
                    </IconButton>
                    <IconButton color="error" sx={{ height: '40px', color: theme => theme.palette.custom?.error }}>
                    <ThumbDownIcon />
                    </IconButton>
                </>
            )}
        </div>
        <Divider />
    </>
  );
};

export default BarCard;
