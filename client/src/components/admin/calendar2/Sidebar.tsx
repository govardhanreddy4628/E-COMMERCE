import React from "react";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 border-r p-4 bg-white">
      <div className="mb-4">
        <h4 className="font-semibold">My calendars</h4>
        <div className="mt-2 text-sm text-gray-600">Personal</div>
      </div>
      <div>
        <h4 className="font-semibold">Upcoming</h4>
        <div className="mt-2 text-sm text-gray-600">No upcoming events</div>
      </div>
    </aside>
  );
};

export default Sidebar;
