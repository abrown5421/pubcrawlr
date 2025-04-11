import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { routes } from './routes/routes.ts';
import MainContainer from './containers/MainContainer.tsx';
import Root from './pages/Root.tsx';
import Auth from './pages/Auth.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Crawl from './pages/Crawl.tsx';
import ViewportTracker from './provider/ViewportProvider.tsx';  
import Notification from './components/Notification.tsx';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { getUserDataFromId } from './services/userService.ts';
import { setUser } from './store/slices/authenticationSlice.ts';
import { useAppDispatch, useAppSelector } from './store/hooks.ts';
import { setActivePage } from './store/slices/activePageSlice.ts';
import { routeToPageName } from './utils/routeToPageName.ts';
import NotFound from './pages/NotFound';  
import Modal from './components/Modal.tsx';
import { fetchTrianglifyConfig } from './services/tryianglifyService.ts';
import { setMultipleTrianglifyValues } from './store/slices/trianglifySlice.ts';
import { CircularProgress, useTheme } from '@mui/material';
import { setLoading } from './store/slices/buttonLoadSlice.ts';

function AnimationInitializer() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    const pageName = routeToPageName(location.pathname);

    dispatch(setActivePage({ key: "Name", value: pageName }));
    dispatch(setActivePage({ key: "In", value: true }));
  }, [location.pathname]);

  return null;
}

function App() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.authentication.token);
  const authToken = Cookies.get('authId'); 
  const theme = useTheme();
  const isLoading = useAppSelector((state) => state.buttonLoad['mainApp'] ?? false);

  const fetchUserData = async (uid: string) => {
    const userData = await getUserDataFromId(uid);
    dispatch(setUser({
      docId: uid,
      UserEmail: userData?.UserEmail ?? '',
      UserFirstName: userData?.UserFirstName ?? '',
      UserLastName: userData?.UserLastName ?? '',
    }));
    
    console.log(userData);  
  };
  
  useEffect(() => {
    dispatch(setLoading({ key: 'mainApp', value: true }));
    if (authToken) {
      fetchUserData(authToken);
      setTimeout(() => {
        dispatch(setLoading({ key: 'mainApp', value: false }));
      }, 1000)
      
    } else {
      dispatch(setLoading({ key: 'mainApp', value: true }));
      setTimeout(() => {
        dispatch(setLoading({ key: 'mainApp', value: false }));
      }, 1000)
    }

  }, [authToken]);

  return (
    <>
      <Router>
        <AnimationInitializer />
        <MainContainer>
          <ViewportTracker>
            {isLoading ? (
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
                <CircularProgress size="24px" sx={{ color: "#FFF" }} />
              </div>

            ) : (
              <Routes>
                <Route path={routes.root} element={<Root />} />
                <Route
                  path={routes.login}
                  element={token ? <Navigate to={routes.root} replace /> : <Auth mode="login" />}
                />
                <Route
                  path={routes.signup}
                  element={token ? <Navigate to={routes.root} replace /> : <Auth mode="signup" />}
                />
                <Route
                  path={routes.dashboard(':slug')}
                  element={!token ? <Navigate to={routes.root} replace /> : <Dashboard />}
                />
                <Route path={routes.crawl(':slug')} element={<Crawl />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            )}
          </ViewportTracker>
        </MainContainer>
      </Router>
      <Notification />
      <Modal />
    </>
  );
}

export default App;
