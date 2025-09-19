import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../../ui/form";
import { Input } from "../../../../ui/input";
import { Button } from '../../../../ui/button'
import { X, Plus } from "lucide-react";
import { Badge } from "../../../../ui/badge";
import { Textarea } from "../../../../ui/textarea";
import { Switch } from "../../../../ui/switch";



interface SeoTagsProps {
  form: any;
  tagInput: string;
  setTagInput: (value: string) => void;
  addTag: () => void;
  watchedTags: string[];
  removeTag: (tag: string) => void;
}

const SeoTags: React.FC<SeoTagsProps> = ({form, tagInput, setTagInput, addTag, watchedTags, removeTag}) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>SEO & Tags</CardTitle>
          <CardDescription>
            Optimize your product for search engines and add relevant tags
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium">Product Tags</h4>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" variant="outline" onClick={addTag} disabled={!tagInput.trim() || watchedTags.length >= 10}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {watchedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {watchedTags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              Add up to 10 tags to help customers find your product ({watchedTags.length}/10)
            </p>
          </div>

          {/* <Separator /> */}

          <div className="space-y-4">
            <h4 className="font-medium">Search Engine Optimization</h4>

            <FormField
              control={form.control}
              name="seoTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Optimized title for search engines" {...field} />
                  </FormControl>
                  <FormDescription>
                    Leave blank to use the product name. Recommended: 50-60 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seoDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description for search engine results"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Leave blank to use the short description. Recommended: 150-160 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* <Separator /> */}

          <div className="space-y-4">
            <h4 className="font-medium">Product Settings</h4>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active Product</FormLabel>
                      <FormDescription>
                        Product is visible and available for purchase
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured Product</FormLabel>
                      <FormDescription>
                        Display this product in featured sections
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SeoTags
