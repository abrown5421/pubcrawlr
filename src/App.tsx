import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { routes } from './routes/routes.ts';
import MainContainer from './containers/MainContainer.tsx';
import Root from './pages/Root.tsx';
import Auth from './pages/Auth.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Crawl from './pages/Crawl.tsx';
import ViewportTracker from './provider/ViewportProvider.tsx';  

function App() {
  return (
    <Provider store={store}>
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
    </Provider>
  );
}


export default App;
