import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import QuizWizard from '../components/QuizWizard';
import QuizResults from '../components/QuizResults';
import SEO from '../components/SEO';
import { PRODUCTS } from '../data/products';
import { useStore } from '../store/useStore';
import { trackEvents } from '../lib/track';
import type { UserProfile } from '../types';

export default function Quiz() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const setUserProfile = useStore((s) => s.setUserProfile);
  const updateFilter = useStore((s) => s.updateFilter);
  const navigate = useNavigate();

  const handleComplete = (p: UserProfile) => {
    setProfile(p);
    setUserProfile(p);
    updateFilter('hair_goals', p.hair_goals);
    updateFilter('hair_types', p.hair_type);
    updateFilter('scalp_types', [p.scalp_type]);
    updateFilter('avoid_ingredients', p.avoid_ingredients);
    updateFilter('vegan_only', p.prefers_vegan);
    trackEvents.quiz_complete({
      hair_goals: p.hair_goals,
      hair_type: p.hair_type,
      scalp_type: p.scalp_type,
    });
  };

  const handleRestart = () => {
    setProfile(null);
    trackEvents.quiz_start();
  };

  const handleGoToComparator = () => {
    navigate('/porownaj');
  };

  return (
    <>
      <SEO title="Quiz - Dopasuj kosmetyki" description="Odpowiedz na 5 pytań i znajdź kosmetyki idealne dla Twoich włosów." />
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!profile ? (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-teal-600 mb-2">Twój profil włosów</h1>
              <p className="text-gray-500">Odpowiedz na 5 pytań, a dopasujemy kosmetyki do Twoich potrzeb</p>
            </div>
            <QuizWizard onComplete={handleComplete} />
          </div>
        ) : (
          <div>
            <QuizResults products={PRODUCTS} profile={profile} onRestart={handleRestart} />
            <div className="text-center mt-4">
              <button onClick={handleGoToComparator} className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                Przejdź do porównywarki z tymi filtrami &rarr;
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
