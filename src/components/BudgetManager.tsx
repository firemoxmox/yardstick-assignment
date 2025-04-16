
import { useState } from "react";
import { Budget, Transaction } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { categories, getCategoryById, getCategoryColor, getCategoryIcon } from "@/lib/categories";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Save } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { useToast } from "@/hooks/use-toast";

interface BudgetManagerProps {
  transactions: Transaction[];
  budgets: Budget[];
  onSaveBudgets: (budgets: Budget[]) => void;
}

export function BudgetManager({ 
  transactions, 
  budgets, 
  onSaveBudgets 
}: BudgetManagerProps) {
  const [budgetAmounts, setBudgetAmounts] = useState<Record<string, number>>(
    budgets.reduce((acc, budget) => ({ 
      ...acc, 
      [budget.categoryId]: budget.amount 
    }), {})
  );
  const { toast } = useToast();

  // Get current month in YYYY-MM format
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  // Calculate spending for each category in the current month
  const categorySpendings = transactions
    .filter(t => t.date.startsWith(currentMonth))
    .reduce((acc: Record<string, number>, transaction) => {
      const categoryId = transaction.category || 'other';
      acc[categoryId] = (acc[categoryId] || 0) + transaction.amount;
      return acc;
    }, {});
  
  const handleBudgetChange = (categoryId: string, value: string) => {
    const amount = parseFloat(value) || 0;
    setBudgetAmounts({
      ...budgetAmounts,
      [categoryId]: amount
    });
  };
  
  const handleSaveBudgets = () => {
    const newBudgets: Budget[] = Object.entries(budgetAmounts)
      .filter(([_, amount]) => amount > 0)
      .map(([categoryId, amount]) => ({
        categoryId,
        amount,
        month: currentMonth
      }));
    
    onSaveBudgets(newBudgets);
    toast({
      title: "Budgets Saved",
      description: "Your category budgets have been updated",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Budget</CardTitle>
        <CardDescription>
          Set and track your spending limits for {new Date(currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <EmptyState
            title="No categories found"
            description="Add categories to set up your budget"
          />
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {categories.map(category => {
                const Icon = getCategoryIcon(category.id);
                const spending = categorySpendings[category.id] || 0;
                const budgetAmount = budgetAmounts[category.id] || 0;
                const percentage = budgetAmount > 0 
                  ? Math.min(Math.round((spending / budgetAmount) * 100), 100) 
                  : 0;
                
                // Determine progress bar color based on percentage
                let progressColor = "bg-primary";
                if (percentage > 90) progressColor = "bg-destructive";
                else if (percentage > 70) progressColor = "bg-amber-500";
                
                return (
                  <div key={category.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="p-1.5 rounded-full" 
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          <Icon className="h-4 w-4" style={{ color: category.color }} />
                        </div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          min="0"
                          value={budgetAmounts[category.id] || ""}
                          onChange={(e) => handleBudgetChange(category.id, e.target.value)}
                          className="w-24 h-8 text-right"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-1">
                      <Progress value={percentage} className={`h-2 ${progressColor}`} />
                      <span className="text-xs font-medium w-8">{percentage}%</span>
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Spent: {formatCurrency(spending)}</span>
                      {budgetAmount > 0 && (
                        <span>Remaining: {formatCurrency(Math.max(budgetAmount - spending, 0))}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleSaveBudgets}>
                <Save className="mr-2 h-4 w-4" />
                Save Budgets
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
