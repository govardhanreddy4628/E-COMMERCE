import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../../ui/form";
import { Input } from "../../../../ui/input";
import { Switch } from "../../../../ui/switch";
import { useFieldArray } from "react-hook-form";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "../../../../ui/button";


const Inventory = ({ form, watchedTrackQuantity }) => {
  const { control } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "specifications",
  });

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Inventory & Shipping</CardTitle>
          <CardDescription>
            Manage stock levels and shipping information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Track quantity toggle */}
          <div className="flex items-center gap-28">
            <FormField
              control={form.control}
              name="trackQuantity"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Track quantity</FormLabel>
                    <FormDescription>
                      Enable inventory tracking for this product
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {watchedTrackQuantity && (
              <FormField
                control={form.control}
                name="quantityInStock"
                render={({ field }) => (
                  <FormItem className=" w-[40%]">
                    <FormLabel>Quantity in Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>


          <FormField
            control={form.control}
            name="lowStockThreshold"
            render={({ field }) => (
              <FormItem className=" w-[40%]">
                <FormLabel>Low Stock Threshold</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="10"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <Separator /> */}

          <div className="space-y-4">
            <h4 className="font-medium">Shipping Information</h4>

            <div className="flex items-center space-x-2">
              <FormField
                control={form.control}
                name="requiresShipping"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Requires shipping</FormLabel>
                      <FormDescription>
                        This product needs to be physically shipped
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <h4 className="font-medium">Specifications</h4>

            {fields.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
              >
                <FormField
                  control={form.control}
                  name={`specifications.${index}.key`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Weight" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`specifications.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 1.2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`specifications.${index}.unit`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. kg, cm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => append({ key: "", value: "", unit: "", group: "" })}
              className="flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> Add Specification
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
