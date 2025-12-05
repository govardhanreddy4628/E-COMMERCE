import { CreditCard, Wallet, Banknote } from "lucide-react";
import { PaymentMethod } from "../../pages/Checkout";
import { Card } from "../../ui/card";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";


interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

export const PaymentMethodSelector = ({ selected, onSelect }: PaymentMethodSelectorProps) => {
  return (
    <RadioGroup value={selected} onValueChange={(value) => onSelect(value as PaymentMethod)}>
      <div className="space-y-3">
        {/* Stripe */}
        <Card className={`p-4 cursor-pointer transition-colors ${selected === "stripe" ? "border-primary bg-accent" : ""}`}>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="stripe" id="stripe" />
            <Label htmlFor="stripe" className="flex items-center gap-3 cursor-pointer flex-1">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Credit/Debit Card (Stripe)</p>
                <p className="text-sm text-muted-foreground">Pay securely with your card</p>
              </div>
            </Label>
          </div>
        </Card>

        {/* Razorpay */}
        <Card className={`p-4 cursor-pointer transition-colors ${selected === "razorpay" ? "border-primary bg-accent" : ""}`}>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="razorpay" id="razorpay" />
            <Label htmlFor="razorpay" className="flex items-center gap-3 cursor-pointer flex-1">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Razorpay</p>
                <p className="text-sm text-muted-foreground">Cards, UPI, Netbanking & more</p>
              </div>
            </Label>
          </div>
        </Card>

        {/* UPI */}
        <Card className={`p-4 cursor-pointer transition-colors ${selected === "upi" ? "border-primary bg-accent" : ""}`}>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="upi" id="upi" />
            <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer flex-1">
              <Wallet className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">UPI</p>
                <p className="text-sm text-muted-foreground">Google Pay, PhonePe, Paytm & more</p>
              </div>
            </Label>
          </div>
        </Card>

        {/* Cash on Delivery */}
        <Card className={`p-4 cursor-pointer transition-colors ${selected === "cod" ? "border-primary bg-accent" : ""}`}>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="cod" id="cod" />
            <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1">
              <Banknote className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Cash on Delivery</p>
                <p className="text-sm text-muted-foreground">Pay when you receive</p>
              </div>
            </Label>
          </div>
        </Card>
      </div>
    </RadioGroup>
  );
};
