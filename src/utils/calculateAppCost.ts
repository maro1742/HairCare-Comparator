type ProductCategory = 'shampoo' | 'conditioner' | 'mask' | 'serum';
type HairLength = 'short' | 'medium' | 'long';

/**
 * Dosages in ml per application based on category and hair length
 */
const DOSAGES: Record<ProductCategory, Record<HairLength, number>> = {
    shampoo: { short: 5, medium: 10, long: 15 },
    conditioner: { short: 7, medium: 15, long: 25 },
    mask: { short: 10, medium: 20, long: 35 },
    serum: { short: 1, medium: 3, long: 5 },
};

/**
 * Calculates the cost of a single application of a product.
 * Formula: (price / volumeMl) * dosage
 * @returns Cost rounded to 2 decimal places.
 */
export function calculateAppCost(
    price: number,
    volumeMl: number,
    category: ProductCategory,
    hairLength: HairLength
): number {
    if (!volumeMl || volumeMl <= 0) return 0;

    const dosage = DOSAGES[category][hairLength];
    const cost = (price / volumeMl) * dosage;

    return Math.round(cost * 100) / 100;
}
