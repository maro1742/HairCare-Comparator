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
    return (
        <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Skład (INCI)</h2>
            <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-4 shadow-sm">
                <p className="text-xs text-gray-500 font-mono leading-relaxed break-words">
                    {inci}
                </p>
            </div>

            {categories && categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
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
        </section>
    );
}
