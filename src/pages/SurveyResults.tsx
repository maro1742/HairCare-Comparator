import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabaseClient';

interface SurveyResultData {
  id: string;
  created_at: string;
  answers: { questionId: number; answer: boolean }[];
  duration_seconds: number | null;
}

export default function SurveyResults() {
  const [results, setResults] = useState<SurveyResultData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResults() {
      try {
        const { data, error } = await supabase
          .from('survey_results')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setResults(data || []);
      } catch (err: any) {
        console.error('Error fetching results:', err);
        setError('Błąd podczas pobierania wyników.');
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, []);

  const formatDuration = (seconds: number | null) => {
    if (seconds === null) return 'brak danych';
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <>
      <SEO title="Wyniki Ankiety" description="Podgląd wyników ankiety użytkowników." />
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wyniki Ankiety</h1>
          <p className="text-gray-500">Przegląd odpowiedzi i czasu wypełniania</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 text-center">
            {error}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Czas</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-center">P1</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-center">P2</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-center">P3</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-center">P4</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {results.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(r.created_at).toLocaleString('pl-PL')}
                      </td>
                      <td className="px-6 py-4 font-medium text-teal-600">
                        {formatDuration(r.duration_seconds)}
                      </td>
                      {r.answers.map((a) => (
                        <td key={a.questionId} className="px-6 py-4 text-center">
                          <span className={`inline-flex px-2 py-1 rounded-md text-xs font-bold ${
                            a.answer ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {a.answer ? 'TAK' : 'NIE'}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {results.length === 0 && (
              <div className="p-12 text-center text-gray-400">
                Brak zapisanych wyników ankiety.
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
