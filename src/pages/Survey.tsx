import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { useStore } from '../store/useStore';
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
  const addSurveyResult = useStore((s) => s.addSurveyResult);

  const allAnswered = Object.values(answers).every((a) => a !== null);

  const handleAnswer = (questionId: number, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    if (!allAnswered) return;

    const surveyAnswers: SurveyAnswer[] = QUESTIONS.map((q) => ({
      questionId: q.id,
      answer: answers[q.id]!,
    }));

    addSurveyResult({
      answers: surveyAnswers,
      submittedAt: new Date().toISOString(),
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <SEO title="Ankieta — dziekujemy!" description="Dziekujemy za wypelnienie ankiety." />
        <Header />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-teal-50 rounded-2xl p-10">
            <div className="w-16 h-16 bg-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Dziekujemy za odpowiedzi!</h1>
            <p className="text-gray-600 mb-6">Twoja ankieta zostala zapisana. Dzieki Twoim odpowiedziom mozemy lepiej dopasowac nasze rekomendacje.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/quiz"
                className="inline-flex items-center justify-center px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors"
              >
                Zrob quiz dopasowania
              </Link>
              <Link
                to="/porownaj"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Przejdz do porownywarki
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
      <SEO title="Ankieta" description="Wypelnij krotka ankiete o Twoich nawykach pielegnacyjnych." />
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Ankieta</h1>
          <p className="text-gray-500">Odpowiedz na 4 krotkie pytania o Twoje nawyki pielegnacyjne</p>
        </div>

        <div className="space-y-6">
          {QUESTIONS.map((q) => (
            <div key={q.id} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <p className="font-medium text-gray-900 mb-4">
                {q.id}. {q.text}
              </p>
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

        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="px-8 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Wyslij odpowiedzi
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          Wyniki ankiety sa zapisywane lokalnie w Twojej przegladarce i nie sa przesylane na serwer.
        </p>
      </main>
      <Footer />
    </>
  );
}
