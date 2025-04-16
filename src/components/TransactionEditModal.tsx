
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, DollarSign, Tag, AlignLeft, SaveIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/categories";

const formSchema = z.object({
  amount: z.coerce.number().positive({ message: "Amount must be a positive number" }),
  description: z.string().min(3, { message: "Description must be at least 3 characters" }),
  date: z.date({
    required_error: "A date is required",
  }),
  category: z.string().min(1, { message: "Please select a category" }),
});

interface TransactionEditModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
}

export function TransactionEditModal({ 
  transaction, 
  isOpen, 
  onClose, 
  onSave 
}: TransactionEditModalProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: transaction ? transaction.amount : 0,
      description: transaction ? transaction.description : "",
      date: transaction ? new Date(transaction.date) : new Date(),
      category: transaction ? transaction.category : "other",
    },
  });
  
  // Update form values when transaction changes
  useEffect(() => {
    if (transaction) {
      form.reset({
        amount: transaction.amount,
        description: transaction.description,
        date: new Date(transaction.date),
        category: transaction.category,
      });
    }
  }, [transaction, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!transaction) return;
    
    onSave({
      ...transaction,
      amount: values.amount,
      description: values.description,
      date: values.date.toISOString().split("T")[0],
      category: values.category,
    });
    
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] p-6 rounded-xl glass-panel animate-fade-in backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gradient flex items-center gap-2">
            <SaveIcon className="h-5 w-5" /> Edit Transaction
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-4">
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
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm font-medium flex items-center gap-1.5">
                      <CalendarIcon className="h-3.5 w-3.5 text-primary" /> Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal input-highlight",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                      className="resize-none min-h-[100px] input-highlight" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6 flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-primary via-purple-600 to-indigo-600 hover:shadow-lg hover:from-primary/90 hover:to-indigo-600/90 transition-all duration-300 font-medium text-primary-foreground"
              >
                <SaveIcon className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
