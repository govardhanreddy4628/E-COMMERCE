import React from "react";
import { 
  ShoppingCart, 
  Package, 
  CreditCard, 
  Headphones, 
  Star,
  Truck
} from "lucide-react";
import { Button } from "../../ui/button";

interface QuickActionsProps {
  onActionClick: (action: string) => void;
}

const quickActions = [
  {
    id: "order-status",
    label: "Check Order Status",
    icon: Package,
    prompt: "I need help checking my order status",
  },
  {
    id: "product-recommend",
    label: "Product Recommendations",
    icon: Star,
    prompt: "Can you recommend some products for me?",
  },
  {
    id: "shipping-info",
    label: "Shipping Information",
    icon: Truck,
    prompt: "I need information about shipping options and delivery times",
  },
  {
    id: "return-policy",
    label: "Return & Refunds",
    icon: CreditCard,
    prompt: "I need help with returns and refund policy",
  },
  {
    id: "cart-help",
    label: "Cart Assistance",
    icon: ShoppingCart,
    prompt: "I need help with my shopping cart",
  },
  {
    id: "customer-support",
    label: "Customer Support",
    icon: Headphones,
    prompt: "I need to speak with customer support",
  },
];

export const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  return (
    <div className="p-4 border-b bg-gradient-subtle">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.id}
              variant="outline"
              size="sm"
              onClick={() => onActionClick(action.prompt)}
              className="h-auto p-3 flex flex-col items-center gap-2 hover:bg-accent hover:text-accent-foreground transition-colors duration-200 border-border/50"
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs text-center leading-tight">
                {action.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};