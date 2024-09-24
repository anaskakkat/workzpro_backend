const ADMIN_PROFIT_PERCENTAGE = 10;
export const calculatePayment = (totalAmount: number) => {
  const adminProfit = (ADMIN_PROFIT_PERCENTAGE / 100) * totalAmount;
  const workerAmount = totalAmount - adminProfit;
  return { workerAmount, adminProfit };
};
