import React, { useEffect, useState } from 'react';
import { Customer } from './customersData';

type Props = {
  customer: Customer | null;
};

type Order = { id: string; date: string; total: number; };

const TABS = ['Info', 'Orders', 'Activity'] as const;
type Tab = (typeof TABS)[number];

const CustomerProfile: React.FC<Props> = ({ customer }) => {
  const [activeTab, setActiveTab] = useState<Tab>('Info');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (customer && activeTab === 'Orders') {
      setLoadingOrders(true);
      // Simulate API call
      setTimeout(() => {
        setOrders([
          { id: 'INV-1001', date: '2025-01-12', total: 129.5 },
          { id: 'INV-1002', date: '2025-02-10', total: 256.75 },
        ]);
        setLoadingOrders(false);
      }, 800);
    }
  }, [customer, activeTab]);

  //   if backend data available
  //   useEffect(() => {
  //   if (customer && activeTab === 'Orders') {
  //     setLoadingOrders(true);
  //     fetch(`/api/customers/${customer.id}/orders`)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setOrders(data); // Ensure it matches Order[]
  //         setLoadingOrders(false);
  //       });
  //   }
  // }, [customer, activeTab]);

  const handlePrint = () => window.print();

  const handleEmail = () => {
    if (customer) window.location.href = `mailto:${customer.email}`;
  };

  const handleDeactivate = () => {
    if (customer?.status === 'Inactive') return;
    if (customer) {
      alert(`Deactivated ${customer.name}`);
    }
    // Hook to real API or state update here
  };

  if (!customer) return null;

  return (
    <>
      {/* Tab Selector */}
      <div className="flex space-x-6 border-b mb-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 font-medium border-b-2 transition ${activeTab === tab
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-300'
              : 'border-transparent text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-white'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Info' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                customer.name
              )}&background=random`}
              alt={customer.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {customer.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{customer.email}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{customer.phone}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="font-medium text-gray-700 dark:text-gray-300">Address</label>
              <p className="text-gray-800 dark:text-white">{customer.address || '-'}</p>
            </div>
            <div>
              <label className="font-medium text-gray-700 dark:text-gray-300">Joined</label>
              <p className="text-gray-800 dark:text-white">
                {new Date(customer.joined).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="font-medium text-gray-700 dark:text-gray-300">Status</label>
              <p
                className={`inline-block px-2 py-1 rounded text-xs font-medium ${customer.status === 'Active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'
                  }`}
              >
                {customer.status}
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Orders' && (
        <div>
          {loadingOrders ? (
            <p className="text-sm text-gray-500">Loading orders...</p>
          ) : (
            <table className="w-full text-sm border mt-2">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-2">Order ID</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b dark:border-gray-600">
                    <td className="p-2">{order.id}</td>
                    <td className="p-2">{order.date}</td>
                    <td className="p-2">${order.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'Activity' && (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <p>Activity log or recent actions will go here.</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={handleEmail}
          className="bg-indigo-500 text-white px-3 py-1.5 rounded hover:bg-indigo-600"
        >
          📧 Email
        </button>
        <button
          onClick={handlePrint}
          className="bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600"
        >
          🖨 Print
        </button>
        <button
          onClick={handleDeactivate}
          disabled={customer.status === 'Inactive'}
          className={`px-3 py-1.5 rounded text-white ${customer.status === 'Inactive'
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-red-600 hover:bg-red-700'
            }`}
        >
          🚫 Deactivate
        </button>
      </div>
    </>
  );
};

export default CustomerProfile;
