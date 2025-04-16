
import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Transaction } from "@/lib/types";
import { EmptyState } from "@/components/EmptyState";
import { formatCurrency } from "@/lib/utils";
import { groupTransactionsByCategory, getCategoryIcon } from "@/lib/categories";

interface CategoryPieChartProps {
  transactions: Transaction[];
}

export function CategoryPieChart({ transactions }: CategoryPieChartProps) {
  const chartData = useMemo(() => {
    return groupTransactionsByCategory(transactions);
  }, [transactions]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-primary font-bold">
            {formatCurrency(data.amount)}
          </p>
          <p className="text-muted-foreground text-xs">
            {Math.round(data.amount / transactions.reduce((sum, t) => sum + t.amount, 0) * 100)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>
          How your spending is distributed across categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <EmptyState
            title="No category data"
            description="Add transactions to see your spending by category"
          />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {chartData.map((entry, index) => {
                const Icon = getCategoryIcon(entry.categoryId);
                return (
                  <div 
                    key={`legend-${index}`}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs"
                    style={{ backgroundColor: `${entry.color}20` }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="whitespace-nowrap">{entry.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
