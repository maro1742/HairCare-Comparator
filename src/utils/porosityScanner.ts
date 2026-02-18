export type Porosity = 'LOW' | 'MEDIUM' | 'HIGH';

const LOW_KEYWORDS = [
    'kokos', 'babassu', 'shea', 'mango', 'objętość', 'lekki', 'glinka', 'ziołowy',
    'pokrzywa', 'mięta', 'oczyszczający', 'volume', 'uniesienie', 'siłę'
];

const HIGH_KEYWORDS = [
    'keratyna', 'jedwab', 'lniany', 'czarnuszka', 'wiesiołek', 'bawełna',
    'puszenie', 'frizz', 'rozjaśniane', 'farbowane', 'zniszczone', 'proteiny',
    'ceramidy', 'silikony', 'regeneracja', 'wygładzenie'
];

const MEDIUM_KEYWORDS = [
    'migdał', 'awokado', 'oliwa', 'makadamia', 'ryżowy', 'nawilżenie', 'blask',
    'elastyczność'
];

/**
 * Determines hair porosity from product name and description based on keywords.
 * Priority: HIGH > MEDIUM > LOW
 */
export function getPorosityFromText(productName: string, description: string): Porosity {
    const text = `${productName} ${description}`.toLowerCase();

    // Priority 1: HIGH
    if (HIGH_KEYWORDS.some(keyword => text.includes(keyword.toLowerCase()))) {
        return 'HIGH';
    }

    // Priority 2: MEDIUM
    if (MEDIUM_KEYWORDS.some(keyword => text.includes(keyword.toLowerCase()))) {
        return 'MEDIUM';
    }

    // Priority 3: LOW
    if (LOW_KEYWORDS.some(keyword => text.includes(keyword.toLowerCase()))) {
        return 'LOW';
    }

    // Fallback
    return 'MEDIUM';
}

// Support for CommonJS environments (like sync scripts)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getPorosityFromText };
}
