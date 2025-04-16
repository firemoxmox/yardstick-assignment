
import { useMemo } from "react";
import { Budget, Transaction } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { categories, getCategoryById, getCategoryColor } from "@/lib/categories";
import { EmptyState } from "./EmptyState";

interface BudgetInsightsProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export function BudgetInsights({ transactions, budgets }: BudgetInsightsProps) {
  const currentMonth = new Date().toISOString().slice(0, 7);

  const chartData = useMemo(() => {
    // Filter transactions from the current month
    const currentMonthTransactions = transactions.filter(t => 
      t.date.startsWith(currentMonth)
    );
    
    // Calculate spending for each category
    const categorySpendings = currentMonthTransactions.reduce((acc: Record<string, number>, transaction) => {
      const categoryId = transaction.category || 'other';
      acc[categoryId] = (acc[categoryId] || 0) + transaction.amount;
      return acc;
    }, {});
    
    // Create data for the chart
    return categories.map(category => {
      const budget = budgets.find(b => b.categoryId === category.id && b.month === currentMonth);
      const budgetAmount = budget?.amount || 0;
      const spent = categorySpendings[category.id] || 0;
      
      return {
        name: category.name,
        categoryId: category.id,
        budget: budgetAmount,
        spent: spent,
        color: category.color
      };
    }).filter(item => item.budget > 0 || item.spent > 0);
  }, [transactions, budgets, currentMonth]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-medium">{data.name}</p>
          <div className="space-y-1 mt-1">
            <p className="text-primary flex justify-between text-sm">
              <span>Budget:</span> 
              <span className="font-semibold">{formatCurrency(data.budget)}</span>
            </p>
            <p className="text-primary flex justify-between text-sm">
              <span>Spent:</span> 
              <span className="font-semibold">{formatCurrency(data.spent)}</span>
            </p>
            {data.budget > 0 && (
              <p className="text-muted-foreground flex justify-between text-sm border-t pt-1">
                <span>Remaining:</span> 
                <span className="font-semibold">{formatCurrency(Math.max(data.budget - data.spent, 0))}</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const insights = useMemo(() => {
    if (!chartData.length) return [];
    
    const insights = [];
    
    // Categories over budget
    const overBudget = chartData
      .filter(item => item.budget > 0 && item.spent > item.budget)
      .sort((a, b) => (b.spent - b.budget) - (a.spent - a.budget));
    
    if (overBudget.length > 0) {
      insights.push({
        type: 'warning',
        message: `You're over budget in ${overBudget.length} ${overBudget.length === 1 ? 'category' : 'categories'}.`,
        detail: `Most notably in ${overBudget[0].name} by ${formatCurrency(overBudget[0].spent - overBudget[0].budget)}.`
      });
    }
    
    // Categories under budget
    const underBudget = chartData
      .filter(item => item.budget > 0 && item.spent <= item.budget * 0.5)
      .sort((a, b) => (b.budget - b.spent) - (a.budget - a.spent));
    
    if (underBudget.length > 0) {
      insights.push({
        type: 'success',
        message: `You're well under budget in ${underBudget.length} ${underBudget.length === 1 ? 'category' : 'categories'}.`,
        detail: `Most notably in ${underBudget[0].name} with ${formatCurrency(underBudget[0].budget - underBudget[0].spent)} remaining.`
      });
    }
    
    // Unbudgeted categories
    const unbudgeted = chartData
      .filter(item => item.budget === 0 && item.spent > 0)
      .sort((a, b) => b.spent - a.spent);
    
    if (unbudgeted.length > 0) {
      insights.push({
        type: 'info',
        message: `You have ${unbudgeted.length} ${unbudgeted.length === 1 ? 'category' : 'categories'} with spending but no budget.`,
        detail: `Consider setting a budget for ${unbudgeted[0].name} (${formatCurrency(unbudgeted[0].spent)}).`
      });
    }
    
    return insights;
  }, [chartData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs. Actual</CardTitle>
        <CardDescription>
          Compare your spending against your monthly budget
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <EmptyState
            title="No budget data"
            description="Set category budgets to see your spending insights"
          />
        ) : (
          <>
            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => value.substring(0, 3)} // Show only first 3 chars
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="budget" name="Budget" fill="#8884d8" opacity={0.4} />
                  <Bar dataKey="spent" name="Spent" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.spent > entry.budget ? "#ef4444" : entry.color} 
                      />
                    ))}
                  </Bar>
                  <ReferenceLine y={0} stroke="#000" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Spending Insights */}
            {insights.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Spending Insights</h4>
                {insights.map((insight, index) => {
                  let bgColor = "bg-blue-50";
                  let textColor = "text-blue-800";
                  let borderColor = "border-blue-100";
                  
                  if (insight.type === 'warning') {
                    bgColor = "bg-amber-50";
                    textColor = "text-amber-800";
                    borderColor = "border-amber-100";
                  } else if (insight.type === 'success') {
                    bgColor = "bg-green-50";
                    textColor = "text-green-800";
                    borderColor = "border-green-100";
                  }
                  
                  return (
                    <div 
                      key={index} 
                      className={`p-3 rounded-md border ${bgColor} ${borderColor}`}
                    >
                      <p className={`font-medium ${textColor}`}>{insight.message}</p>
                      <p className="text-sm mt-1 text-muted-foreground">{insight.detail}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
