
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Progress } from "../../ui/progress";

const products = [
  {
    name: "iPhone 15 Pro",
    sales: 2340,
    revenue: "$2,794,600",
    growth: 85,
    image: "📱"
  },
  {
    name: "MacBook Air M2",
    sales: 1890,
    revenue: "$2,454,710",
    growth: 72,
    image: "💻"
  },
  {
    name: "AirPods Pro",
    sales: 3450,
    revenue: "$859,550",
    growth: 68,
    image: "🎧"
  },
  {
    name: "iPad Pro 12.9",
    sales: 1230,
    revenue: "$1,351,770",
    growth: 45,
    image: "📊"
  },
  {
    name: "Apple Watch Series 9",
    sales: 2100,
    revenue: "$838,000",
    growth: 38,
    image: "⌚"
  }
];

export function TopProducts() {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Top Products</CardTitle>
        <p className="text-sm text-muted-foreground">
          Best performing products this month
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {products.map((product, index) => (
            <div key={product.name} className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
                  {product.image}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground truncate">
                    {product.name}
                  </p>
                  <span className="text-sm text-muted-foreground">
                    {product.sales} sales
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <p className="text-lg font-semibold text-foreground">
                    {product.revenue}
                  </p>
                  <span className="text-sm font-medium text-accent">
                    +{product.growth}%
                  </span>
                </div>
                
                <Progress
                  value={product.growth}
                  className="h-2"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}