import React, { useMemo, useState } from "react";
import DataTable from "../table/DataTable";
import SearchBar from "../table/SearchBar";
import BulkActions from "../table/BulkActions";
import { customersColumns } from "./CustomersColumns";
import { customersData, Customer } from "./customersData";
import useDebouncedValue from "../table/useDebouncedSearch";

const CustomersTable = () => {
  const [customers, setCustomers] = useState(customersData);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebouncedValue(searchTerm, 300);


  const filtered = useMemo(() => {
    const term = debouncedSearch.toLowerCase();
    return customers.filter(
    (c) =>
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.phone.toLowerCase().includes(term)
  );
  }, [customers, debouncedSearch]);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <DataTable<Customer>
        columns={customersColumns}
        data={filtered}
        keyField="id"
        onEdit={(c) => console.log("Edit", c)}
        onView={(c) => console.log("View", c)}
        onDelete={(c) => setCustomers(prev => prev.filter(p => p.id !== c.id))}
        bulkActions={
          <BulkActions
            selectedCount={0} // This will be passed from DataTable when integrated fully
            onDelete={() => console.log("Delete Selected")}
            onExport={() => console.log("Export Selected")}
          />
        }
      />
    </div>
  );
};

export default CustomersTable;
