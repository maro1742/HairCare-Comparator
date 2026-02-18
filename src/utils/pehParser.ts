export interface PEHBreakdown {
    proteins: number;
    emollients: number;
    humectants: number;
}

const PROTEINS_KEYWORDS = [
    'keratyna', 'jedwab', 'kolagen', 'aminokwasy', 'hidrolizat',
    'białka', 'peptydy', 'bioproteiny'
];

const EMOLLIENTS_KEYWORDS = [
    'olej', 'masło', 'glikol', 'cetyl', 'cetearyl', 'lanolina',
    'wazelina', 'kwas stearynowy'
];

const HUMECTANTS_KEYWORDS = [
    'gliceryna', 'sorbitol', 'sód', 'hialu', 'glukoza',
    'pantenol', 'd-panthenol'
];

/**
 * Parses a description to determine the PEH balance (Proteins, Emollients, Humectants).
 * Returns percentages: { proteins, emollients, humectants }
 */
export function parsePEHFromDescription(description: string): PEHBreakdown {
    if (!description) {
        return { proteins: 0, emollients: 0, humectants: 0 };
    }

    const text = description.toLowerCase();
    let pCount = 0;
    let eCount = 0;
    let hCount = 0;

    PROTEINS_KEYWORDS.forEach(k => {
        if (text.includes(k.toLowerCase())) pCount++;
    });

    EMOLLIENTS_KEYWORDS.forEach(k => {
        if (text.includes(k.toLowerCase())) eCount++;
    });

    HUMECTANTS_KEYWORDS.forEach(k => {
        if (text.includes(k.toLowerCase())) hCount++;
    });

    // Handle special cases from requirements:
    // "gliceryna (częściowo)" for Emollients
    if (text.includes('gliceryna')) {
        // We already counted it once for Humectants. 
        // Logic: if it's "częściowo" for emollients, let's add some weight there too if it exists.
        eCount += 0.5;
    }

    // "pantenol (częściowo)" for Emollients
    if (text.includes('pantenol') || text.includes('d-panthenol')) {
        eCount += 0.5;
    }

    const total = pCount + eCount + hCount;

    if (total === 0) {
        return { proteins: 0, emollients: 0, humectants: 0 };
    }

    return {
        proteins: Math.round((pCount / total) * 100),
        emollients: Math.round((eCount / total) * 100),
        humectants: Math.round((hCount / total) * 100)
    };
}
