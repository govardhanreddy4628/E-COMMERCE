import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../ui/card";
import { Input } from "../../../../ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../ui/form";
import { UseFormReturn } from "react-hook-form";

export interface ProductFormData {
  costPerItem: number;
  listedPrice: number;
  finalPrice: number;
}


interface PricingProps {
  form: UseFormReturn<ProductFormData>;
}

const Pricing = ({ form }: PricingProps) => {
  // ✅ Watch values directly from RHF (single source of truth)
  const finalPrice = form.watch("finalPrice") || 0;
  const listedPrice = form.watch("listedPrice") || 0;
  const costPerItem = form.watch("costPerItem") || 0;

  // ✅ Derived values
  const profitMargin =
  finalPrice > 0 && costPerItem >= 0
    ? (((finalPrice - costPerItem) / finalPrice) * 100).toFixed(1)
    : "0";

const discountPercentage =
  listedPrice > 0 && finalPrice > 0 && listedPrice > finalPrice
    ? (((listedPrice - finalPrice) / listedPrice) * 100).toFixed(0)
    : "0";


  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing Information</CardTitle>
        <CardDescription>
          Define product pricing and cost details
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cost Per Item */}
          <FormField
            control={form.control}
            name="costPerItem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost Per Item</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Listed Price */}
          <FormField
            control={form.control}
            name="listedPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Listed Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Final Price */}
          <FormField
            control={form.control}
            name="finalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Final Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>

        {/* ✅ Pricing Summary */}
        {(finalPrice > 0 || Number(discountPercentage) > 0) && (
          <div className="rounded-lg bg-muted p-4 space-y-1">
            <p className="text-sm">
              Profit Margin:{" "}
              <span className="font-medium">{profitMargin}%</span>
            </p>

            {discountPercentage !== "0" && (
              <p className="text-sm">
                Discount:{" "}
                <span className="font-medium">
                  {discountPercentage}%
                </span>
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Pricing;
