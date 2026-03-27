import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useStore } from '../store/useStore';
import { supabase } from '../lib/supabaseClient';
import type { SurveyAnswer } from '../types';

const QUESTIONS = [
  {
    id: 1,
    text: 'Czy dobór produktu do porowatości włosów jest istotny?',
  },
  {
    id: 2,
    text: 'Czy dobór produktu do długości włosów jest istotny?',
  },
  {
    id: 3,
    text: 'Czy odpowiednio dobrany poziom wskaźnika PEH jest istotny?',
    description: 'PEH to skrót od Protein, Emolientów i Humektantów – trzech grup składników niezbędnych do zachowania równowagi włosów.',
  },
  {
    id: 4,
    text: 'Czy koszt jednego użycia jest istotny?',
  },
];

export default function Survey() {
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({
    1: null,
    2: null,
    3: null,
    4: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startTime] = useState<number>(Date.now());
  const addSurveyResult = useStore((s) => s.addSurveyResult);

  const allAnswered = Object.values(answers).every((a) => a !== null);

  const handleAnswer = (questionId: number, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!allAnswered) return;

    const surveyAnswers: SurveyAnswer[] = QUESTIONS.map((q) => ({
      questionId: q.id,
      answer: answers[q.id]!,
    }));

    setIsSubmitting(true);
    setError(null);

    try {
      const durationSeconds = Math.round((Date.now() - startTime) / 1000);

      // Zapisujemy do Supabase
      const { error: dbError } = await supabase
        .from('survey_results')
        .insert([{ 
          answers: surveyAnswers,
          duration_seconds: durationSeconds
        }]);

      if (dbError) throw dbError;

      // Zapisujemy też lokalnie w store (localStorage)
      addSurveyResult({
        answers: surveyAnswers,
        submittedAt: new Date().toISOString(),
        durationSeconds
      });

      setSubmitted(true);
    } catch (err: any) {
      console.error('Error saving survey:', err);
      setError('Wystąpił błąd podczas zapisywania ankiety. Spróbuj ponownie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <SEO title="Ankieta — dziękujemy!" description="Dziękujemy za wypełnienie ankiety." />
        <Header />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-teal-50 rounded-2xl p-10">
            <div className="w-16 h-16 bg-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Dziękujemy za odpowiedzi!</h1>
            <p className="text-gray-600 mb-6">Twoja ankieta została zapisana. Dzięki Twoim odpowiedziom możemy lepiej dopasować nasze rekomendacje.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/quiz"
                className="inline-flex items-center justify-center px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors"
              >
                Zrób quiz dopasowania
              </Link>
              <Link
                to="/porownaj"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Przejdź do porównywarki
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO title="Ankieta" description="Wypełnij krótką ankietę o Twoich nawykach pielęgnacyjnych." />
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Ankieta</h1>
          <p className="text-gray-500">Odpowiedz na 4 krótkie pytania o Twoje nawyki pielęgnacyjne</p>
        </div>

        <div className="space-y-6">
          {QUESTIONS.map((q) => (
            <div key={q.id} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <p className="font-medium text-gray-900 mb-4">
                {q.id}. {q.text}
              </p>
              {q.id === 3 && (
                <p className="text-sm text-gray-500 mb-4 bg-teal-50/50 p-3 rounded-lg border border-teal-100/50">
                  { (q as any).description }
                </p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => handleAnswer(q.id, true)}
                  className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                    answers[q.id] === true
                      ? 'bg-teal-500 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Tak
                </button>
                <button
                  onClick={() => handleAnswer(q.id, false)}
                  className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                    answers[q.id] === false
                      ? 'bg-teal-500 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Nie
                </button>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm text-center border border-red-100">
            {error}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || isSubmitting}
            className="px-8 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center mx-auto min-w-[200px]"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Przesyłanie...
              </>
            ) : (
              'Wyślij odpowiedzi'
            )}
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          Wyniki ankiety są zapisywane w celu ulepszania naszych rekomendacji i analizy potrzeb użytkowników.
        </p>
      </main>
      <Footer />
    </>
  );
}
