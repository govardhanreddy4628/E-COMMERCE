export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  status: string;
}

export const productsData: Product[] = [
  {
    id: 1,
    name: "Wireless Mouse",
    category: "Electronics",
    price: 25.99,
    stock: 120,
    image: "https://via.placeholder.com/50",
    status: "In Stock"
  },
  {
    id: 2,
    name: "Leather Wallet",
    category: "Accessories",
    price: 45.5,
    stock: 40,
    image: "https://via.placeholder.com/50",
    status: "Low Stock"
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: 60,
    stock: 80,
    image: "https://via.placeholder.com/50",
    status: "In Stock"
  }
];
