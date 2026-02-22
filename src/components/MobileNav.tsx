import { Link, useLocation } from 'react-router-dom';

export default function MobileNav() {
    const location = useLocation();

    const navItems = [
        {
            label: 'Dom',
            path: '/',
            icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            label: 'Analiza',
            path: '/quiz',
            icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            )
        },
        {
            label: 'Produkty',
            path: '/porownaj?defaults=true',
            icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    {/* Outline of two product bottles */}
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h4v12H7V7zm3-4h-2M13 10h4v9h-4v-9zm3-3h-2" />
                </svg>
            )
        },
        {
            label: 'Porównanie',
            path: '/porownanie',
            icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
            )
        },
        {
            label: 'Info',
            path: '/jak-dziala',
            icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2 flex justify-between items-center lg:hidden z-50 transition-all duration-300 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] overflow-x-auto">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex flex-col items-center gap-1 min-w-[64px] group transition-colors ${isActive ? 'text-teal-500' : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                            {item.icon}
                        </div>
                        <span className={`text-[10px] font-bold ${isActive ? 'text-teal-500' : 'text-gray-400'}`}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
