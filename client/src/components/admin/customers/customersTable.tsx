import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { Customer, customersData } from './customersData';
import Actions from './Actions';
import ActionModal from './ActionModal';
import AddCustomerButton from './AddCustomerButton';
import SearchBar from '../table/SearchBar';
import BulkDelete from '../table/BulkDelete';
import BulkExport from '../table/BulkExport';


const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, -1]; // -1 means "All"

const CustomersTable: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [selected, setSelected] = useState<number[]>([]);
    const [sortField, setSortField] = useState<'orders' | 'totalSpend' | null>(null);
    const [sortAsc, setSortAsc] = useState(true);
    const [customers, setCustomers] = useState<Customer[]>(customersData);
    const [actionType, setActionType] = useState<'add' | 'edit' | 'view' | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(customers);

    //customer data fetching from backend
    // useEffect(()=>{
    //     const fetchCustomers = async () => {
    //         try {
    //             const response = await fetch('http://localhost:8080/api/v1/customers');
    //             const data = await response.json();
    //             console.log('Fetched customers:', data);
    //             setCustomers(data);
    //         } catch (error) {
    //             console.error('Failed to fetch customers:', error);
    //         }
    //     }
    //     fetchCustomers();
    // },[]);


    useEffect(() => {
        const term = searchTerm.toLowerCase();
        const filtered = customers.filter(
            (c) =>
                c.name.toLowerCase().includes(term) ||
                c.email.toLowerCase().includes(term) ||
                c.phone.toLowerCase().includes(term)
        );
        setFilteredCustomers(filtered);
    }, [searchTerm, customers]);


    const closeModal = () => {
        setShowModal(false);
        setSelectedCustomer(null);
    };


    const handleFormSubmit = (customer: Customer) => {
        setCustomers((prev) => {
            const exists = prev.find((c) => c.id === customer.id);
            if (exists) {
                // Update
                return prev.map((c) => (c.id === customer.id ? customer : c));
            } else {
                // Add
                return [...prev, customer];
            }
        });
        closeModal();
    };

    // Sorting toggle
    const toggleSort = (field: 'orders' | 'totalSpend') => {
        if (sortField === field) {
            setSortAsc(!sortAsc);
        } else {
            setSortField(field);
            setSortAsc(true);
        }
    };

    // Sort data accordingly
    const sortedData = [...customersData].sort((a, b) => {
        if (!sortField) return 0;
        const aVal = a[sortField];
        const bVal = b[sortField];
        return sortAsc ? aVal - bVal : bVal - aVal;
    });

    // Calculate total pages, handle "All"
    const totalPages = rowsPerPage === -1 ? 1 : Math.ceil(sortedData.length / rowsPerPage);

    // Paginate data
    const pagedData =
        rowsPerPage === -1
            ? sortedData
            : sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    // Select all on current page
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelected(pagedData.map((c) => c.id));
        } else {
            setSelected([]);
        }
    };

    // Select/deselect individual row
    const handleSelectRow = (id: number) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    // Export selected customers to CSV
    const handleExportCSV = () => {

        if (selected.length === 0) return alert('No customers selected.');

        const data = customersData
            .filter((c) => selected.includes(c.id))
            .map((c) => ({
                ID: c.id,
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


    // Bulk delete (just alert for now)
    const handleBulkDelete = () => {
        if (selected.length === 0) return alert('No customers selected for deletion.');
        alert(`Deleting customers with IDs: ${selected.join(', ')}`);
        // Implement actual delete logic here
    };



    const highlightMatch = (text: string, query: string) => {
        if (!query) return text;

        const regex = new RegExp(`(${query})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, i) =>
            part.toLowerCase() === query.toLowerCase() ? (
                <strong key={i} className="text-black dark:text-white font-semibold">
                    {part}
                </strong>
            ) : (
                part
            )
        );
    };



    return (
        <div className="p-6 text-gray-900 dark:text-gray-100">
            <div className="flex justify-between items-center mb-8">

                <h1 className="text-2xl font-bold">All Customers</h1>
                <AddCustomerButton setShowModal={setShowModal} setActionType={setActionType} setSelectedCustomer={setSelectedCustomer} />

            </div>

            {/* Controls */}
            <div className="flex justify-between items-center mb-4">

                <div className='flex gap-4 flex-1'>
                    <BulkDelete handleBulkDelete={handleBulkDelete} selected={selected} />
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </div>

                <div className="flex items-center gap-3">
                    <label htmlFor="rowsPerPage" className="text-sm">
                        Rows per page:
                    </label>
                    <select
                        id="rowsPerPage"
                        value={rowsPerPage}
                        onChange={(e) => {
                            const val = e.target.value === 'all' ? -1 : parseInt(e.target.value);
                            setRowsPerPage(val);
                            setCurrentPage(1);
                            setSelected([]);
                        }}
                        className="px-2 py-1 rounded border dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                    >
                        {ROWS_PER_PAGE_OPTIONS.map((num) =>
                            num === -1 ? (
                                <option key="all" value="all">
                                    All
                                </option>
                            ) : (
                                <option key={num} value={num}>
                                    {num}
                                </option>
                            )
                        )}
                    </select>

                    <BulkExport handleExportCSV={handleExportCSV} selected={selected} />
                </div>
            </div>



            {/* Table */}
            <div className="overflow-x-auto border rounded dark:border-gray-700  max-h-[60vh] overflow-y-auto">

                <table className="min-w-full  bg-white dark:bg-gray-900 text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        <tr>
                            <th className="px-4 py-2">
                                <input
                                    type="checkbox"
                                    checked={pagedData.length > 0 && selected.length === pagedData.length}
                                    onChange={handleSelectAll}
                                    aria-label="Select all customers on current page"
                                />
                            </th>
                            <th className="px-4 py-2 text-left ">Name</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Phone</th>
                            <th className="px-4 py-2 text-left">Address</th>
                            <th className="px-4 py-2 text-left">Joined</th>
                            <th className="px-4 py-2 cursor-pointer select-none text-nowrap"
                                onClick={() => toggleSort('orders')}
                                title="Sort by orders"
                            >
                                Orders {sortField === 'orders' ? (sortAsc ? '↑' : '↓') : ''}
                            </th>
                            <th
                                onClick={() => toggleSort('totalSpend')}
                                className="px-4 py-2 cursor-pointer select-none text-right text-nowrap flex items-center gap-1"
                                title="Sort by total spend"
                            >
                                Total Spend {sortField === 'totalSpend' ? (sortAsc ? <span>↑</span> : '↓') : ''}
                            </th>
                            <th className="px-4 py-2 text-left">Last Order</th>
                            <th className="px-4 py-2 text-center">Status</th>
                            <th className="px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredCustomers.map((cust) => (
                            <tr
                                key={cust.id}
                                className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                <td className="px-4 py-2">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(cust.id)}
                                        onChange={() => handleSelectRow(cust.id)}
                                        aria-label={`Select customer ${cust.name}`}
                                    />
                                </td>
                                <td className="px-4 py-2 flex items-center gap-3">
                                    <img
                                        src={cust.avatar}
                                        alt={cust.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <span className='text-nowrap min-w-44'>{highlightMatch(cust.name, searchTerm)}</span>
                                </td>
                                <td className="px-4 py-2">{highlightMatch(cust.email, searchTerm)}</td>
                                <td className="px-4 py-2 text-nowrap">{highlightMatch(cust.phone, searchTerm)}</td>
                                <td className="px-4 py-2 min-w-56">{highlightMatch(cust.address, searchTerm)}</td>
                                <td className="px-4 py-2 text-nowrap">{highlightMatch(cust.joined, searchTerm)}</td>
                                <td className="px-4 py-2">{cust.orders}</td>
                                <td className="px-4 py-2 text-right">${cust.totalSpend.toFixed(2)}</td>
                                <td className="px-4 py-2 text-nowrap">{cust.lastOrder}</td>
                                <td className="px-4 py-2 text-center">
                                    <span
                                        className={`inline-block px-2 py-1 text-xs font-semibold rounded ${cust.status === 'Active'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                                            }`}
                                    >
                                        {cust.status}
                                    </span>
                                </td>

                                <td className="px-4 py-2 text-center space-x-3 flex items-center">
                                    <Actions cust={cust} setActionType={setActionType} setSelectedCustomer={setSelectedCustomer} setShowModal={setShowModal} />
                                </td>
                            </tr>
                        ))}

                        {pagedData.length === 0 && (
                            <tr>
                                <td colSpan={11} className="text-center py-4 text-gray-500 dark:text-gray-400">
                                    No customers found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>



            {/* Modal with Form */}
            <ActionModal actionType={actionType} showModal={showModal} setShowModal={setShowModal} selectedCustomer={selectedCustomer} handleFormSubmit={handleFormSubmit} />



            {rowsPerPage !== -1 && (
                <div className="flex justify-between items-center mt-4 text-gray-700 dark:text-gray-300">
                    <p className="text-sm">
                        Showing {(currentPage - 1) * rowsPerPage + 1}-
                        {Math.min(currentPage * rowsPerPage, filteredCustomers.length)} of {filteredCustomers.length}
                    </p>

                    <div className="space-x-2 flex items-center">
                        {/* Prev Button */}
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-600"
                        >
                            Prev
                        </button>

                        {
                            (() => {
                                const pages = [];
                                const totalPageButtons = 5; // max page buttons (excluding first/last/... if shown)
                                const showLeftEllipsis = currentPage > 3;
                                const showRightEllipsis = currentPage < totalPages - 2;

                                // Always show first page
                                pages.push(
                                    <button
                                        key={1}
                                        onClick={() => setCurrentPage(1)}
                                        className={`px-3 py-1 border rounded dark:border-gray-600 ${currentPage === 1 ? 'bg-blue-600 text-white' : ''}`}
                                    >
                                        1
                                    </button>
                                );

                                // Left Ellipsis
                                if (showLeftEllipsis) {
                                    pages.push(
                                        <span key="left-ellipsis" className="px-2">
                                            ...
                                        </span>
                                    );
                                }

                                // Middle Page Buttons
                                let start = Math.max(2, currentPage - 1);
                                let end = Math.min(totalPages - 1, currentPage + 1);

                                if (!showLeftEllipsis) {
                                    start = 2;
                                    end = 4;
                                }

                                if (!showRightEllipsis) {
                                    start = totalPages - 3;
                                    end = totalPages - 1;
                                }

                                start = Math.max(start, 2);
                                end = Math.min(end, totalPages - 1);

                                for (let i = start; i <= end; i++) {
                                    pages.push(
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i)}
                                            className={`px-3 py-1 border rounded dark:border-gray-600 ${currentPage === i ? 'bg-blue-600 text-white' : ''}`}
                                        >
                                            {i}
                                        </button>
                                    );
                                }

                                // Right Ellipsis
                                if (showRightEllipsis) {
                                    pages.push(
                                        <span key="right-ellipsis" className="px-2">
                                            ...
                                        </span>
                                    );
                                }

                                // Always show last page if more than one
                                if (totalPages > 1) {
                                    pages.push(
                                        <button
                                            key={totalPages}
                                            onClick={() => setCurrentPage(totalPages)}
                                            className={`px-3 py-1 border rounded dark:border-gray-600 ${currentPage === totalPages ? 'bg-blue-600 text-white' : ''}`}
                                        >
                                            {totalPages}
                                        </button>
                                    );
                                }

                                return pages;
                            })()
                        }

                        {/* Next Button */}
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-600"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CustomersTable;
