
import { WalletCards, Sparkles, TrendingUp } from "lucide-react";

interface HeaderProps {
  totalSpent: number;
}

export function Header({ totalSpent }: HeaderProps) {
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(totalSpent);

  return (
    <div className="flex flex-col md:flex-row justify-between items-center py-8 gap-6">
      <div className="flex items-center gap-4 mb-4 md:mb-0">
        <div className="bg-gradient-to-br from-primary via-purple-600/40 to-indigo-600/40 p-4 rounded-2xl shadow-lg backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
          <WalletCards className="h-8 w-8 text-primary" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold bg-gradient-to-br from-primary via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Spending Sense
          </h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            <span className="hidden md:inline">Financial intelligence at your fingertips</span>
            <TrendingUp className="h-3.5 w-3.5 text-primary inline" />
          </p>
        </div>
      </div>
      
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/20 via-purple-600/20 to-indigo-600/20 px-8 py-4 rounded-2xl shadow-lg border border-primary/10 backdrop-blur-sm hover-lift transform hover:translate-y-[-4px] transition-all duration-300">
        <span className="absolute top-0 right-0 opacity-30">
          <Sparkles className="h-24 w-24 text-primary -rotate-12 translate-x-6 -translate-y-4" />
        </span>
        <div className="relative z-10 flex flex-col">
          <span className="text-sm font-medium text-muted-foreground">Total Spent</span>
          <span className="text-2xl font-bold text-foreground">{formattedTotal}</span>
          <div className="h-1 w-24 bg-gradient-to-r from-primary via-purple-600/70 to-indigo-600/70 rounded-full mt-2"></div>
        </div>
      </div>
    </div>
  );
}
