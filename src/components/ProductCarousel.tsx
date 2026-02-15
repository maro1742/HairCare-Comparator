import { useState } from 'react';

interface ProductCarouselProps {
    images: string[];
    alt: string;
}

export default function ProductCarousel({ images, alt }: ProductCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-64 sm:h-96 bg-gray-100 flex items-center justify-center rounded-2xl">
                <span className="text-gray-400">Brak zdjęcia</span>
            </div>
        );
    }

    return (
        <div className="relative group bg-gray-50 rounded-2xl overflow-hidden aspect-square sm:aspect-auto sm:h-[450px]">
            <img
                src={images[currentIndex]}
                alt={alt}
                className="w-full h-full object-contain mix-blend-multiply"
            />

            {images.length > 1 && (
                <>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-white w-4' : 'bg-white/50'
                                    }`}
                                aria-label={`Zdjęcie ${i + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                        <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={() => setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                        <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}
        </div>
    );
}
