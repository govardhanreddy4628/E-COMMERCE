import * as XLSX from 'xlsx';
import { Customer } from '../customers/customersData';
import { toast } from '../../../hooks/use-toast';

type BulkExportProps = {
    selected: number[];
    filteredCustomers: Customer[]
};

const BulkExport = ({ selected, filteredCustomers }: BulkExportProps) => {

    // Export selected customers to CSV
    const handleExportToExcel = () => {

        if (selected.length === 0) {
            toast({
                title: "No customers selected",
                description: "Please select at least one customer before exporting.",
                variant: "destructive",
            });
            return;
        }

        const data = filteredCustomers
            .filter((c) => selected.includes(c.id))
            .map((c) => ({
                ID: c.id,
                Avatar: c.avatar,
                Name: c.name,
                Email: c.email,
                Phone: c.phone,
                Address: c.address,
                Joined: c.joined,
                Orders: c.orders,
                TotalSpend: c.totalSpend,
                LastOrder: c.lastOrder,
                Status: c.status,
            }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');
        XLSX.writeFile(workbook, 'customers_export.xlsx');
    };

    return (
        <>
            <button
                onClick={handleExportToExcel}
                disabled={selected.length === 0}
                className="px-3 py-1 bg-green-600 rounded text-white disabled:opacity-50"
            >
                Export To Excel
            </button>
        </>
    )
}

export default BulkExport
