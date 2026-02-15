import StatsCard from '../../ui/statusCard';
import { BarChart3, TrendingDown, TrendingUp, Wallet2 } from 'lucide-react';
import Layout from './layout';
import { Link } from 'react-router-dom';
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs';
import { InventoryExample } from './inventory.ts/InventoryExample';
import { useTheme } from '../../context/themeContext';
import { Button } from '@mui/material';
import { FaPlus } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
import MuiCollapsibleTable from './muiTable';

import { Line} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useState } from 'react';
import CategoryBreakdownCard from '../Testh';
import { TopProducts } from './TopProducts';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const breadcrumbMap = [
  { path: '/', breadcrumb: 'Home' },
  { path: '/dashboard', breadcrumb: 'Dashboard' },
  { path: '/dashboard/projects', breadcrumb: 'Projects' },
  { path: '/dashboard/projects/:projectId', breadcrumb: 'Project' },
];

export function Dashboard() {
  //   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  //   const toggleSidebar = () => {
  //     setIsSidebarCollapsed(prev => !prev);
  //   };

  const crumbs = useBreadcrumbs(breadcrumbMap);

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const cardBg = isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800';
  const mainBg = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const textColor = isDark ? 'text-gray-100' : 'text-gray-800';

  const [timeRange, setTimeRange] = useState('Month');

  // Mock data for different ranges
  const chartDataByRange = {
    Day: {
      labels: ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm'],
      data: [5, 8, 15, 20, 18, 12, 6, 4]
    },
    Week: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [70, 80, 60, 90, 100, 65, 75]
    },
    Month: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: [240, 260, 220, 300]
    },
    Year: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
      data: [1200, 1500, 1400, 1700, 1650, 1800, 2100, 2300]
    }
  };

  const currentChart = chartDataByRange[timeRange];

  const ordersData = {
    labels: currentChart.labels,
    datasets: [{
      label: `${timeRange} Orders`,
      data: currentChart.data,
      borderColor: isDark ? '#4ade80' : '#2563eb',
      backgroundColor: 'rgba(59,130,246,0.1)',
      fill: true,
      tension: 0.3
    }]
  };


  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: isDark ? '#e5e7eb' : '#374151' } },
      title: { display: true, text: '', color: isDark ? '#e5e7eb' : '#374151' }
    },
    scales: {
      x: { ticks: { color: isDark ? '#e5e7eb' : '#374151' } },
      y: { ticks: { color: isDark ? '#e5e7eb' : '#374151' } }
    }
  };

  
  const Card = ({ title, value, color, isDark }) => (
    <div className={`p-6 rounded-lg shadow text-white bg-gradient-to-r ${color}`}>
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );

  

  return (
    <div>
      <main className="flex-1 transition-all duration-300 mx-auto">

        {/* breadcrumb */}
        <section className=' mx-auto bg-gray-300 dark:bg-gray-600 py-2 mt-4 w-[95%] rounded-md'>
          {crumbs.map((crumb) => {
            return crumb.isLast ? (
              <span key={crumb.to} className='flex gap-2 items-center text-gray-800 dark:text-gray-100 pl-6'><IoHome />/ {crumb.label}</span>
            ) : (
              <span key={crumb.to}>
                <Link to={crumb.to}>{crumb.label}</Link> &gt;{" "}
              </span>
            );
          })}
        </section>

        <section className='grid lg:grid-cols-2 grid-cols-1 w-[95%] mx-auto'>
          <div className='col-span-1 p-4 lg:p-6 bg-slate-100 dark:bg-slate-400 border border-[rgba(0,0,0,0.1)] rounded-lg shadow-lg min-w-48 my-6 pt-8 flex items-center justify-between'>
            <div>
              <h1 className="text-3xl font-bold mb-1 text-black">Welcome,</h1>
              <h1 className='text-3xl font-bold text-primary'>John Doe 👋</h1>
              <p className="text-gray-600 mt-4">Here’s What happening on your store today. See the statistics at once.</p>
              <Link to="/products/create">
              <Button className='!mt-6 bg-primary text-white hover:bg-primary/90 transition-colors flex gap-2' variant='contained'><FaPlus /> Add Product</Button>
              </Link>
            </div>
            <img src="https://ecommerce-admin-view.netlify.app/shop-illustration.webp" className='w-[200px]' />
          </div>


          <div className=" col-span-1 p-4 lg:py-6 lg:pr-0 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 animate-slide-up h-full" style={{ '--delay': '100ms' } as React.CSSProperties}>
              <StatsCard
                title="Total Sales"
                value="$42,250"
                trend={0.47}
                icon={<Wallet2 />}
                className="bg-primary/5 bg-gradient-to-br from-blue-500/50 to-pink-300/50 rounded-lg shadow hover:opacity-80 transition-opacity duration-300"
              />
              <StatsCard
                title="Orders"
                value="1,040"
                description="Today's volume"
                icon={<BarChart3 />}
                className="bg-primary/5 bg-gradient-to-br from-violet-500/50 to-green-300/50 rounded-lg shadow hover:opacity-80 transition-opacity duration-300"
              />
              <StatsCard
                title="Revenue"
                value="$9,800"
                trendLabel=""
                icon={<TrendingUp />}
                className="bg-success/5 bg-gradient-to-br from-green-500/50 to-blue-300/80 rounded-lg shadow hover:opacity-80 transition-opacity duration-300"
              />
              <StatsCard
                title="Customers"
                value="3,200"
                trendLabel=""
                icon={<TrendingDown />}
                className="bg-danger/5 bg-gradient-to-br from-red-500/50 to-slate-600/50 rounded-lg shadow hover:opacity-80 transition-opacity duration-300"
              />
            </div>
          </div>
        </section>

        <div className='shadow-xl mx-auto w-[95%] h-auto rounded-md mb-5'>
          <InventoryExample isDarkMode={theme === "light" ? false : true} />
        </div>

        <MuiCollapsibleTable isDarkMode={theme === "light" ? false : true}/>

        <main className="flex-1 p-8 overflow-y-auto">
          

          {/* orders Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-1 !h-96 gap-6 mb-8">
            <div className={`${cardBg} p-6 rounded-lg shadow`}>
              <div className="flex justify-between items-center">
                <h2 className={`text-xl font-semibold ${textColor}`}>Orders Overview</h2>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className={`p-2 rounded border text-sm ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
                >
                  <option>Day</option>
                  <option>Week</option>
                  <option>Month</option>
                  <option>Year</option>
                </select>
              </div>
              <Line data={ordersData} options={chartOptions} className='!h-[65%]'/>
            </div>

          {/* category and top products charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryBreakdownCard/>
            <TopProducts/>
          </div>

           
          </div>
        </main>
      </main>
    </div>
  );
}
