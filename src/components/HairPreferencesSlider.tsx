import React from 'react';

type HairLength = 'short' | 'medium' | 'long';
type Porosity = 'low' | 'medium' | 'high';

interface HairPreferencesSliderProps {
    hairLength: HairLength;
    porosity: Porosity;
    onChange: (length: HairLength, porosity: Porosity) => void;
}

export default function HairPreferencesSlider({
    hairLength,
    porosity,
    onChange
}: HairPreferencesSliderProps) {

    const lengths: { value: HairLength; label: string; image: string }[] = [
        { value: 'short', label: 'Krótkie', image: '/images/hair-short.png' },
        { value: 'medium', label: 'Średnie', image: '/images/hair-medium.png' },
        { value: 'long', label: 'Długie', image: '/images/hair-long.png' },
    ];

    const porosities: { value: Porosity; label: string; description: string; icon: React.ReactNode }[] = [
        {
            value: 'low',
            label: 'Niska',
            description: 'Gładkie, lśniące, trudne do stylizacji',
            icon: (
                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                    <svg className="w-8 h-8 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 8h12M6 12h12M6 16h12" />
                    </svg>
                </div>
            )
        },
        {
            value: 'medium',
            label: 'Średnia',
            description: 'Najczęstszy typ, lekko falujące',
            icon: (
                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                    <svg className="w-8 h-8 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 8h12M6 12h8M10 16h8" />
                    </svg>
                </div>
            )
        },
        {
            value: 'high',
            label: 'Wysoka',
            description: 'Suche, matowe, skręcone, puszące się',
            icon: (
                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                    <svg className="w-8 h-8 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 8l6 3 6-3M6 16l6 3 6-3M6 12h12" />
                    </svg>
                </div>
            )
        },
    ];

    return (
        <div className="space-y-8 p-6 bg-white rounded-[32px] shadow-xl border border-gray-100 max-w-lg mx-auto">
            {/* Hair Length Section */}
            <div>
                <div className="mb-4">
                    <h3 className="text-xl font-black text-gray-900 mb-1">Długość włosów</h3>
                    <p className="text-sm text-gray-500">Wybierz aktualną długość swoich włosów</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {lengths.map((item) => (
                        <button
                            key={item.value}
                            onClick={() => onChange(item.value, porosity)}
                            className="flex flex-col items-center group"
                        >
                            <div className={`relative mb-3 w-full aspect-square rounded-2xl overflow-hidden bg-gray-50 border-2 transition-all duration-300 ${hairLength === item.value
                                ? 'border-teal-400 ring-2 ring-teal-400 ring-offset-2'
                                : 'border-transparent group-hover:border-teal-100'
                                }`}>
                                <img
                                    src={item.image}
                                    alt={item.label}
                                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                                />
                                {hairLength === item.value && (
                                    <div className="absolute top-2 right-2 bg-teal-500 rounded-full p-1 shadow-lg ring-2 ring-white animate-in zoom-in-50 duration-300">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <span className={`text-sm font-bold transition-colors ${hairLength === item.value ? 'text-teal-600' : 'text-gray-900 group-hover:text-teal-500'}`}>
                                {item.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Porosity Section */}
            <div>
                <div className="mb-4">
                    <h3 className="text-xl font-black text-gray-900 mb-1">Porowatość włosów</h3>
                    <p className="text-sm text-gray-500">Określ stopień rozchylenia łusek</p>
                </div>
                <div className="space-y-3">
                    {porosities.map((item) => (
                        <button
                            key={item.value}
                            onClick={() => onChange(hairLength, item.value)}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 text-left ${porosity === item.value
                                ? 'border-teal-400 bg-teal-50/30'
                                : 'border-gray-50 bg-gray-50/50 hover:border-teal-100 hover:bg-white'
                                }`}
                        >
                            {item.icon}
                            <div className="flex-1 min-w-0">
                                <div className="text-base font-black text-gray-900 mb-0.5">{item.label}</div>
                                <div className="text-xs text-gray-500 leading-relaxed truncate">{item.description}</div>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${porosity === item.value
                                ? 'bg-teal-500 border-teal-500 shadow-md'
                                : 'border-gray-300'
                                }`}>
                                {porosity === item.value && (
                                    <svg className="w-3.5 h-3.5 text-white animate-in zoom-in-50 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
