import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Comparator from './pages/Comparator';
import Category from './pages/Category';
import Product from './pages/Product';
import Quiz from './pages/Quiz';
import HowItWorks from './pages/HowItWorks';
import Privacy from './pages/Privacy';
import Cookies from './pages/Cookies';
import Affiliate from './pages/Affiliate';
import AnalyticsDebug from './components/AnalyticsDebug';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-primary font-sans">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/porownaj" element={<Comparator />} />
          <Route path="/kategoria/:slug" element={<Category />} />
          <Route path="/produkt/:slug" element={<Product />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/jak-dziala" element={<HowItWorks />} />
          <Route path="/polityka-prywatnosci" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/wspolpraca-affiliate" element={<Affiliate />} />
        </Routes>
        <AnalyticsDebug />
      </div>
    </BrowserRouter>
  );
}
