import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../ui/card";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "../../../../ui/form";
import { Input } from "../../../../ui/input";
import { useState, useEffect } from "react";

const Pricing = ({ form }) => {
  const [finalPriceInput, setFinalPriceInput] = useState(form.getValues("finalPrice") || "");
  const [listedPriceInput, setListedPriceInput] = useState(form.getValues("listedPrice") || "");
  const [costInput, setCostInput] = useState(form.getValues("costPerItem") || "");

  useEffect(() => form.setValue("finalPrice", Number(finalPriceInput) || 0), [finalPriceInput]);
  useEffect(() => form.setValue("listedPrice", Number(listedPriceInput) || 0), [listedPriceInput]);
  useEffect(() => form.setValue("costPerItem", Number(costInput) || 0), [costInput]);

  const finalPriceNum = Number(finalPriceInput) || 0;
  const listedPriceNum = Number(listedPriceInput) || 0;
  const costNum = Number(costInput) || 0;

  const profit = finalPriceNum > 0 ? (((finalPriceNum - costNum) / finalPriceNum) * 100).toFixed(1) : "0";
  const discount = listedPriceNum > finalPriceNum ? (((listedPriceNum - finalPriceNum) / listedPriceNum) * 100).toFixed(0) : "0";

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Pricing Information</CardTitle>
          <CardDescription>Set your product pricing and cost information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Cost Per Item */}
            <FormItem>
              <FormLabel>Cost Per Item</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={costInput}
                  onChange={(e) => setCostInput(e.target.value)}
                />
              </FormControl>
              <FormDescription>Your cost for this item</FormDescription>
              <FormMessage>{form.formState.errors.costPerItem?.message}</FormMessage>
            </FormItem>

            {/* Listed Price */}
            <FormItem>
              <FormLabel>Listed Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={listedPriceInput}
                  onChange={(e) => setListedPriceInput(e.target.value)}
                />
              </FormControl>
              <FormDescription>Original price for showing discounts</FormDescription>
              <FormMessage>{form.formState.errors.listedPrice?.message}</FormMessage>
            </FormItem>

            {/* Final Price */}
            <FormItem>
              <FormLabel>Final Price *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={finalPriceInput}
                  onChange={(e) => setFinalPriceInput(e.target.value)}
                />
              </FormControl>
              <FormMessage>{form.formState.errors.finalPrice?.message}</FormMessage>
            </FormItem>


          </div>

          {/* Pricing Summary */}
          {(finalPriceNum > 0 || Number(discount) > 0) && (
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <h4 className="font-medium">Pricing Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Profit Margin:</span>
                  <div className="font-semibold text-success">
                    {profit}% (${(finalPriceNum - costNum).toFixed(2)})
                  </div>
                </div>
                {Number(discount) > 0 && (
                  <div>
                    <span className="text-muted-foreground">Discount:</span>
                    <div className="font-semibold text-primary">{discount}% off</div>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Final Price:</span>
                  <div className="font-semibold text-lg">${finalPriceNum.toFixed(2)}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Pricing;
