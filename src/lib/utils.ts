
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function groupTransactionsByMonth(transactions: any[]) {
  const grouped = transactions.reduce((acc: Record<string, number>, transaction) => {
    const date = new Date(transaction.date);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = 0;
    }
    
    acc[monthYear] += transaction.amount;
    return acc;
  }, {});

  return Object.entries(grouped).map(([name, amount]) => ({ name, amount }));
}
