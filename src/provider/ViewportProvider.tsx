import { useEffect } from "react";
import { useAppDispatch } from "../store/hooks";
import { setViewport } from "../store/slices/viewportSlice";

const ViewportProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleResize = () => {
      dispatch(setViewport({ width: window.innerWidth, height: window.innerHeight }));
    };

    window.addEventListener("resize", handleResize);
    handleResize(); 

    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  return <>{children}</>;
};

export default ViewportProvider;
