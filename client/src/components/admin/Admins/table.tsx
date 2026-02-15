import Actions from './Actions'

const Table = ({ pagedData, selected, handleSelectAll, toggleSort, sortField, filteredCustomers, highlightMatch, handleSelectRow, searchTerm, sortAsc, setActionType, setSelectedCustomer, setShowModal }) => {
    return (
        <div>
            <div className="overflow-x-auto border rounded dark:border-gray-700  max-h-[60vh] overflow-y-auto">

                <table className="min-w-full  bg-white dark:bg-gray-900 text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        <tr>
                            <th className="px-4 py-2">
                                <input
                                    type="checkbox"
                                    checked={pagedData?.length > 0 && selected?.length === pagedData?.length}
                                    onChange={handleSelectAll}
                                    aria-label="Select all customers on current page"
                                />
                            </th>
                            <th className='px-4 py-2'>Avatar</th>
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
                        {filteredCustomers?.map((cust, idx) => (
                            <tr
                                key={cust.id}
                                className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                <td className="px-4 py-2">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(cust.id)}
                                        onChange={(e) => handleSelectRow(cust.id, idx, (e.nativeEvent as MouseEvent).shiftKey, e.target.checked)}
                                        aria-label={`Select customer ${cust.name}`}
                                    />
                                </td>
                                <td className="px-4 py-2 flex items-center gap-3">
                                    <img
                                        src={cust.avatar}
                                        alt={cust.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                </td>
                                <td className='text-nowrap min-w-44'>{highlightMatch(cust.name, searchTerm)}</td>
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

                        {pagedData?.length === 0 && (
                            <tr>
                                <td colSpan={11} className="text-center py-4 text-gray-500 dark:text-gray-400">
                                    No customers found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Table
