import { Column } from "../table/DataTable";
import { Order } from "./OrdersData";


export const ordersColumns: Column<Order>[] = [
  { label: "Order #", accessor: "orderNumber", sortable: true },
  { label: "Customer", accessor: "customerName", sortable: true },
  { label: "Date", accessor: "date", sortable: true },
  { label: "Total", accessor: "total", sortable: true, render: (o) => `$${o.total.toFixed(2)}` },
  { label: "Status", accessor: "status" }
];
