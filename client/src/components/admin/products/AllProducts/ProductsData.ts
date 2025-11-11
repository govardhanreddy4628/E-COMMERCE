export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  status: "active" | "inactive" | "discontinued" | "archived";
  image: string;
  createdAt: string;
}


export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life",
    price: 299.99,
    stock: 45,
    category: "Electronics",
    status: "active",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    name: "Smart Watch Pro",
    description: "Advanced fitness tracking with heart rate monitoring and GPS",
    price: 399.99,
    stock: 23,
    category: "Electronics",
    status: "active",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    createdAt: "2024-01-18"
  },
  {
    id: "3",
    name: "Laptop Stand",
    description: "Ergonomic aluminum laptop stand with adjustable height",
    price: 79.99,
    stock: 67,
    category: "Accessories",
    status: "active",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop",
    createdAt: "2024-01-20"
  },
  {
    id: "4",
    name: "Mechanical Keyboard",
    description: "RGB backlit mechanical gaming keyboard with cherry switches",
    price: 149.99,
    stock: 0,
    category: "Electronics",
    status: "active",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=300&fit=crop",
    createdAt: "2024-01-22"
  },
  {
    id: "5",
    name: "USB-C Hub",
    description: "7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader",
    price: 49.99,
    stock: 89,
    category: "Accessories",
    status: "active",
    image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=300&h=300&fit=crop",
    createdAt: "2024-01-25"
  },
  {
    id: "6",
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with precision tracking",
    price: 39.99,
    stock: 156,
    category: "Electronics",
    status: "active",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=300&fit=crop",
    createdAt: "2024-02-01"
  },
  {
    id: "7",
    name: "Phone Case Premium",
    description: "Durable protective case with military-grade drop protection",
    price: 29.99,
    stock: 234,
    category: "Accessories",
    status: "active",
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=300&h=300&fit=crop",
    createdAt: "2024-02-05"
  },
  {
    id: "8",
    name: "Portable Charger",
    description: "20000mAh power bank with fast charging support",
    price: 59.99,
    stock: 12,
    category: "Electronics",
    status: "inactive",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop",
    createdAt: "2024-02-08"
  },
  {
    id: "9",
    name: "Bluetooth Speaker",
    description: "Waterproof portable speaker with 360° sound",
    price: 89.99,
    stock: 78,
    category: "Electronics",
    status: "active",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
    createdAt: "2024-02-10"
  },
  {
    id: "10",
    name: "Webcam HD",
    description: "1080p webcam with auto-focus and noise cancellation",
    price: 119.99,
    stock: 34,
    category: "Electronics",
    status: "active",
    image: "https://images.unsplash.com/photo-1589384267710-7a170da59fc8?w=300&h=300&fit=crop",
    createdAt: "2024-02-12"
  },
  {
    id: "11",
    name: "Monitor 27 inch",
    description: "4K UHD monitor with HDR support and 144Hz refresh rate",
    price: 449.99,
    stock: 15,
    category: "Electronics",
    status: "active",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&h=300&fit=crop",
    createdAt: "2024-02-15"
  },
  {
    id: "12",
    name: "Desk Lamp LED",
    description: "Adjustable LED desk lamp with touch controls",
    price: 45.99,
    stock: 92,
    category: "Accessories",
    status: "active",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=300&h=300&fit=crop",
    createdAt: "2024-02-18"
  },
  {
    id: "13",
    name: "Gaming Chair",
    description: "Ergonomic gaming chair with lumbar support",
    price: 299.99,
    stock: 8,
    category: "Furniture",
    status: "active",
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=300&h=300&fit=crop",
    createdAt: "2024-02-20"
  },
  {
    id: "14",
    name: "Cable Organizer",
    description: "Cable management system with multiple clips",
    price: 19.99,
    stock: 145,
    category: "Accessories",
    status: "active",
    image: "https://images.unsplash.com/photo-1572297794821-5e3c7f8c2c5f?w=300&h=300&fit=crop",
    createdAt: "2024-02-22"
  },
  {
    id: "15",
    name: "External SSD 1TB",
    description: "High-speed portable SSD with USB-C connectivity",
    price: 179.99,
    stock: 0,
    category: "Electronics",
    status: "discontinued",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=300&h=300&fit=crop",
    createdAt: "2024-02-25"
  },
  {
    id: "16",
    name: "Screen Protector",
    description: "Tempered glass screen protector for smartphones",
    price: 14.99,
    stock: 267,
    category: "Accessories",
    status: "active",
    image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=300&h=300&fit=crop",
    createdAt: "2024-02-28"
  },
  {
    id: "17",
    name: "Microphone USB",
    description: "Professional USB microphone for streaming",
    price: 129.99,
    stock: 42,
    category: "Electronics",
    status: "active",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300&h=300&fit=crop",
    createdAt: "2024-03-01"
  },
  {
    id: "18",
    name: "Laptop Sleeve",
    description: "Protective laptop sleeve with extra pockets",
    price: 34.99,
    stock: 186,
    category: "Accessories",
    status: "active",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
    createdAt: "2024-03-05"
  },
  {
    id: "19",
    name: "Smart Light Bulb",
    description: "WiFi-enabled RGB smart bulb with voice control",
    price: 24.99,
    stock: 0,
    category: "Electronics",
    status: "archived",
    image: "https://images.unsplash.com/photo-1550985543-49bee3167284?w=300&h=300&fit=crop",
    createdAt: "2024-03-08"
  },
  {
    id: "20",
    name: "Drawing Tablet",
    description: "Graphic drawing tablet with pressure sensitivity",
    price: 189.99,
    stock: 28,
    category: "Electronics",
    status: "active",
    image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=300&h=300&fit=crop",
    createdAt: "2024-03-10"
  }
];

