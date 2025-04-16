
import { Category } from "./types";
import { 
  ShoppingBag, 
  Home, 
  Utensils, 
  Car, 
  Plane, 
  Wallet, 
  HeartPulse, 
  Shirt, 
  Ticket, 
  GraduationCap,
  Music,
  Smartphone,
  Brush
} from "lucide-react";

// Predefined categories with colors
export const categories: Category[] = [
  { 
    id: "groceries", 
    name: "Groceries", 
    color: "#4CAF50", 
    icon: "ShoppingBag" 
  },
  { 
    id: "housing", 
    name: "Housing", 
    color: "#2196F3", 
    icon: "Home" 
  },
  { 
    id: "dining", 
    name: "Dining Out", 
    color: "#FF9800", 
    icon: "Utensils" 
  },
  { 
    id: "transportation", 
    name: "Transportation", 
    color: "#607D8B", 
    icon: "Car" 
  },
  { 
    id: "travel", 
    name: "Travel", 
    color: "#9C27B0", 
    icon: "Plane" 
  },
  { 
    id: "bills", 
    name: "Bills", 
    color: "#F44336", 
    icon: "Wallet" 
  },
  { 
    id: "health", 
    name: "Health", 
    color: "#E91E63", 
    icon: "HeartPulse" 
  },
  { 
    id: "clothing", 
    name: "Clothing", 
    color: "#8BC34A", 
    icon: "Shirt" 
  },
  { 
    id: "entertainment", 
    name: "Entertainment", 
    color: "#673AB7", 
    icon: "Ticket" 
  },
  { 
    id: "education", 
    name: "Education", 
    color: "#009688", 
    icon: "GraduationCap" 
  },
  { 
    id: "technology", 
    name: "Technology", 
    color: "#3F51B5", 
    icon: "Smartphone" 
  },
  { 
    id: "other", 
    name: "Other", 
    color: "#9E9E9E", 
    icon: "Brush" 
  }
];

// Get category by ID
export function getCategoryById(id: string): Category {
  const category = categories.find(cat => cat.id === id);
  return category || categories[categories.length - 1]; // Return "Other" if not found
}

// Get category color by category ID
export function getCategoryColor(categoryId: string): string {
  return getCategoryById(categoryId).color;
}

// Get category icon component by name
export function getCategoryIcon(categoryId: string) {
  const iconName = getCategoryById(categoryId).icon;
  switch(iconName) {
    case "ShoppingBag": return ShoppingBag;
    case "Home": return Home;
    case "Utensils": return Utensils;
    case "Car": return Car;
    case "Plane": return Plane;
    case "Wallet": return Wallet;
    case "HeartPulse": return HeartPulse;
    case "Shirt": return Shirt;
    case "Ticket": return Ticket;
    case "GraduationCap": return GraduationCap;
    case "Smartphone": return Smartphone;
    case "Music": return Music;
    case "Brush": return Brush;
    default: return Wallet;
  }
}

// Group transactions by category
export function groupTransactionsByCategory(transactions: any[]) {
  const grouped = transactions.reduce((acc: Record<string, number>, transaction) => {
    const categoryId = transaction.category || 'other';
    
    if (!acc[categoryId]) {
      acc[categoryId] = 0;
    }
    
    acc[categoryId] += transaction.amount;
    return acc;
  }, {});

  return Object.entries(grouped).map(([categoryId, amount]) => ({ 
    name: getCategoryById(categoryId).name,
    categoryId,
    amount,
    color: getCategoryColor(categoryId)
  }));
}
