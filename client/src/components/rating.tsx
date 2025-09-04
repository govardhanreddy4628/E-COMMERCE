import React from 'react';

type RatingBarProps = {
  star: number;
  count: number;
  total: number;
  color: string;
};

const RatingBar: React.FC<RatingBarProps> = ({ star, count, total, color }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="flex items-center text-sm">
      <div className="flex w-11 shrink-0 items-center space-x-1 font-semibold">
        <span className="text-sm text-gray-900">{star}</span>
        <svg
          className="w-4 text-orange-400 fill-orange-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
        >
          <path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z" />
        </svg>
      </div>
      <div className="relative h-1 w-52 overflow-hidden rounded-md bg-gray-200 mx-3">
        <div
          className={`absolute h-full rounded-md ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="shrink-0 ps-2 text-gray-700">{count}</div>
    </div>
  );
};

type RatingStatsProps = {
  average: number;
  totalReviews: number;
  breakdown: { [key: number]: number }; // e.g., {5: 3, 4: 4, ...}
};

const RatingStats: React.FC<RatingStatsProps> = ({ average, totalReviews, breakdown }) => {
  return (
    <div className="w-full pb-7 lg:flex lg:flex-wrap">
      <div className="flex shrink-0 flex-col justify-center border-gray-100 pb-6 lg:w-44 lg:border-e lg:pb-0">
        <div className="pb-2 text-5xl font-bold text-gray-900">{average.toFixed(1)}</div>
        <p className="text-gray-500">
          <span>{totalReviews}</span> Verified Buyers
        </p>
      </div>
      <div className="space-y-3 py-1 lg:ps-10">
        {[5, 4, 3, 2, 1].map((star) => (
          <RatingBar
            key={star}
            star={star}
            count={breakdown[star] || 0}
            total={totalReviews}
            color={
              star === 5
                ? 'bg-orange-400'
                : star === 4
                ? 'bg-yellow-400'
                : star === 3
                ? 'bg-green-400'
                : star === 2
                ? 'bg-red-400'
                : 'bg-gray-400'
            }
          />
        ))}
      </div>
    </div>
  );
};

export default RatingStats;
