import { useContext, useState } from "react";
import { calendarContext } from "./calendarContext";
import { FaCaretDown } from "react-icons/fa";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const CalendarHeader = () => {
  const [selectedDuration, setSelectedDuration] = useState("month");
  const [openDurationDropdown, setOpenDurationDropdown] = useState(false);
  const today = new Date().getDate();

  const ctx = useContext(calendarContext);
  if (!ctx) return <div>Calendar context not found</div>;

  const { currentMonth, goToNextMonth, goToPrevMonth, resetToToday } = ctx;

  const firstDay = currentMonth[0][0];

  return (
    <header className="px-4 py-2 flex items-center gap-2 justify-between w-full">
      <div className="flex items-center gap-12">
        {/* Calendar Logo */}
        <div className="flex items-center gap-2">
          <img
            src={`https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_${today}_2x.png`}
            srcSet={`
              https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_${today}_2x.png 1x,
              https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_${today}_2x.png 2x
            `}
            alt="Calendar logo"
            aria-hidden="true"
            role="presentation"
            width={40}
            height={40}
          />
          <h3 className="font-medium text-xl">Calendar</h3>
        </div>

        {/* Month navigation */}
        <div className="flex items-center gap-4">
          <button
            className="capitalize text-primary flex items-center justify-between gap-2 px-4 py-2 mr-5 border border-gray-900 rounded-lg shadow-sm hover:bg-gray-100 transition duration-150"
            onClick={resetToToday}
          >
            Today
          </button>

          <div className="flex items-center gap-2">
            <button
              aria-label="previous"
              onClick={goToPrevMonth}
              className="p-1 rounded-full hover:bg-gray-300 text-gray-700 transition-colors duration-200"
            >
              <MdChevronLeft size={22} />
            </button>

            <button
              aria-label="next"
              onClick={goToNextMonth}
              className="p-1 rounded-full hover:bg-gray-300 text-gray-700 transition-colors duration-200"
            >
              <MdChevronRight size={22} />
            </button>
          </div>

          <h2 className="text-lg font-medium">
            {/* {currentMonth && currentMonth[0] && currentMonth[0][0] &&
              new Date(currentMonth[0][0]).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })} */}
              {firstDay.toLocaleString("default", { month: "long", year: "numeric" })}
          </h2>
        </div>
      </div>

      {/* Duration Dropdown */}
      <div className="relative inline-block">
        <button
          onClick={() => setOpenDurationDropdown(!openDurationDropdown)}
          className="flex items-center justify-between gap-2 px-4 py-2 mr-5 border border-gray-900 rounded-lg shadow-sm hover:bg-gray-100 transition duration-150"
        >
          <span className="capitalize">{selectedDuration}</span>
          <FaCaretDown
            className={`transition-transform duration-200 ${
              openDurationDropdown ? "rotate-180" : ""
            }`}
          />
        </button>

        {openDurationDropdown && (
          <div className="absolute top-full -left-2 mt-2 w-full bg-white border border-gray-200 shadow-lg rounded-md z-10">
            {["day", "week", "month", "year"].map((duration) => (
              <div
                key={duration}
                onClick={() => {
                  setSelectedDuration(duration);
                  setOpenDurationDropdown(false);
                }}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 w-full text-center capitalize transition-colors"
              >
                {duration}
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default CalendarHeader;
