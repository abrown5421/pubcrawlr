import React from "react";
import "animate.css";
import { Box } from '@mui/material';
import { Theme } from "@mui/system";
import theme from "../styles/theme";

const useAnimatedContainerStyles = (theme: Theme) => ({
    root: {
      height: "100%",
      padding: "10px",
      backgroundColor: theme.palette.custom?.light,
    }
});

interface AnimatedContainerProps {
  children: React.ReactNode;
  isEntering: boolean;
  className?: string;
}

const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  isEntering,
  className = "",
}) => {
    
  const styles = useAnimatedContainerStyles(theme);

  return (
    <Box
        className={`animate__animated ${
            isEntering ? "animate__fadeIn" : "animate__fadeOut"
        } ${className}`.trim()}
        sx={styles.root}
    >
        {children}
    </Box>
  );
};

export default AnimatedContainer;
