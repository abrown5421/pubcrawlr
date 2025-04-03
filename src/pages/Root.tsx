import AnimatedContainer from "../containers/AnimatedContainer";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Box, Theme } from "@mui/system";
import theme from "../styles/theme";
import { useEffect } from "react";
import { setUser } from "../store/slices/authenticationSlice";
import { mockUser } from "../mockUser";

const nestedContainerStyles = (theme: Theme) => ({
    root: {
      height: "100%",
      padding: "10px",
      backgroundColor: theme.palette.custom?.light,
    }
});

function Root() {
  const enter = useAppSelector(state => state.activePage);
  const styles = nestedContainerStyles(theme);
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.authentication)

  // useEffect(()=>{
  //   dispatch(setUser(mockUser)); 
  // }, [])

  useEffect(()=>{console.log(user)}, [user])
  
  return (
    <AnimatedContainer isEntering={enter.In && enter.Name === 'Root'}>
      <Box sx={styles.root}>
        Root
      </Box>
    </AnimatedContainer>
  );
}

export default Root;

