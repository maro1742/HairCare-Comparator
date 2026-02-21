import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

const ComparisonWidget: React.FC = () => {
    const comparisonProductIds = useStore((s) => s.comparisonProductIds);

    if (comparisonProductIds.length === 0) return null;

    return (
        <div className="fixed bottom-24 right-4 md:right-8 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Link
                to="/porownanie"
                className="flex items-center gap-3 bg-primary text-white p-2 pr-6 rounded-full shadow-2xl hover:scale-105 transition-all group border-2 border-white/20"
            >
                <div className="relative">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-primary">
                        {comparisonProductIds.length}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60 leading-none mb-1">Porównaj składy</span>
                    <span className="text-sm font-bold leading-none">Twój schowek</span>
                </div>
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </Link>
        </div>
    );
};

export default ComparisonWidget;
