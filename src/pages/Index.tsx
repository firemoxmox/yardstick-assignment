
import { useState, useEffect } from "react";
import { Transaction, Budget } from "@/lib/types";
import { Header } from "@/components/Header";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { ExpensesChart } from "@/components/ExpensesChart";
import { Dashboard } from "@/components/Dashboard";
import { CategoryPieChart } from "@/components/CategoryPieChart";
import { BudgetManager } from "@/components/BudgetManager";
import { BudgetInsights } from "@/components/BudgetInsights";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TRANSACTIONS_KEY = "spending-tracker-transactions";
const BUDGETS_KEY = "spending-tracker-budgets";

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [totalSpent, setTotalSpent] = useState(0);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const isMobile = useIsMobile();

  // Load transactions from localStorage on initial render
  useEffect(() => {
    const savedTransactions = localStorage.getItem(TRANSACTIONS_KEY);
    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions));
      } catch (error) {
        console.error("Failed to parse saved transactions", error);
      }
    }
    
    const savedBudgets = localStorage.getItem(BUDGETS_KEY);
    if (savedBudgets) {
      try {
        setBudgets(JSON.parse(savedBudgets));
      } catch (error) {
        console.error("Failed to parse saved budgets", error);
      }
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    
    // Calculate total amount spent
    const total = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    setTotalSpent(total);
  }, [transactions]);
  
  // Save budgets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
  }, [budgets]);

  const handleAddTransaction = (transaction: Transaction) => {
    if (editingTransaction) {
      // Update existing transaction
      setTransactions(
        transactions.map((t) => (t.id === transaction.id ? transaction : t))
      );
      setEditingTransaction(null);
    } else {
      // Add new transaction
      setTransactions([...transactions, transaction]);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    // Instead of setting editingTransaction and scrolling to the form,
    // we now handle this in the TransactionList component with the modal
    setTransactions(
      transactions.map((t) => (t.id === transaction.id ? transaction : t))
    );
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };
  
  const handleSaveBudgets = (newBudgets: Budget[]) => {
    // Get the current month in YYYY-MM format
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    // Filter out any existing budgets for the current month
    const filteredBudgets = budgets.filter(b => b.month !== currentMonth);
    
    // Add the new budgets
    setBudgets([...filteredBudgets, ...newBudgets]);
  };

  return (
    <div className="container mx-auto px-4 pb-20 pt-4 animate-fade-in">
      <Header totalSpent={totalSpent} />
      
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Form section - takes 4 columns on large screens and full width on mobile */}
        <div className="lg:col-span-4 space-y-8 animate-slide-up">
          <div className={isMobile ? "" : "sticky top-6"}>
            <TransactionForm 
              addTransaction={handleAddTransaction} 
              editingTransaction={editingTransaction}
              setEditingTransaction={setEditingTransaction}
            />
          </div>
        </div>
        
        {/* Dashboard and transactions section - takes 8 columns on large screens */}
        <div className="lg:col-span-8 space-y-8 animate-slide-up" style={{animationDelay: "0.1s"}}>
          {transactions.length > 0 && (
            <>
              <Dashboard transactions={transactions} />
              
              <Tabs defaultValue="charts" className="mt-8">
                <TabsList className="grid w-full grid-cols-3 bg-gradient-light">
                  <TabsTrigger value="charts">Charts</TabsTrigger>
                  <TabsTrigger value="budget">Budget</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                </TabsList>
                <TabsContent value="charts" className="space-y-8 mt-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <ExpensesChart transactions={transactions} />
                    <CategoryPieChart transactions={transactions} />
                  </div>
                  <BudgetInsights transactions={transactions} budgets={budgets} />
                </TabsContent>
                <TabsContent value="budget" className="space-y-8 mt-8">
                  <BudgetManager 
                    transactions={transactions} 
                    budgets={budgets} 
                    onSaveBudgets={handleSaveBudgets} 
                  />
                </TabsContent>
                <TabsContent value="transactions" className="mt-8">
                  <TransactionList 
                    transactions={transactions}
                    onEdit={handleEditTransaction}
                    onDelete={handleDeleteTransaction}
                  />
                </TabsContent>
              </Tabs>
            </>
          )}
          
          {transactions.length === 0 && (
            <TransactionList 
              transactions={transactions}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Index;
