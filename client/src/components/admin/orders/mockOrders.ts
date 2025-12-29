import { Order } from "./OrderDetailsDialog";

export const generateMockOrders = (): Order[] => {
  const customers = [
    { name: "Sarah Johnson", email: "sarah.j@email.com" },
    { name: "Michael Chen", email: "m.chen@email.com" },
    { name: "Emily Rodriguez", email: "emily.r@email.com" },
    { name: "David Kim", email: "david.k@email.com" },
    { name: "Lisa Anderson", email: "lisa.a@email.com" },
    { name: "James Wilson", email: "james.w@email.com" },
    { name: "Maria Garcia", email: "maria.g@email.com" },
    { name: "Robert Taylor", email: "robert.t@email.com" },
    { name: "Jennifer Lee", email: "jennifer.l@email.com" },
    { name: "Daniel Brown", email: "daniel.b@email.com" },
    { name: "Amanda White", email: "amanda.w@email.com" },
    { name: "Christopher Davis", email: "chris.d@email.com" },
    { name: "Jessica Martinez", email: "jessica.m@email.com" },
    { name: "Matthew Thompson", email: "matt.t@email.com" },
    { name: "Ashley Harris", email: "ashley.h@email.com" },
  ];

  const products = [
    { name: "Wireless Headphones", price: 149.99, category: "Audio", sku: "AUD-WH-001" },
    { name: "Phone Case", price: 29.99, category: "Accessories", sku: "ACC-PC-002" },
    { name: "Laptop Stand", price: 89.99, category: "Office", sku: "OFF-LS-003" },
    { name: "Mechanical Keyboard", price: 159.99, category: "Peripherals", sku: "PER-MK-004" },
    { name: "USB-C Hub", price: 79.99, category: "Accessories", sku: "ACC-HUB-005" },
    { name: "Smart Watch Band", price: 49.99, category: "Wearables", sku: "WER-SWB-006" },
    { name: "Portable Monitor", price: 299.99, category: "Displays", sku: "DIS-PM-007" },
    { name: "HDMI Cable", price: 19.99, category: "Cables", sku: "CAB-HDMI-008" },
    { name: "Desk Organizer", price: 39.99, category: "Office", sku: "OFF-DO-009" },
    { name: "Webcam HD", price: 129.99, category: "Peripherals", sku: "PER-WC-010" },
    { name: "Bluetooth Speaker", price: 89.99, category: "Audio", sku: "AUD-BTS-011" },
    { name: "Charging Dock", price: 54.99, category: "Accessories", sku: "ACC-CD-012" },
    { name: "Screen Protector", price: 24.99, category: "Accessories", sku: "ACC-SP-013" },
    { name: "Gaming Mouse", price: 79.99, category: "Peripherals", sku: "PER-GM-014" },
    { name: "Mouse Pad", price: 19.99, category: "Accessories", sku: "ACC-MP-015" },
    { name: "Cable Organizer", price: 14.99, category: "Office", sku: "OFF-CO-016" },
  ];

  const addresses = [
    { street: "123 Main St", city: "New York", state: "NY", zip: "10001", country: "USA" },
    { street: "456 Oak Ave", city: "San Francisco", state: "CA", zip: "94102", country: "USA" },
    { street: "789 Pine Rd", city: "Austin", state: "TX", zip: "78701", country: "USA" },
    { street: "321 Elm St", city: "Seattle", state: "WA", zip: "98101", country: "USA" },
    { street: "654 Maple Dr", city: "Boston", state: "MA", zip: "02101", country: "USA" },
    { street: "987 Birch Ln", city: "Denver", state: "CO", zip: "80201", country: "USA" },
    { street: "147 Cedar Ct", city: "Portland", state: "OR", zip: "97201", country: "USA" },
    { street: "258 Willow Way", city: "Chicago", state: "IL", zip: "60601", country: "USA" },
  ];

  const statuses: Array<"pending" | "processing" | "shipped" | "delivered" | "cancelled"> = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  const orders: Order[] = [];
  const today = new Date();

  for (let i = 0; i < 50; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const itemCount = Math.floor(Math.random() * 4) + 1;
    const items = [];
    
    for (let j = 0; j < itemCount; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const hasDiscount = Math.random() > 0.7;
      const discount = hasDiscount ? Math.floor(Math.random() * 20) + 5 : 0;
      items.push({
        id: `item-${i}-${j}`,
        name: product.name,
        quantity,
        price: product.price,
        category: product.category,
        sku: product.sku,
        discount,
        inStock: Math.random() > 0.1, // 90% in stock
      });
    }

    const total = items.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity;
      const discountAmount = (itemTotal * item.discount) / 100;
      return sum + (itemTotal - discountAmount);
    }, 0);
    const daysAgo = Math.floor(Math.random() * 60);
    const orderDate = new Date(today);
    orderDate.setDate(orderDate.getDate() - daysAgo);

    // More realistic status distribution based on order age
    let status: typeof statuses[number];
    if (daysAgo < 2) {
      status = Math.random() > 0.7 ? "processing" : "pending";
    } else if (daysAgo < 5) {
      status = Math.random() > 0.3 ? "shipped" : "processing";
    } else if (daysAgo < 10) {
      status = Math.random() > 0.8 ? "shipped" : "delivered";
    } else {
      status = Math.random() > 0.95 ? "cancelled" : "delivered";
    }

    orders.push({
      id: `ORD-2024-${String(i + 1).padStart(3, "0")}`,
      customerName: customer.name,
      customerEmail: customer.email,
      date: orderDate.toISOString().split("T")[0],
      status,
      total,
      items,
      shippingAddress: addresses[Math.floor(Math.random() * addresses.length)],
    });
  }

  return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
