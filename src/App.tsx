import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { trackPageView } from './utils/gtm';
import Landing from './pages/Landing';
import Comparator from './pages/Comparator';
import Comparison from './pages/Comparison';
import Category from './pages/Category';
import Product from './pages/Product';
import Quiz from './pages/Quiz';
import HowItWorks from './pages/HowItWorks';
import Privacy from './pages/Privacy';
import Cookies from './pages/Cookies';
import Affiliate from './pages/Affiliate';
import MobileNav from './components/MobileNav';

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AnalyticsTracker />
      <div className="min-h-screen bg-background text-primary font-sans pb-20 lg:pb-0">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/porownaj" element={<Comparator />} />
          <Route path="/porownanie" element={<Comparison />} />
          <Route path="/kategoria/:slug" element={<Category />} />
          <Route path="/produkt/:slug" element={<Product />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/jak-dziala" element={<HowItWorks />} />
          <Route path="/polityka-prywatnosci" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/wspolpraca-affiliate" element={<Affiliate />} />
        </Routes>
        <MobileNav />
      </div>
    </BrowserRouter>
  );
}
