
import { useMemo } from "react";
import { Transaction } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  TrendingDown, 
  TrendingUp, 
  PieChart,
  CalendarClock
} from "lucide-react";
import { getCategoryColor, getCategoryById, getCategoryIcon } from "@/lib/categories";

interface DashboardProps {
  transactions: Transaction[];
}

export function Dashboard({ transactions }: DashboardProps) {
  const stats = useMemo(() => {
    if (!transactions.length) {
      return {
        totalSpent: 0,
        averageTransaction: 0,
        largestTransaction: 0,
        topCategory: { id: '', name: 'None', color: '#ccc', amount: 0 },
        recentTransactions: []
      };
    }

    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    const average = total / transactions.length;
    const largest = Math.max(...transactions.map(t => t.amount));
    
    // Get 4 most recent transactions
    const recent = [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);
    
    // Find top spending category
    const categorySpending: Record<string, number> = {};
    transactions.forEach(t => {
      const catId = t.category || 'other';
      categorySpending[catId] = (categorySpending[catId] || 0) + t.amount;
    });

    let topCategoryId = 'other';
    let topAmount = 0;
    
    Object.entries(categorySpending).forEach(([catId, amount]) => {
      if (amount > topAmount) {
        topAmount = amount;
        topCategoryId = catId;
      }
    });
    
    const topCategory = {
      id: topCategoryId,
      name: getCategoryById(topCategoryId).name,
      color: getCategoryColor(topCategoryId),
      amount: topAmount
    };
    
    return {
      totalSpent: total,
      averageTransaction: average,
      largestTransaction: largest,
      topCategory,
      recentTransactions: recent
    };
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalSpent)}</div>
            <p className="text-xs text-muted-foreground">
              {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.averageTransaction)}</div>
            <p className="text-xs text-muted-foreground">
              Per transaction
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Largest Transaction</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.largestTransaction)}</div>
            <p className="text-xs text-muted-foreground">
              Highest spending
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: stats.topCategory.color }}
              />
              <div className="text-xl font-bold">{stats.topCategory.name}</div>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.topCategory.amount)}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Transactions */}
      {stats.recentTransactions.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentTransactions.map(transaction => {
                const Icon = getCategoryIcon(transaction.category || 'other');
                const color = getCategoryColor(transaction.category || 'other');
                
                return (
                  <div 
                    key={transaction.id}
                    className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-1.5 rounded-full" 
                        style={{ backgroundColor: `${color}20` }}
                      >
                        <Icon className="h-3.5 w-3.5" style={{ color }} />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{transaction.description}</div>
                        <div className="text-xs text-muted-foreground">{formatDate(transaction.date)}</div>
                      </div>
                    </div>
                    <div className="font-semibold">{formatCurrency(transaction.amount)}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
