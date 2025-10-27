import { Plus } from 'lucide-react';
import { Button } from '../../../../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../../ui/form";
import { useState } from "react";
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../ui/select";
import { Input } from "../../../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../ui/select';
//import { Plus } from "lucide-react";
import { Textarea } from "../../../../ui/textarea";
import OffersInput from './Offers';


const BasicInfo = ({ validateSection, tab, form, generateSKU, categories, handleCategoryChange, selectedCategory }) => {
  const [highlightInput, setHighlightInput] = useState("");
  const highlights = form.watch("highlights");

  const addHighlight = () => {
    if (highlightInput.trim() && !highlights.includes(highlightInput.trim())) {
      form.setValue("highlights", [...highlights, highlightInput.trim()]);
      setHighlightInput("");
    }
  };

  const removeHighlight = (hl: string) => {
    form.setValue("highlights", highlights.filter((h: string) => h !== hl));
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            Enter the basic details about your product
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select onValueChange={handleCategoryChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                      {/* <div className="border-t mt-2 pt-2">
                        <CreateCategory
                          trigger={
                            <Button variant="ghost" size="sm" className="w-full justify-start">
                              <Plus className="w-4 h-4 mr-2" />
                              Add New Category
                            </Button>
                          }
                        />
                      </div> */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="subcategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcategory</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCategory}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subcategory" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories
                        .find(cat => cat.name === selectedCategory)
                        ?.subcategories.map((subcategory) => (
                          <SelectItem key={subcategory.id} value={subcategory.name}>
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      {/* {selectedCategory && (
                        <div className="border-t mt-2 pt-2">
                          <CreateCategory
                            mode="subcategory"
                            parentCategoryId={categories.find(cat => cat.name === selectedCategory)?.id}
                            trigger={
                              <Button variant="ghost" size="sm" className="w-full justify-start">
                                <Plus className="w-4 h-4 mr-2" />
                                Add New Subcategory
                              </Button>
                            }
                          />
                        </div>
                      )} */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU *</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="Enter SKU" {...field} />
                    </FormControl>
                    <Button type="button" variant="outline" onClick={generateSKU}>
                      Generate
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>


          <FormField
            control={form.control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Description *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief product description (used in listings)"
                    className="min-h-[60px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This will appear in product listings and search results
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Description *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Detailed product description"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />





          <FormField
            control={form.control}
            name="barcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Barcode (UPC/EAN)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter barcode" {...field} />
                </FormControl>
                <FormDescription>
                  Optional: Used for inventory management and POS systems
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />


          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-sm">Highlights</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  placeholder="Enter a product highlight"
                  className="w-full p-2 border rounded focus:outline-none focus:border-black focus:border-2 bg-gray-50"
                />
                <Button type="button" onClick={addHighlight}>
                  Add
                </Button>
              </div>

              {/* Display added highlights */}
              <div className="flex flex-wrap gap-2 mt-2">
                {highlights.map((hl: string, i: number) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1"
                  >
                    {hl}
                    <button
                      type="button"
                      onClick={() => removeHighlight(hl)}
                      className="text-red-500 ml-1"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>



          <div className='rounded-sm'>
            <div className="bg-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
              <div>
                <label className="block mb-1 font-medium text-sm">Color</label>
                <input
                  type="text"
                  placeholder="Enter product color"
                  onChange={(e) => validateSection(tab.id, e.target.value.length > 0)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm">Brand Name *</label>
                <input
                  type="text"
                  placeholder="product name"
                  onChange={(e) => validateSection(tab.id, e.target.value.length > 0)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

          </div>

        </CardContent>
      </Card>
    </>
  )
}

export default BasicInfo
