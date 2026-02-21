import { useState } from 'react';

interface IngredientAnalysisProps {
    inci: string;
    categories?: string[];
}

const CATEGORY_STYLES: Record<string, string> = {
    'NAWILŻAJĄCY': 'bg-blue-50 text-blue-600',
    'NATURALNY': 'bg-green-50 text-green-600',
    'ANTYOKSYDANT': 'bg-purple-50 text-purple-600',
    'HUMEKTANT': 'bg-orange-50 text-orange-600',
    'PROTEINOWY': 'bg-pink-50 text-pink-600',
    'EMOLIENT': 'bg-amber-50 text-amber-600',
};

export default function IngredientAnalysis({ inci, categories }: IngredientAnalysisProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Co kryje się w środku?</h2>

            {categories && categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {categories.map((cat) => (
                        <span
                            key={cat}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider ${CATEGORY_STYLES[cat] || 'bg-gray-50 text-gray-500'
                                }`}
                        >
                            {cat}
                        </span>
                    ))}
                </div>
            )}

            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors text-left"
                >
                    <span className="text-sm font-semibold text-gray-700">Pokaż pełny skład (INCI)</span>
                    <svg className={`w-5 h-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                {isOpen && (
                    <div className="p-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 font-mono leading-relaxed break-words">
                            {inci}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
