export const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export const ratingFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatCurrency(value = 0) {
  return currencyFormatter.format(value || 0);
}

export function formatRating(value = 0) {
  return ratingFormatter.format(value || 0);
}

export function getDiscountedPrice(product) {
  const price = product?.price || 0;
  const discount = product?.discountPercentage || 0;
  return price - (price * discount) / 100;
}

export function getProductImage(product) {
  return (
    product?.thumbnail ||
    product?.images?.[0] ||
    'https://placehold.co/800x800/f2f4f7/122033?text=SwiftCart'
  );
}
