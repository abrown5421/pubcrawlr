import React from "react"; 
import "animate.css";
import { Box } from '@mui/material';
import { AnimatedContainerProps } from "../types/globalTypes";

const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  isEntering,
  className = "",
  entry = "animate__fadeIn",
  exit = "animate__fadeOut",
  sx = {},
}) => {
  return (
    <Box
      className={`animate__animated ${
        isEntering ? entry : exit
      } ${className}`.trim()}
      sx={{
        "--animate-duration": "500ms",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default AnimatedContainer;
