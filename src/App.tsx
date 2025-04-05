import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes/routes.ts';
import MainContainer from './containers/MainContainer.tsx';
import Root from './pages/Root.tsx';
import Auth from './pages/Auth.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Crawl from './pages/Crawl.tsx';
import ViewportTracker from './provider/ViewportProvider.tsx';  
import Notification from './components/Notification.tsx';
import Cookies from 'js-cookie'
import { useEffect } from 'react';
import { getUserDataFromId } from './services/userService.ts';
import { setUser } from './store/slices/authenticationSlice.ts';
import { useAppDispatch } from './store/hooks.ts';

function App() {
  const dispatch = useAppDispatch()
  const authToken = Cookies.get('authId'); 

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
    if (authToken) {
      fetchUserData(authToken);
    }
  }, [authToken]);

  return (
    <>
      <Router>
        <MainContainer>
          <ViewportTracker>
            <Routes>
              <Route path={routes.root} element={<Root />} />
              <Route path={routes.login} element={<Auth mode="login" />} />
              <Route path={routes.signup} element={<Auth mode="signup" />} />
              <Route path={routes.dashboard} element={<Dashboard />} />
              <Route path={routes.crawl(':slug')} element={<Crawl />} />
            </Routes>
          </ViewportTracker>
        </MainContainer>
      </Router>
      <Notification />
    </>
  );
}

export default App;
