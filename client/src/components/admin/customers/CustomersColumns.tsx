import { Column } from "../table/DataTable";
import { Customer } from "./customersData";

export const customersColumns: Column<Customer>[] = [
  {
    label: "Name",
    accessor: "name",
    sortable: true,
    render: (c) => (
      <div className="flex items-center gap-2">
        <img src={c.avatar} className="w-8 h-8 rounded-full" />
        {c.name}
      </div>
    )
  },
  { label: "Email", accessor: "email" },
  { label: "Phone", accessor: "phone" },
  { label: "Address", accessor: "address" },
  { label: "Joined", accessor: "joined", sortable: true, render: (c) => new Date(c.joined).toLocaleDateString() },
  { label: "Orders", accessor: "orders", sortable: true },
  { label: "Total Spend", accessor: "totalSpend", sortable: true, render: (c) => `$${c.totalSpend.toFixed(2)}` },
  { label: "Status", accessor: "status" },
  { label: "Last Order", accessor: "lastOrder", sortable: true, render: (c) => new Date(c.lastOrder).toLocaleDateString() },
  { label: "Actions", accessor: "actions",}
];



// export const customersColumnsWithActions: Column<Customer>[] = [
//   ...customersColumns,
//   {
//     label: "Actions",
//     accessor: "actions",
//     render: (c) => (
//       <div className="flex gap-2">
//         <button className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
//           Edit
//         </button>
//         <button className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
//           Delete
//         </button>
//       </div>
//     )
//   }
// ];