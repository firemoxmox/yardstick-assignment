
// Types for our application

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
  category: string;
}

export type ChartData = {
  name: string;
  amount: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface Budget {
  categoryId: string;
  amount: number;
  month: string; // Format: "YYYY-MM"
}

