import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { getMonthName } from '../utils/dateUtils';

interface CalendarHeaderProps {
  currentDate: Date;
  view: 'month' | 'week' | 'day';
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: 'month' | 'week' | 'day') => void;
}

export function CalendarHeader({
  currentDate,
  view,
  onPrevious,
  onNext,
  onToday,
  onViewChange,
}: CalendarHeaderProps) {
  const monthName = getMonthName(currentDate.getMonth());
  const year = currentDate.getFullYear();

  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onToday}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <CalendarIcon className="w-4 h-4" />
          Today
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrevious}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onNext}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900">
          {monthName} {year}
        </h2>
      </div>

      <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => onViewChange('month')}
          className={`px-4 py-2 rounded-md transition-colors ${
            view === 'month'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Month
        </button>
        <button
          onClick={() => onViewChange('week')}
          className={`px-4 py-2 rounded-md transition-colors ${
            view === 'week'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Week
        </button>
        <button
          onClick={() => onViewChange('day')}
          className={`px-4 py-2 rounded-md transition-colors ${
            view === 'day'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Day
        </button>
      </div>
    </div>
  );
}
