
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartData, Transaction } from "@/lib/types";
import { groupTransactionsByMonth, formatCurrency } from "@/lib/utils";
import { EmptyState } from "@/components/EmptyState";

interface ExpensesChartProps {
  transactions: Transaction[];
}

export function ExpensesChart({ transactions }: ExpensesChartProps) {
  const chartData = useMemo(() => {
    return groupTransactionsByMonth(transactions);
  }, [transactions]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-md shadow-md">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-primary font-bold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
        <CardDescription>
          Your spending patterns over the past months
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <EmptyState
            title="No chart data"
            description="Add transactions to see your monthly spending chart"
          />
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => `$${value}`}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill="#9b87f5" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
