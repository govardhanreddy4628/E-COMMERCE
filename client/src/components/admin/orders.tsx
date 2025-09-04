import { useState } from 'react'
import { useTheme } from '../../context/themeContext';


const orders = Array.from({ length: 42 }, (_, i) => ({
    id: `#10${i + 1}`,
    customer: ['Jane Doe', 'John Smith', 'Alice Kim', 'Tom Hardy', 'Emily Stone'][i % 5],
    amount: `$${(Math.random() * 1000 + 50).toFixed(2)}`,
    status: ['Shipped', 'Pending', 'Delivered'][i % 3],
    date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
}));

const tableHeader = ['Order ID', 'Customer', 'Amount', 'Status', 'Date'];

const getStatusColor = (status: "Pending" | "Shipped" | "Delivered"): string => {
    const classes: Record<"Pending" | "Shipped" | "Delivered", string> = {
        Shipped: 'bg-blue-100 text-blue-700',
        Pending: 'bg-yellow-100 text-yellow-700',
        Delivered: 'bg-green-100 text-green-700',
    };
    return classes[status] || 'bg-gray-100 text-gray-700';
};


const Orders = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const totalPages = Math.ceil(orders.length / pageSize);
    const visibleOrders = orders.slice((page - 1) * pageSize, page * pageSize);
    return (
        <div>
            <main className="flex-1 p-8 overflow-y-auto">
                <div className={`dark:bg-gray-800 bg-white p-6 rounded-lg shadow`}>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className={`text-xl font-semibold dark:text-white text-gray-800`}>Recent Orders</h2>
                        <div>
                            <label className={`mr-2 dark:text-white text-gray-700`}>Rows per page:</label>
                            <select
                                className={`p-1 rounded text-sm border dark:bg-gray-700 dark:text-white dark:border-gray-600 bg-white border-gray-300`}
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setPage(1);
                                }}
                            >
                                {[5, 10, 20, 30].map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    {tableHeader.map(header => (
                                        <th key={header} className={`py-2 px-4 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {visibleOrders.map((order, i) => (
                                    <tr key={i} className="border-t">
                                        <td className={`py-2 px-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{order.id}</td>
                                        <td className={`py-2 px-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{order.customer}</td>
                                        <td className={`py-2 px-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{order.amount}</td>
                                        <td className="py-2 px-4">
                                            <span className={`px-2 py-1 text-sm rounded-full ${getStatusColor(order.status as "Shipped" | "Pending" | "Delivered")}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className={`py-2 px-4 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>{order.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-4">
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                            Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, orders.length)} of {orders.length}
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                className="px-3 py-1 rounded text-sm border disabled:opacity-50"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                Prev
                            </button>
                            <span className={`${isDark ? 'text-white' : 'text-gray-800'} text-sm`}>
                                Page {page} of {totalPages}
                            </span>
                            <button
                                className="px-3 py-1 rounded text-sm border disabled:opacity-50"
                                disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </main>
           
        </div>
    )
}

export default Orders
