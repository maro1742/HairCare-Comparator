import React from 'react';

interface PriceTrackerProps {
    currentPrice: number;
    originalPrice?: number;
    merchant: string;
}

const PriceTracker: React.FC<PriceTrackerProps> = ({ currentPrice, originalPrice, merchant }) => {
    const discount = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

    return (
        <div className="bg-white rounded-2xl p-4 border border-primary/5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary/40">Najlepsza Cena</span>
                {discount > 0 && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        -{discount}%
                    </span>
                )}
            </div>

            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary">{currentPrice.toFixed(2)} zł</span>
                {originalPrice && originalPrice > currentPrice && (
                    <span className="text-sm text-primary/30 line-through">{originalPrice.toFixed(2)} zł</span>
                )}
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-primary/60">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>Najniższa cena w {merchant}</span>
            </div>

            <div className="mt-4 pt-4 border-t border-primary/5">
                <div className="h-8 flex items-end gap-1 px-1">
                    {[40, 45, 42, 38, 41, 35, 30].map((h, i) => (
                        <div
                            key={i}
                            className={`flex-1 rounded-t-sm ${i === 6 ? 'bg-primary' : 'bg-primary/10'}`}
                            style={{ height: `${h}%` }}
                        />
                    ))}
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-primary/30 uppercase font-medium">
                    <span>7 dni temu</span>
                    <span>Dzisiaj</span>
                </div>
            </div>
        </div>
    );
};

export default PriceTracker;
