import { Pie } from 'react-chartjs-2';
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

type category = {
  name: string;
  percentage: number;
  backgroundColor: string;
  image: string; // new image path
};

const categories: category[] = [
  {
    name: 'Fassion',
    percentage: 40,
    backgroundColor: '#3b82f6',
    image: 'https://serviceapi.spicezgold.com/download/1748409729550_fash.png'
  },
  {
    name: 'Electronics',
    percentage: 20,
    backgroundColor: '#10b981',
    image: 'https://serviceapi.spicezgold.com/download/1741660988059_ele.png'
  },
  {
    name: 'Footware',
    percentage: 5,
    backgroundColor: '#f59e0b',
    image: 'https://serviceapi.spicezgold.com/download/1741661061379_foot.png'
  },
  {
    name: 'Groceries',
    percentage: 10,
    backgroundColor: '#ec4899',
    image: 'https://serviceapi.spicezgold.com/download/1741661077633_gro.png'
  },
  {
    name: 'Bags',
    percentage: 10,
    backgroundColor: '#8b5cf6',
    image: 'https://serviceapi.spicezgold.com/download/1741661045887_bag.png'
  },
  {
    name: 'Jewellery',
    percentage: 15,
    backgroundColor: '#eab308',
    image: 'https://serviceapi.spicezgold.com/download/1749273446706_jw.png'
  },
  {
    name: 'Beauty',
    percentage: 12,
    backgroundColor: '#0ea5e9',
    image: 'https://serviceapi.spicezgold.com/download/1741661092792_beauty.png'
  },
  {
    name: 'Wellness',
    percentage: 8,
    backgroundColor: '#ef4444',
    image: 'https://serviceapi.spicezgold.com/download/1741661105893_well.png'
  }
];


const salesData = (categories: category[]) => {
  return {
    labels: categories.map((c) => c.name),
    datasets: [
      {
        label: 'Sales Share',
        data: categories.map((c) => c.percentage),
        backgroundColor: categories.map((c) => c.backgroundColor)
      }
    ]
  };
};

// const salesData = {
//   labels: ['Fassion', 'Electronics', 'Footware', 'Groceries', 'Bags', 'jewellery'],
//   datasets: [{
//     label: 'Sales Share',
//     data: [40, 20, 5, 10, 10, 15],
//     backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#374151', '#10b981']
//   }]
// };


const pieChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false // 👈 disables the label indicators
    }
  },
  // Optional: Remove any axes (not usually needed for Pie)
  scales: {
    x: { display: false },
    y: { display: false }
  }
};



const CategoryBreakdownCard: React.FC = () => {


  return (
    <div className="p-6 rounded-xl shadow bg-white dark:bg-gray-800 w-full max-w-2xl">
      <div className='mb-6'>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Category Sales Breakdown
        </h2>
        <p className="text-sm text-muted-foreground">
          Best performing categories based on sales
        </p>
      </div>

      <div className="flex gap-6 lg:gap-12">

        <div className="space-y-5">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center gap-4">
              {/* Image avatar */}
              <div className="w-9 h-9 flex-shrink-0 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 bg-white">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name + Progress */}
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {category.name}
                  </span>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {category.percentage}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${category.percentage}%`,
                      backgroundColor: category.backgroundColor
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`flex items-center justify-center`}>
          <Pie data={salesData(categories)} options={pieChartOptions} className='w-6 h-64 lg:w-80 lg:h-80 ' />
        </div>

      </div>

    </div>
  );
};


export default CategoryBreakdownCard;
