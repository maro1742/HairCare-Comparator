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
import PSEOTemplate from './pages/PSEOTemplate';
import RankingHub from './pages/RankingHub';
import Survey from './pages/Survey';
import SurveyResults from './pages/SurveyResults';
import MobileNav from './components/MobileNav';

import { supabase } from './lib/supabaseClient';

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView(location.pathname + location.search);
  }, [location]);

  return null;
}

export default function App() {
  if (!supabase) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-primary/5 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-primary mb-4">Błąd konfiguracji</h1>
          <p className="text-primary/70 mb-6">
            Aplikacja nie mogła zostać zainicjalizowana. Brak wymaganych zmiennych środowiskowych Supabase.
          </p>
          <div className="bg-primary/5 rounded-xl p-4 text-left text-sm font-mono text-primary/80 break-all mb-6">
            Pamiętaj o dodaniu VITE_SUPABASE_URL oraz VITE_SUPABASE_ANON_KEY w ustawieniach Netlify.
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all"
          >
            Odśwież stronę
          </button>
        </div>
      </div>
    );
  }

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
          <Route path="/ranking" element={<RankingHub />} />
          <Route path="/ranking/:category/:attribute?/:problem?" element={<PSEOTemplate />} />
          <Route path="/jak-dziala" element={<HowItWorks />} />
          <Route path="/polityka-prywatnosci" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/wspolpraca-affiliate" element={<Affiliate />} />
          <Route path="/ankieta" element={<Survey />} />
          <Route path="/ankieta-wyniki" element={<SurveyResults />} />
        </Routes>
        <MobileNav />
      </div>
    </BrowserRouter>
  );
}
