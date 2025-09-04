import { useState } from "react";
import DataTable from "../table/DataTable";
import SearchBar from "../table/SearchBar";
import { ordersColumns } from "./OrdersColumns";
import { ordersData, Order } from "./OrdersData";

const OrdersTable = () => {
  const [orders, setOrders] = useState(ordersData);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between mb-4">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <DataTable<Order>
        columns={ordersColumns}
        data={filtered}
        keyField="id"
        onView={(o) => console.log("View", o)}
        onEdit={(o) => console.log("Edit", o)}
        onDelete={(o) => setOrders(prev => prev.filter(ord => ord.id !== o.id))}
      />
    </div>
  );
};

export default OrdersTable;
