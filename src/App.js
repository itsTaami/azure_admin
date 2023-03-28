import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import AuthProvider from './context/AuthContext';
import CategoryProvider from './context/Category';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <HelmetProvider>
      <CategoryProvider>
        <BrowserRouter>
          <ThemeProvider>
            <AuthProvider>
              <ScrollToTop />
              <StyledChart />
              <Router />
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </CategoryProvider>
    </HelmetProvider>
  );
}
