import { MapPin } from "lucide-react";
import { ShippingDetails } from "../../pages/Checkout";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Card } from "../../ui/card";
import { Label } from "../../ui/label";

interface SavedAddressesProps {
  addresses: ShippingDetails[];
  selectedAddressId: number | null;
  onSelectAddress: (index: number) => void;
}

export const SavedAddresses = ({ 
  addresses, 
  selectedAddressId, 
  onSelectAddress 
}: SavedAddressesProps) => {
  if (addresses.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Saved Addresses
      </h3>
      <RadioGroup value={selectedAddressId?.toString()} onValueChange={(val) => onSelectAddress(parseInt(val))}>
        {addresses.map((address, index) => (
          <Card key={index} className="p-4 cursor-pointer hover:border-primary transition-colors">
            <div className="flex items-start gap-3">
              <RadioGroupItem value={index.toString()} id={`address-${index}`} />
              <Label htmlFor={`address-${index}`} className="flex-1 cursor-pointer">
                <div className="space-y-1">
                  <p className="font-medium">{address.fullName}</p>
                  <p className="text-sm text-muted-foreground">{address.address}</p>
                  <p className="text-sm text-muted-foreground">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  <div className="flex gap-3 text-sm text-muted-foreground">
                    <span>{address.phone}</span>
                    <span>{address.email}</span>
                  </div>
                </div>
              </Label>
            </div>
          </Card>
        ))}
      </RadioGroup>
    </div>
  );
};
