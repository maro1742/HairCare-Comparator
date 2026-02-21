import React from 'react';

interface PEHRadarChartProps {
    proteins: number;
    emollients: number;
    humectants: number;
}

const PEHRadarChart: React.FC<PEHRadarChartProps> = ({ proteins, emollients, humectants }) => {
    // We draw a radar chart using an SVG polygon.
    // P (Top), E (Bottom Right), H (Bottom Left)

    // SVG Coordinate System:
    // Center: (100, 100)
    // Radius: 80

    // Angles:
    // P: -90 deg (Top)
    // E: 30 deg (Bottom Right)
    // H: 150 deg (Bottom Left)

    const center = 100;
    const radius = 70;

    const getCoordinatesForPercent = (percent: number, angleDeg: number) => {
        const rad = (angleDeg * Math.PI) / 180;
        const x = center + (radius * (percent / 100)) * Math.cos(rad);
        const y = center + (radius * (percent / 100)) * Math.sin(rad);
        return { x, y };
    };

    const pCoords = getCoordinatesForPercent(proteins, -90);
    const eCoords = getCoordinatesForPercent(emollients, 30);
    const hCoords = getCoordinatesForPercent(humectants, 150);

    const polygonPoints = `${pCoords.x},${pCoords.y} ${eCoords.x},${eCoords.y} ${hCoords.x},${hCoords.y}`;

    // Determine dominant feature
    let description = "Produkt neutralny PEH.";
    if (proteins > 60) description = "Silnie proteinowy – idealny do odbudowy struktury włosa. Stosuj zamiennie z humektantami.";
    else if (emollients > 60) description = "Emolientowa tarcza – świetnie wygładza, dociąża i chroni przed utratą wilgoci.";
    else if (humectants > 60) description = "Bomba humektantowa – silnie nawilża. Idealny jako podkład przed olejowaniem.";
    else if (proteins > 30 && emollients > 30 && humectants > 30) description = "Zrównoważony PEH – dostarcza włosom wszystkich niezbędnych składników w optymalnych proporcjach.";
    else if (proteins > 40 && emollients > 40) description = "Mieszanka proteinowo-emolientowa – odbudowuje i natychmiastowo wygładza.";
    else if (emollients > 40 && humectants > 40) description = "Mieszanka nawilżająco-emolientowa (EH) – głęboko nawilża i zamyka łuskę włosa.";
    else if (proteins === 0 && emollients > 0 && humectants === 0) description = "Czysty emolient – idealny do zamykania pielęgnacji (O w metodzie OMO).";

    return (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                Profil PEH
            </h3>

            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative w-48 h-48 shrink-0">
                    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm">
                        {/* Background Grid */}
                        <polygon points="100,30 160.6,135 39.4,135" fill="none" stroke="#f3f4f6" strokeWidth="1" />
                        <polygon points="100,53.3 140.4,123.3 59.6,123.3" fill="none" stroke="#f3f4f6" strokeWidth="1" />
                        <polygon points="100,76.6 120.2,111.6 79.8,111.6" fill="none" stroke="#f3f4f6" strokeWidth="1" />

                        {/* Axes */}
                        <line x1="100" y1="100" x2="100" y2="30" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,3" />
                        <line x1="100" y1="100" x2="160.6" y2="135" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,3" />
                        <line x1="100" y1="100" x2="39.4" y2="135" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3,3" />

                        {/* Data Polygon */}
                        <polygon
                            points={polygonPoints}
                            fill="rgba(56, 189, 248, 0.2)"
                            stroke="#0284c7"
                            strokeWidth="2"
                            strokeLinejoin="round"
                            className="transition-all duration-1000 origin-center"
                        />

                        {/* Data Points */}
                        <circle cx={pCoords.x} cy={pCoords.y} r="4" fill="#0284c7" />
                        <circle cx={eCoords.x} cy={eCoords.y} r="4" fill="#16a34a" />
                        <circle cx={hCoords.x} cy={hCoords.y} r="4" fill="#fb923c" />

                        {/* Legend/Labels */}
                        <text x="100" y="20" fontSize="12" fontWeight="bold" fill="#0284c7" textAnchor="middle">P ({proteins}%)</text>
                        <text x="180" y="145" fontSize="12" fontWeight="bold" fill="#16a34a" textAnchor="middle">E ({emollients}%)</text>
                        <text x="20" y="145" fontSize="12" fontWeight="bold" fill="#fb923c" textAnchor="middle">H ({humectants}%)</text>
                    </svg>
                </div>

                <div className="flex-1 space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Proteiny (P)</span>
                            <span className="text-xs font-bold text-blue-700">{proteins}%</span>
                        </div>
                        <div className="w-full bg-blue-50 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${proteins}%` }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Emolienty (E)</span>
                            <span className="text-xs font-bold text-green-700">{emollients}%</span>
                        </div>
                        <div className="w-full bg-green-50 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${emollients}%` }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Humektanty (H)</span>
                            <span className="text-xs font-bold text-orange-700">{humectants}%</span>
                        </div>
                        <div className="w-full bg-orange-50 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${humectants}%` }}></div>
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <p className="text-sm font-medium text-gray-700 leading-snug">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PEHRadarChart;
