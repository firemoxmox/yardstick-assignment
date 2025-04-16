
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { PlusCircle, SaveIcon, DollarSign, Calendar, Tag, AlignLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Transaction } from "@/lib/types";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/lib/categories";

const formSchema = z.object({
  amount: z.coerce.number().positive({ message: "Amount must be a positive number" }),
  description: z.string().min(3, { message: "Description must be at least 3 characters" }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
  category: z.string().min(1, { message: "Please select a category" }),
});

interface TransactionFormProps {
  addTransaction: (transaction: Transaction) => void;
  editingTransaction?: Transaction | null;
  setEditingTransaction?: (transaction: Transaction | null) => void;
}

export function TransactionForm({ 
  addTransaction, 
  editingTransaction = null,
  setEditingTransaction
}: TransactionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: editingTransaction ? editingTransaction.amount : 0,
      description: editingTransaction ? editingTransaction.description : "",
      date: editingTransaction ? editingTransaction.date : new Date().toISOString().split("T")[0],
      category: editingTransaction ? editingTransaction.category : "other",
    },
  });
  
  // Update form values when editingTransaction changes
  useEffect(() => {
    if (editingTransaction) {
      form.reset({
        amount: editingTransaction.amount,
        description: editingTransaction.description,
        date: editingTransaction.date,
        category: editingTransaction.category,
      });
    }
  }, [editingTransaction, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    setTimeout(() => {
      const transaction: Transaction = {
        id: editingTransaction ? editingTransaction.id : uuidv4(),
        amount: values.amount,
        description: values.description,
        date: values.date,
        category: values.category,
        createdAt: editingTransaction ? editingTransaction.createdAt : new Date().toISOString(),
      };
      
      addTransaction(transaction);
      form.reset({
        amount: 0,
        description: "",
        date: new Date().toISOString().split("T")[0],
        category: "other",
      });
      
      if (setEditingTransaction) {
        setEditingTransaction(null);
      }
      
      setIsSubmitting(false);
    }, 500);
  }

  return (
    <div className="glass-panel animate-fade-in p-7 backdrop-blur-lg">
      <h2 className="text-2xl font-bold mb-6 text-gradient flex items-center gap-2">
        {editingTransaction ? 
          <><SaveIcon className="h-5 w-5" /> Update Transaction</> : 
          <><PlusCircle className="h-5 w-5" /> New Transaction</>
        }
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-primary" /> Amount
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        className="pl-8 input-highlight" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" /> Date
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      className="input-highlight" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-primary" /> Category
                </FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="input-highlight">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-[300px]">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id} className="cursor-pointer">
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium flex items-center gap-1.5">
                  <AlignLeft className="h-3.5 w-3.5 text-primary" /> Description
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter transaction details..." 
                    className="resize-none min-h-[120px] input-highlight" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription className="text-xs text-muted-foreground mt-1">
                  Briefly describe what this transaction was for
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full mt-6 bg-gradient-to-r from-primary via-purple-600 to-indigo-600 hover:shadow-lg hover:from-primary/90 hover:to-indigo-600/90 transition-all duration-300 font-medium text-primary-foreground" 
            disabled={isSubmitting}
          >
            {editingTransaction ? (
              <>
                <SaveIcon className="mr-2 h-4 w-4" />
                Update Transaction
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Transaction
              </>
            )}
            {isSubmitting && <span className="ml-2 animate-pulse">...</span>}
          </Button>
        </form>
      </Form>
    </div>
  );
}
