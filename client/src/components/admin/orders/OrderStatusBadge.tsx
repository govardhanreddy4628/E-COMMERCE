import { cn } from "../../../lib/utils";
import { Badge } from "../../../ui/badge";


type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-warning/10 text-warning hover:bg-warning/20 border-warning/20",
  },
  processing: {
    label: "Processing",
    className: "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20",
  },
  shipped: {
    label: "Shipped",
    className: "bg-accent/10 text-accent hover:bg-accent/20 border-accent/20",
  },
  delivered: {
    label: "Delivered",
    className: "bg-success/10 text-success hover:bg-success/20 border-success/20",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20",
  },
};

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
};
