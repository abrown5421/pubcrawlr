import React from "react";
import "animate.css";
import { Box } from '@mui/material';
import { Theme } from "@mui/system";
import theme from "../styles/theme";
import { AnimatedContainerProps } from "../types/globalTypes";

const useAnimatedContainerStyles = (theme: Theme) => ({
    root: {
      height: "100%"
    }
});

const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  isEntering,
  className = "",
  entry = "animate__fadeIn",
  exit = "animate__fadeOut",
}) => {
    
  const styles = useAnimatedContainerStyles(theme);

  return (
    <Box
    className={`animate__animated ${
        isEntering ? entry : exit
    } ${className}`.trim()}
    sx={{
        ...styles.root,
        "--animate-duration": "500ms", 
    } as React.CSSProperties} 
>
    {children}
</Box>

  );
};

export default AnimatedContainer;
