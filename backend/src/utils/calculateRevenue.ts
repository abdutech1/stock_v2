export function calculateRevenue(
  items: { quantity: number; soldPrice: number }[]
): number {
  return items.reduce(
    (sum, item) => sum + item.quantity * item.soldPrice,
    0
  );
}