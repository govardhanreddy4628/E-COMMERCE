export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  date: string;
  total: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
}

export const ordersData: Order[] = [
  {
    id: 1,
    orderNumber: "ORD-1001",
    customerName: "John Doe",
    date: "2025-08-12",
    total: 150.5,
    status: "Pending"
  },
  {
    id: 2,
    orderNumber: "ORD-1002",
    customerName: "Sarah Lee",
    date: "2025-08-10",
    total: 249.99,
    status: "Shipped"
  },
  {
    id: 3,
    orderNumber: "ORD-1003",
    customerName: "Michael Smith",
    date: "2025-08-08",
    total: 89.99,
    status: "Delivered"
  }
];
