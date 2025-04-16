
import { useState } from "react";
import { Edit2, Trash2, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Transaction } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/EmptyState";
import { TransactionEditModal } from "@/components/TransactionEditModal";
import { toast } from "sonner";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionList({ 
  transactions, 
  onEdit, 
  onDelete 
}: TransactionListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  
  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleEditClick = (transaction: Transaction, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedTransaction: Transaction) => {
    onEdit(updatedTransaction);
    setIsEditModalOpen(false);
    setSelectedTransaction(null);
    toast.success("Transaction updated successfully");
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTransactionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (transactionToDelete) {
      onDelete(transactionToDelete);
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
      toast.success("Transaction deleted successfully");
    }
  };

  return (
    <>
      <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border border-primary/10 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-gradient text-2xl font-bold">Transactions</CardTitle>
          <CardDescription>
            {transactions.length === 0 
              ? "No transactions yet. Add your first one above!" 
              : `Showing ${transactions.length} transaction${transactions.length !== 1 ? 's' : ''}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedTransactions.length === 0 ? (
              <EmptyState
                title="No transactions"
                description="Add your first transaction to get started"
              />
            ) : (
              sortedTransactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  className="border rounded-md p-4 hover:border-primary/50 transition-colors hover:shadow-md hover:bg-white/95 dark:hover:bg-slate-800/90 animate-fade-in"
                >
                  <div 
                    className="flex justify-between items-start cursor-pointer"
                    onClick={() => toggleExpand(transaction.id)}
                  >
                    <div>
                      <div className="font-medium mb-1">
                        {transaction.description.length > 60 && expandedId !== transaction.id
                          ? `${transaction.description.substring(0, 60)}...`
                          : transaction.description}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(transaction.date)}
                      </div>
                    </div>
                    <div className="text-xl font-semibold">
                      {formatCurrency(transaction.amount)}
                    </div>
                  </div>
                  
                  {expandedId === transaction.id && (
                    <div className="mt-4 flex justify-end gap-2 animate-slide-up">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleEditClick(transaction, e)}
                        className="hover:bg-primary/10 hover:text-primary hover:border-primary/50"
                      >
                        <Edit2 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => handleDeleteClick(transaction.id, e)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <TransactionEditModal 
        transaction={selectedTransaction}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 border border-destructive/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-background/80">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
