
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-60 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-8 text-center shadow-sm border border-primary/10">
      <h3 className="font-semibold text-xl">{title}</h3>
      <p className="text-muted-foreground mt-2 mb-6 max-w-xs">{description}</p>
      
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" size="sm" className="shadow-sm transition-all hover:shadow hover:translate-y-[-2px]">
          <PlusCircle className="mr-2 h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
