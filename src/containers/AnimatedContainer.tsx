import React from "react";
import "animate.css";
import { Box } from '@mui/material';
import { Theme } from "@mui/system";
import theme from "../styles/theme";

const useAnimatedContainerStyles = (theme: Theme) => ({
    root: {
      height: "100%"
    }
});

interface AnimatedContainerProps {
  children: React.ReactNode;
  isEntering: boolean;
  className?: string;
  entry?: string;
  exit?: string;
}

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
