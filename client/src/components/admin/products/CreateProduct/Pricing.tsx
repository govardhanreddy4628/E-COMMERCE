import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../../ui/form";
import { Input } from "../../../../ui/input";


const Pricing = ({ form, watchedPrice, watchedCompareAtPrice }) => {
  const profit = watchedPrice && watchedPrice > 0 && form.getValues("cost")
    ? ((watchedPrice - (form.getValues("cost") || 0)) / watchedPrice * 100).toFixed(1)
    : 0;

  const discount = watchedCompareAtPrice && watchedCompareAtPrice > watchedPrice
    ? ((watchedCompareAtPrice - watchedPrice) / watchedCompareAtPrice * 100).toFixed(0)
    : 0;
    
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Pricing Information</CardTitle>
          <CardDescription>
            Set your product pricing and cost information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selling Price *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      //step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="compareAtPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Compare At Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Original price for showing discounts
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost Per Item</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Your cost for this item
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {(watchedPrice > 0 || Number(discount) > 0) && (
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <h4 className="font-medium">Pricing Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Profit Margin:</span>
                  <div className="font-semibold text-success">{profit}%</div>
                </div>
                {Number(discount) > 0 && (
                  <div>
                    <span className="text-muted-foreground">Discount:</span>
                    <div className="font-semibold text-primary">{discount}% off</div>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Final Price:</span>
                  <div className="font-semibold text-lg">${watchedPrice?.toFixed(2) || "0.00"}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Pricing
