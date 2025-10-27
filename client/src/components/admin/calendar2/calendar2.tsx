// import React, { useContext } from "react"
// import dayjs, { Dayjs } from "dayjs"
// import Sidebar from "./Sidebar"
// import CalendarHeader from "./CalendarHeader"
// import { calendarContext } from "./calendarContext";

// // Define types for props
// interface DayProps {
//   day: Dayjs;
//   rowIdx: number;
// }

// interface MonthProps {
//   month: Dayjs[][];
// }

// const Calendar2: React.FC = () => {

//   // Get the context and handle the case when it's null
//   const context = useContext(calendarContext);

//   if (!context) {
//     // Handle the case when context is null (e.g., return a loading state or error)
//     return <div>Loading...</div>;
//   }

//   const { currentMonth } = context;


//   return (
//     <div className="h-[calc(100vh-4rem)] flex flex-col">
//       <CalendarHeader />
//       <div className="flex flex-1">
//         <Sidebar />
//         <Month month={currentMonth} />
//       </div>
//     </div>
//   )
// }

// export default Calendar2

// // Month component
// const Month: React.FC<MonthProps> = ({ month }) => {
//   return (
//     <div className='flex-1 grid grid-cols-7 '>
//       {month.map((row, i) => (
//         <React.Fragment key={i}>
//           {row.map((day, idx) => (
//              <Day day={day} rowIdx={i} key={idx} />
//           ))}
//         </React.Fragment>
//       ))}
//     </div>
//   )
// }

// // Day component
// const Day: React.FC<DayProps> = ({ day, rowIdx }) => {

//   function getCurrentDayClass(): string {
//     return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
//       ? "bg-blue-600 text-white rounded-full w-7"
//       : ""
//   }

//   function bgColorChange(): string {
//     return day.format("MM") === dayjs().format("MM") ? "" : "bg-gray-200"
//   }

//   return (
//     <div className={`border border-gray-200 flex flex-col ${bgColorChange()}`}>
//       <header className={`flex flex-col items-center`}>
//         {rowIdx === 0 && (<p>{day.format("ddd").toUpperCase()}</p>)}
//         <p className={`text-sm p-1 my-1 text-center ${getCurrentDayClass()}`}>
//           {day.format("DD")}
//         </p>
//       </header>
//     </div>
//   )
// }










// import React, { useContext, useState } from "react";
// import { calendarContext } from "./calendarContext";
// import CalendarHeader from "./CalendarHeader";
// import Sidebar from "./Sidebar";

// const Calendar2: React.FC = () => {
//   const ctx = useContext(calendarContext);
//   if (!ctx) return <div>Loading...</div>;

//   const { currentMonth } = ctx;

//   return (
//     <div className="h-[calc(100vh-4rem)] flex flex-col">
//       <CalendarHeader />
//       <div className="flex flex-1">
//         <Sidebar />
//         <Month month={currentMonth} />
//       </div>
//     </div>
//   );
// };

// export default Calendar2;




// interface MonthProps {
//   month: Date[][];
// }

// const Month: React.FC<MonthProps> = ({ month }) => (
//   <div className="flex-1 grid grid-cols-7">
//     {month.map((row, i) => (
//       <React.Fragment key={i}>
//         {row.map((day, idx) => (
//           <Day key={idx} day={day} rowIdx={i} />
//         ))}
//       </React.Fragment>
//     ))}
//   </div>
// );


// interface DayProps {
//   day: Date;
//   rowIdx: number;
// }

// const Day: React.FC<DayProps> = ({ day, rowIdx }) => {
//   const [showModal, setShowModal] = useState(false)
//   const ctx = useContext(calendarContext);
//   if (!ctx) return null;

//   const { monthIndex, year, events } = ctx;
//   const today = new Date();

//   const isToday =
//     day.getDate() === today.getDate() &&
//     day.getMonth() === today.getMonth() &&
//     day.getFullYear() === today.getFullYear();

//   const isCurrentMonth = day.getMonth() === monthIndex && day.getFullYear() === year;
//   const isSunday = day.getDay() === 0; // Sunday = 0
//   const weekdayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
//   const weekday = weekdayNames[day.getDay()];

//   // Filter events for this day
//   const dayEvents = events.filter(
//     (e) =>
//       e.date.getDate() === day.getDate() &&
//       e.date.getMonth() === day.getMonth() &&
//       e.date.getFullYear() === day.getFullYear()
//   );

//   return (
//     <div className={`border border-gray-200 flex flex-col hover:bg-blue-100 ${isCurrentMonth ? "bg-white" : "bg-transparent"}`}
//     onClick={() => setShowModal(true)}>
//       <header className="flex flex-col items-center">
//         {rowIdx === 0 && (
//           <div className="bg-gray-400 w-full flex items-center justify-center h-6">
//             <p className={`text-xs font-bold ${weekday === "SUN" && "text-red-800"}`}>
//               {weekday}
//             </p>
//           </div>
//         )}
//         <p
//           className={`text-sm p-1 my-1 text-center ${isToday ? "bg-blue-600 text-white rounded-full w-7" : ""
//             } ${isSunday ? "text-red-500 font-medium" : ""}`}
//         >
//           {day.getDate()}
//         </p>
//       </header>

//       {/* Events */}
//       <div className="flex flex-col items-start px-1">
//         {dayEvents.map((event) => (
//           <span
//             key={event.id}
//             className="bg-blue-100 text-blue-800 text-xs px-1 rounded truncate w-full"
//           >
//             {event.title}
//           </span>
//         ))}
//       </div>

//       {showModal && (
//         <AddEventModal date={day} onClose={() => setShowModal(false)} />
//       )}
//     </div>
//   );
// };




















// import React, { useContext, useState } from "react";
// import { CalendarContext } from "./calendarContext";
// import CalendarHeader from "./CalendarHeader";
// import Sidebar from "./Sidebar"; // if you don't have this file, see the simple placeholder below
// import AddEventModal from "./AddEventModal";

// const Calendar2: React.FC = () => {
//   const ctx = useContext(CalendarContext);
//   const [modalDate, setModalDate] = useState<Date | null>(null);

//   if (!ctx) return <div>Loading...</div>;
//   const { currentMonth, duration } = ctx;

//   return (
//     <div className="h-[calc(100vh-4rem)] flex flex-col">
//       <CalendarHeader />
//       <div className="flex flex-1">
//         <Sidebar />
//         <main className="flex-1 p-4 overflow-auto">
//           {duration === "month" && <MonthView month={currentMonth} onDayClick={(d) => setModalDate(d)} />}
//           {duration === "week" && <WeekView month={currentMonth} onDayClick={(d) => setModalDate(d)} />}
//           {duration === "day" && <DayView onDayClick={(d) => setModalDate(d)} />}
//           {duration === "year" && <YearView onDayClick={(d) => setModalDate(d)} />}
//         </main>
//       </div>

//       {modalDate && (
//         <AddEventModal date={modalDate} onClose={() => setModalDate(null)} />
//       )}
//     </div>
//   );
// };

// export default Calendar2;

// /* ---------- MonthView ---------- */
// interface MonthProps {
//   month: Date[][];
//   onDayClick: (date: Date) => void;
// }

// const MonthView: React.FC<MonthProps> = ({ month, onDayClick }) => {
//   return (
//     <div className="grid grid-cols-7 gap-1">
//       {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//         <div key={d} className="text-sm font-medium text-center p-2">
//           {d}
//         </div>
//       ))}

//       {month.map((row, i) =>
//         row.map((day) => <Day key={day.toISOString()} day={day} onClick={() => onDayClick(day)} />)
//       )}
//     </div>
//   );
// };

// /* ---------- WeekView ---------- */
// /**
//  * For WeekView, pick the week that contains the first day visible in the currentMonth matrix.
//  * We'll show that 7-day row with larger cells and more room for events.
//  */
// const WeekView: React.FC<MonthProps> = ({ month, onDayClick }) => {
//   // choose the first week (row 0)
//   const week = month[0] ?? month[month.length - 1] ?? [];
//   return (
//     <div className="grid grid-cols-7 gap-1">
//       {week.map((d) => (
//         <div key={d.toISOString()} className="border rounded p-2 min-h-[120px]">
//           <div className="flex justify-between items-center mb-2">
//             <div className="font-medium">{d.getDate()}</div>
//             <button
//               onClick={() => onDayClick(d)}
//               className="text-xs px-2 py-0.5 border rounded hover:bg-gray-100"
//             >
//               + Add
//             </button>
//           </div>
//           <DayEvents date={d} />
//         </div>
//       ))}
//     </div>
//   );
// };

// /* ---------- DayView ---------- */
// const DayView: React.FC<{ onDayClick: (d: Date) => void }> = ({ onDayClick }) => {
//   const today = new Date();
//   return (
//     <div>
//       <div className="mb-4 flex justify-between items-center">
//         <h3 className="text-xl font-semibold">{today.toDateString()}</h3>
//         <button onClick={() => onDayClick(today)} className="px-3 py-1 border rounded">Add event</button>
//       </div>

//       <div className="grid gap-2">
//         <DayEvents date={today} />
//       </div>
//     </div>
//   );
// };

// /* ---------- YearView ---------- */
// const YearView: React.FC<{ onDayClick: (d: Date) => void }> = ({ onDayClick }) => {
//   const today = new Date();
//   const year = today.getFullYear();
//   const months = Array.from({ length: 12 }, (_, i) => i);
//   return (
//     <div className="grid grid-cols-3 gap-4">
//       {months.map((m) => (
//         <div key={m} className="border rounded p-2">
//           <div className="font-medium mb-2">{new Date(year, m, 1).toLocaleString("default", { month: "long" })}</div>
//           <MiniMonth month={m} year={year} onClickDate={(d) => onDayClick(d)} />
//         </div>
//       ))}
//     </div>
//   );
// };

// /* ---------- MiniMonth (for Year view small month preview) ---------- */
// const MiniMonth: React.FC<{ month: number; year: number; onClickDate: (d: Date) => void }> = ({ month, year, onClickDate }) => {
//   const firstDay = new Date(year, month, 1);
//   const firstWeekday = firstDay.getDay();
//   const daysInMonth = new Date(year, month + 1, 0).getDate();

//   const cells: (Date | null)[] = [];
//   for (let i = 0; i < firstWeekday; i++) cells.push(null);
//   for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

//   return (
//     <div className="grid grid-cols-7 gap-0 text-xs">
//       {["S","M","T","W","T","F","S"].map((d) => <div key={d} className="text-center text-[10px]">{d}</div>)}
//       {cells.map((c, i) => (
//         <div key={i} className="border h-6 text-center text-[11px]">
//           {c ? (
//             <button onClick={() => onClickDate(c)} className="w-full h-full">{c.getDate()}</button>
//           ) : null}
//         </div>
//       ))}
//     </div>
//   );
// };

// /* ---------- Day component for Month cells ---------- */
// const Day: React.FC<{ day: Date; onClick?: () => void }> = ({ day, onClick }) => {
//   const ctx = React.useContext(CalendarContext);
//   if (!ctx) return null;
//   const { events } = ctx;

//   const isThisMonth = day.getMonth() === ctx.monthIndex;
//   const isToday = (() => {
//     const t = new Date();
//     return t.getFullYear() === day.getFullYear() && t.getMonth() === day.getMonth() && t.getDate() === day.getDate();
//   })();

//   const todaysEvents = events.filter((ev) => {
//     return (
//       ev.date.getFullYear() === day.getFullYear() &&
//       ev.date.getMonth() === day.getMonth() &&
//       ev.date.getDate() === day.getDate()
//     );
//   });

//   return (
//     <div
//       onDoubleClick={onClick}
//       onClick={onClick}
//       className={`border p-2 min-h-[80px] cursor-pointer ${isThisMonth ? "bg-white" : "bg-gray-50"} ${
//         isToday ? "ring-2 ring-blue-300" : ""
//       }`}
//     >
//       <div className="flex justify-between items-center mb-2">
//         <div className="text-sm font-medium">{day.getDate()}</div>
//       </div>

//       <div className="flex flex-col gap-1">
//         {todaysEvents.slice(0, 3).map((ev) => (
//           <div key={ev.id} className="text-xs truncate rounded px-1 py-0.5 bg-blue-100">
//             {ev.title}
//           </div>
//         ))}
//         {todaysEvents.length > 3 && <div className="text-xs text-gray-500">+{todaysEvents.length - 3} more</div>}
//       </div>
//     </div>
//   );
// };

// /* ---------- DayEvents component: lists events for a given date ---------- */
// const DayEvents: React.FC<{ date: Date }> = ({ date }) => {
//   const ctx = React.useContext(CalendarContext);
//   if (!ctx) return null;
//   const { events } = ctx;

//   const evts = events.filter((ev) =>
//     ev.date.getFullYear() === date.getFullYear() &&
//     ev.date.getMonth() === date.getMonth() &&
//     ev.date.getDate() === date.getDate()
//   );

//   if (evts.length === 0) return <div className="text-sm text-gray-400">No events</div>;

//   return (
//     <div className="flex flex-col gap-1">
//       {evts.map((ev) => (
//         <div key={ev.id} className="text-sm border rounded px-2 py-1 bg-white">
//           <div className="font-medium">{ev.title}</div>
//           <div className="text-xs text-gray-500">{ev.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
//         </div>
//       ))}
//     </div>
//   );
// };














// import React, { useContext, useState } from "react";
// import { CalendarContext } from "./calendarContext";
// import CalendarHeader from "./CalendarHeader";
// import Sidebar from "./Sidebar"; // placeholder or your sidebar
// import AddEventModal from "./AddEventModal";

// const Calendar2: React.FC = () => {
//   const ctx = useContext(CalendarContext);
//   const [modalDate, setModalDate] = useState<Date | null>(null);

//   if (!ctx) return <div>Loading...</div>;

//   const { currentMonth, duration } = ctx;

//   return (
//     <div className="h-[calc(100vh-4rem)] flex flex-col">
//       <CalendarHeader />

//       <div className="flex flex-1">
//         <Sidebar />

//         <main className="flex-1 p-4 overflow-auto">
//           {duration === "month" && (
//             <MonthView month={currentMonth} onDayClick={(d) => setModalDate(d)} />
//           )}
//           {duration === "week" && (
//             <WeekView month={currentMonth} onDayClick={(d) => setModalDate(d)} />
//           )}
//           {duration === "day" && <DayView onDayClick={(d) => setModalDate(d)} />}
//           {duration === "year" && <YearView onDayClick={(d) => setModalDate(d)} />}
//         </main>
//       </div>

//       {modalDate && (
//         <AddEventModal date={modalDate} onClose={() => setModalDate(null)} />
//       )}
//     </div>
//   );
// };

// export default Calendar2;

// /* ---------- MonthView ---------- */
// interface MonthProps {
//   month: Date[][];
//   onDayClick: (date: Date) => void;
// }

// const MonthView: React.FC<MonthProps> = ({ month, onDayClick }) => {
//   return (
//     <div className="grid grid-cols-7 gap-1">
//       {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//         <div key={d} className="text-sm font-medium text-center p-2">
//           {d}
//         </div>
//       ))}

//       {month.map((row) =>
//         row.map((day) => (
//           <Day key={day.toISOString()} day={day} onClick={() => onDayClick(day)} />
//         ))
//       )}
//     </div>
//   );
// };

// /* ---------- WeekView ---------- */
// const WeekView: React.FC<MonthProps> = ({ month, onDayClick }) => {
//   const ctx = useContext(CalendarContext);
//   if (!ctx) return null;
//   const { events } = ctx;

//   const week = month[0] ?? month[month.length - 1] ?? [];
//   return (
//     <div className="grid grid-cols-7 gap-1">
//       {week.map((d) => {
//         const todaysEvents = events.filter(
//           (ev) =>
//             ev.date.getFullYear() === d.getFullYear() &&
//             ev.date.getMonth() === d.getMonth() &&
//             ev.date.getDate() === d.getDate()
//         );
//         return (
//           <div key={d.toISOString()} className="border rounded p-2 min-h-[120px] relative">
//             <div className="flex justify-between items-center mb-2">
//               <div className="font-medium">{d.getDate()}</div>
//               <button
//                 onClick={() => onDayClick(d)}
//                 className="text-xs px-2 py-0.5 border rounded hover:bg-gray-100"
//               >
//                 + Add
//               </button>
//             </div>
//             <div className="flex flex-col gap-1">
//               {todaysEvents.map((ev) => (
//                 <div
//                   key={ev.id}
//                   className="text-xs border rounded px-2 py-1 bg-blue-100 truncate"
//                 >
//                   {ev.title}
//                 </div>
//               ))}
//               {todaysEvents.length === 0 && <div className="text-sm text-gray-400">No events</div>}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// /* ---------- DayView (Google Calendar style) ---------- */
// const DayView: React.FC<{ onDayClick: (d: Date) => void }> = ({ onDayClick }) => {
//   const ctx = useContext(CalendarContext);
//   if (!ctx) return null;
//   const { events } = ctx;

//   const today = new Date();
//   const hours = Array.from({ length: 24 }, (_, i) => i);

//   return (
//     <div className="flex flex-col h-full overflow-auto relative">
//       <div className="mb-4 flex justify-between items-center">
//         <h3 className="text-xl font-semibold">{today.toDateString()}</h3>
//         <button
//           onClick={() => onDayClick(today)}
//           className="px-3 py-1 border rounded hover:bg-gray-100"
//         >
//           + Add Event
//         </button>
//       </div>

//       <div className="border-t border-gray-200 relative">
//         {hours.map((h) => (
//           <div key={h} className="h-16 border-b border-gray-200 relative">
//             <span className="absolute left-0 -top-2 text-xs text-gray-500 w-10 text-right pr-2">
//               {h}:00
//             </span>
//           </div>
//         ))}

//         {events
//           .filter(
//             (ev) =>
//               ev.date.getFullYear() === today.getFullYear() &&
//               ev.date.getMonth() === today.getMonth() &&
//               ev.date.getDate() === today.getDate()
//           )
//           .map((ev) => {
//             const startHour = ev.date.getHours();
//             const topPosition = startHour * 64; // 16*4 for h-16
//             return (
//               <div
//                 key={ev.id}
//                 className="absolute left-12 right-2 px-2 py-1 rounded bg-blue-500 text-white text-sm shadow"
//                 style={{ top: `${topPosition}px` }}
//               >
//                 {ev.title}
//                 <div className="text-xs text-white/80">
//                   {ev.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                 </div>
//               </div>
//             );
//           })}
//       </div>
//     </div>
//   );
// };

// /* ---------- YearView ---------- */
// const YearView: React.FC<{ onDayClick: (d: Date) => void }> = ({ onDayClick }) => {
//   const today = new Date();
//   const year = today.getFullYear();
//   const months = Array.from({ length: 12 }, (_, i) => i);

//   return (
//     <div className="grid grid-cols-3 gap-4">
//       {months.map((m) => (
//         <div key={m} className="border rounded p-2">
//           <div className="font-medium mb-2">
//             {new Date(year, m, 1).toLocaleString("default", { month: "long" })}
//           </div>
//           <MiniMonth month={m} year={year} onClickDate={(d) => onDayClick(d)} />
//         </div>
//       ))}
//     </div>
//   );
// };

// /* ---------- MiniMonth (Year view preview) ---------- */
// const MiniMonth: React.FC<{ month: number; year: number; onClickDate: (d: Date) => void }> = ({
//   month,
//   year,
//   onClickDate,
// }) => {
//   const firstDay = new Date(year, month, 1);
//   const firstWeekday = firstDay.getDay();
//   const daysInMonth = new Date(year, month + 1, 0).getDate();

//   const cells: (Date | null)[] = [];
//   for (let i = 0; i < firstWeekday; i++) cells.push(null);
//   for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

//   return (
//     <div className="grid grid-cols-7 gap-0 text-xs">
//       {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
//         <div key={d} className="text-center text-[10px]">
//           {d}
//         </div>
//       ))}
//       {cells.map((c, i) => (
//         <div key={i} className="border h-6 text-center text-[11px]">
//           {c ? (
//             <button onClick={() => onClickDate(c)} className="w-full h-full">
//               {c.getDate()}
//             </button>
//           ) : null}
//         </div>
//       ))}
//     </div>
//   );
// };

// /* ---------- Day component for Month cells ---------- */
// const Day: React.FC<{ day: Date; onClick?: () => void }> = ({ day, onClick }) => {
//   const ctx = useContext(CalendarContext);
//   if (!ctx) return null;

//   const { events, monthIndex } = ctx;

//   const isThisMonth = day.getMonth() === monthIndex;
//   const isToday =
//     day.getFullYear() === new Date().getFullYear() &&
//     day.getMonth() === new Date().getMonth() &&
//     day.getDate() === new Date().getDate();

//   const todaysEvents = events.filter(
//     (ev) =>
//       ev.date.getFullYear() === day.getFullYear() &&
//       ev.date.getMonth() === day.getMonth() &&
//       ev.date.getDate() === day.getDate()
//   );

//   return (
//     <div
//       onDoubleClick={onClick}
//       onClick={onClick}
//       className={`border p-2 min-h-[80px] cursor-pointer ${isThisMonth ? "bg-white" : "bg-gray-50"} ${
//         isToday ? "ring-2 ring-blue-300" : ""
//       }`}
//     >
//       <div className="flex justify-between items-center mb-2">
//         <div className="text-sm font-medium">{day.getDate()}</div>
//       </div>
//       <div className="flex flex-col gap-1">
//         {todaysEvents.slice(0, 3).map((ev) => (
//           <div key={ev.id} className="text-xs truncate rounded px-1 py-0.5 bg-blue-100">
//             {ev.title}
//           </div>
//         ))}
//         {todaysEvents.length > 3 && (
//           <div className="text-xs text-gray-500">+{todaysEvents.length - 3} more</div>
//         )}
//       </div>
//     </div>
//   );
// };






















// import React, { useContext, useState } from "react";
// import { CalendarContext } from "./calendarContext";
// import CalendarHeader from "./CalendarHeader";
// import Sidebar from "./Sidebar";
// import AddEventModal from "./AddEventModal";

// const Calendar2: React.FC = () => {
//   const ctx = useContext(CalendarContext);
//   const [modalDate, setModalDate] = useState<Date | null>(null);

//   if (!ctx) return <div>Loading...</div>;
//   const { currentMonth, duration } = ctx;

//   return (
//     <div className="h-[calc(100vh-4rem)] flex flex-col">
//       <CalendarHeader />

//       <div className="flex flex-1">
//         <Sidebar />

//         <main className="flex-1 p-4 overflow-auto">
//           {duration === "month" && (
//             <MonthView month={currentMonth} onDayClick={(d) => setModalDate(d)} />
//           )}
//           {duration === "week" && (
//             <WeekView month={currentMonth} onDayClick={(d) => setModalDate(d)} />
//           )}
//           {duration === "day" && <DayView onDayClick={(d) => setModalDate(d)} />}
//           {duration === "year" && <YearView onDayClick={(d) => setModalDate(d)} />}
//         </main>
//       </div>

//       {modalDate && <AddEventModal date={modalDate} onClose={() => setModalDate(null)} />}
//     </div>
//   );
// };

// export default Calendar2;

// /* ---------- Month View ---------- */
// interface MonthProps {
//   month: Date[][];
//   onDayClick: (date: Date) => void;
// }

// const MonthView: React.FC<MonthProps> = ({ month, onDayClick }) => (
//   <div className="flex-1 grid grid-cols-7 gap-1">
//     {month.map((row, i) => (
//       <React.Fragment key={i}>
//         {row.map((day, idx) => (
//           <Day key={`${i}-${idx}`} day={day} onClick={() => onDayClick(day)} />
//         ))}
//       </React.Fragment>
//     ))}
//   </div>
// );

// /* ---------- Day Component ---------- */
// interface DayProps {
//   day: Date;
//   onClick?: () => void;
// }

// const Day: React.FC<DayProps> = ({ day, onClick }) => {
//   const ctx = useContext(CalendarContext);
//   if (!ctx) return null;
//   const { events, monthIndex } = ctx;

//   const isThisMonth = day.getMonth() === monthIndex;
//   const today = new Date();
//   const isToday =
//     day.getFullYear() === today.getFullYear() &&
//     day.getMonth() === today.getMonth() &&
//     day.getDate() === today.getDate();

//   const todaysEvents = events.filter(
//     (ev) =>
//       ev.date.getFullYear() === day.getFullYear() &&
//       ev.date.getMonth() === day.getMonth() &&
//       ev.date.getDate() === day.getDate()
//   );

//   return (
//     <div
//       onClick={onClick}
//       onDoubleClick={onClick}
//       className={`border p-2 min-h-[80px] cursor-pointer ${isThisMonth ? "bg-white" : "bg-gray-50"} ${
//         isToday ? "ring-2 ring-blue-300" : ""
//       }`}
//     >
//       <div className="flex justify-between items-center mb-2">
//         <div className="text-sm font-medium">{day.getDate()}</div>
//       </div>

//       <div className="flex flex-col gap-1">
//         {todaysEvents.slice(0, 3).map((ev) => (
//           <div key={ev.id} className="text-xs truncate rounded px-1 py-0.5 bg-blue-100">
//             {ev.title}
//           </div>
//         ))}
//         {todaysEvents.length > 3 && (
//           <div className="text-xs text-gray-500">+{todaysEvents.length - 3} more</div>
//         )}
//       </div>
//     </div>
//   );
// };

// /* ---------- Week View ---------- */
// const WeekView: React.FC<MonthProps> = ({ month, onDayClick }) => {
//   const ctx = useContext(CalendarContext);
//   if (!ctx) return null;
//   const { events } = ctx;

//   const week = month[0] ?? month[month.length - 1] ?? [];
//   return (
//     <div className="grid grid-cols-7 gap-1">
//       {week.map((d) => {
//         const todaysEvents = events.filter(
//           (ev) =>
//             ev.date.getFullYear() === d.getFullYear() &&
//             ev.date.getMonth() === d.getMonth() &&
//             ev.date.getDate() === d.getDate()
//         );

//         return (
//           <div key={d.toISOString()} className="border rounded p-2 min-h-[120px] relative">
//             <div className="flex justify-between items-center mb-2">
//               <div className="font-medium">{d.getDate()}</div>
//               <button
//                 onClick={() => onDayClick(d)}
//                 className="text-xs px-2 py-0.5 border rounded hover:bg-gray-100"
//               >
//                 + Add
//               </button>
//             </div>
//             <div className="flex flex-col gap-1">
//               {todaysEvents.map((ev) => (
//                 <div key={ev.id} className="text-xs border rounded px-2 py-1 bg-blue-100 truncate">
//                   {ev.title}
//                 </div>
//               ))}
//               {todaysEvents.length === 0 && <div className="text-sm text-gray-400">No events</div>}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// /* ---------- Day View ---------- */
// const DayView: React.FC<{ onDayClick: (d: Date) => void }> = ({ onDayClick }) => {
//   const ctx = useContext(CalendarContext);
//   if (!ctx) return null;
//   const { events } = ctx;

//   const today = new Date();
//   const hours = Array.from({ length: 24 }, (_, i) => i);

//   return (
//     <div className="flex flex-col h-full overflow-auto relative">
//       <div className="mb-4 flex justify-between items-center">
//         <h3 className="text-xl font-semibold">{today.toDateString()}</h3>
//         <button onClick={() => onDayClick(today)} className="px-3 py-1 border rounded hover:bg-gray-100">
//           + Add Event
//         </button>
//       </div>

//       <div className="border-t border-gray-200 relative">
//         {hours.map((h) => (
//           <div key={h} className="h-16 border-b border-gray-200 relative">
//             <span className="absolute left-0 -top-2 text-xs text-gray-500 w-10 text-right pr-2">
//               {h}:00
//             </span>
//           </div>
//         ))}

//         {events
//           .filter(
//             (ev) =>
//               ev.date.getFullYear() === today.getFullYear() &&
//               ev.date.getMonth() === today.getMonth() &&
//               ev.date.getDate() === today.getDate()
//           )
//           .map((ev) => {
//             const startHour = ev.date.getHours();
//             const topPosition = startHour * 64;
//             return (
//               <div
//                 key={ev.id}
//                 className="absolute left-12 right-2 px-2 py-1 rounded bg-blue-500 text-white text-sm shadow"
//                 style={{ top: `${topPosition}px` }}
//               >
//                 {ev.title}
//                 <div className="text-xs text-white/80">
//                   {ev.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                 </div>
//               </div>
//             );
//           })}
//       </div>
//     </div>
//   );
// };

// /* ---------- Year View ---------- */
// const YearView: React.FC<{ onDayClick: (d: Date) => void }> = ({ onDayClick }) => {
//   const today = new Date();
//   const year = today.getFullYear();
//   const months = Array.from({ length: 12 }, (_, i) => i);

//   return (
//     <div className="grid grid-cols-3 gap-4">
//       {months.map((m) => (
//         <div key={m} className="border rounded p-2">
//           <div className="font-medium mb-2">
//             {new Date(year, m, 1).toLocaleString("default", { month: "long" })}
//           </div>
//           <MiniMonth month={m} year={year} onClickDate={(d) => onDayClick(d)} />
//         </div>
//       ))}
//     </div>
//   );
// };

// /* ---------- MiniMonth ---------- */
// const MiniMonth: React.FC<{ month: number; year: number; onClickDate: (d: Date) => void }> = ({
//   month,
//   year,
//   onClickDate,
// }) => {
//   const firstDay = new Date(year, month, 1);
//   const firstWeekday = firstDay.getDay();
//   const daysInMonth = new Date(year, month + 1, 0).getDate();

//   const cells: (Date | null)[] = [];
//   for (let i = 0; i < firstWeekday; i++) cells.push(null);
//   for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

//   return (
//     <div className="grid grid-cols-7 gap-0 text-xs">
//       {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
//         <div key={d} className="text-center text-[10px]">
//           {d}
//         </div>
//       ))}
//       {cells.map((c, i) => (
//         <div key={i} className="border h-6 text-center text-[11px]">
//           {c ? (
//             <button onClick={() => onClickDate(c)} className="w-full h-full">
//               {c.getDate()}
//             </button>
//           ) : null}
//         </div>
//       ))}
//     </div>
//   );
// };












import React, { useContext, useState } from "react";
import { CalendarContext } from "./calendarContext";
import CalendarHeader from "./CalendarHeader";
import Sidebar from "./Sidebar";
import AddEventModal from "./AddEventModal";

/* ---------- Calendar2 ---------- */
const Calendar2: React.FC = () => {
  const ctx = useContext(CalendarContext);
  const [modalDate, setModalDate] = useState<Date | null>(null);

  if (!ctx) return <div>Loading...</div>;
  const { currentMonth, duration } = ctx;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <CalendarHeader />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 overflow-auto">
          {duration === "month" && (
            <MonthView month={currentMonth} onDayClick={(d) => setModalDate(d)} />
          )}
          {duration === "week" && (
            <WeekView month={currentMonth} onDayClick={(d) => setModalDate(d)} />
          )}
          {duration === "day" && <DayView onDayClick={(d) => setModalDate(d)} />}
          {duration === "year" && <YearView onDayClick={(d) => setModalDate(d)} />}
        </main>
      </div>

      {modalDate && <AddEventModal date={modalDate} onClose={() => setModalDate(null)} />}
    </div>
  );
};

export default Calendar2;

/* ---------- Month View ---------- */
interface MonthProps {
  month: Date[][];
  onDayClick: (date: Date) => void;
}

const MonthView: React.FC<MonthProps> = ({ month, onDayClick }) => (
  <div className="flex-1 grid grid-cols-7 gap-1">
    {month.map((row, rowIdx) =>
      row.map((day) => <Day key={day.toISOString()} day={day} rowIdx={rowIdx} />)
    )}
  </div>
);

/* ---------- Day component for Month cells ---------- */
interface DayProps {
  day: Date;
  rowIdx: number;
}

const Day: React.FC<DayProps> = ({ day, rowIdx }) => {
  const [showModal, setShowModal] = useState(false);
  const ctx = useContext(CalendarContext);
  if (!ctx) return null;

  const { monthIndex, year, events } = ctx;
  const today = new Date();

  const isToday =
    day.getDate() === today.getDate() &&
    day.getMonth() === today.getMonth() &&
    day.getFullYear() === today.getFullYear();

  const isCurrentMonth = day.getMonth() === monthIndex && day.getFullYear() === year;
  const isSunday = day.getDay() === 0;
  const weekdayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const weekday = weekdayNames[day.getDay()];

  const dayEvents = events.filter(
    (e) =>
      e.date.getDate() === day.getDate() &&
      e.date.getMonth() === day.getMonth() &&
      e.date.getFullYear() === day.getFullYear()
  );

  return (
    <div
      className={`border border-gray-200 flex flex-col hover:bg-blue-100 ${
        isCurrentMonth ? "bg-white" : "bg-transparent"
      }`}
      onClick={() => setShowModal(true)}
    >
      <header className="flex flex-col items-center">
        {rowIdx === 0 && (
          <div className="bg-gray-400 w-full flex items-center justify-center h-6">
            <p className={`text-xs font-bold ${weekday === "SUN" ? "text-red-800" : ""}`}>
              {weekday}
            </p>
          </div>
        )}
        <p
          className={`text-sm p-1 my-1 text-center ${
            isToday ? "bg-blue-600 text-white rounded-full w-7" : ""
          } ${isSunday ? "text-red-500 font-medium" : ""}`}
        >
          {day.getDate()}
        </p>
      </header>

      <div className="flex flex-col items-start px-1 mb-1">
        {dayEvents.slice(0, 3).map((event) => (
          <span
            key={event.id}
            className="bg-blue-100 text-blue-800 text-xs px-1 rounded truncate w-full"
          >
            {event.title}
          </span>
        ))}
        {dayEvents.length > 3 && (
          <span className="text-xs text-gray-500">+{dayEvents.length - 3} more</span>
        )}
      </div>

      {showModal && <AddEventModal date={day} onClose={() => setShowModal(false)} />}
    </div>
  );
};

/* ---------- Week View ---------- */
const WeekView: React.FC<MonthProps> = ({ month, onDayClick }) => {
  const ctx = useContext(CalendarContext);
  if (!ctx) return null;
  const { events } = ctx;

  const week = month[0] ?? month[month.length - 1] ?? [];
  return (
    <div className="grid grid-cols-7 gap-1">
      {week.map((d) => {
        const todaysEvents = events.filter(
          (ev) =>
            ev.date.getFullYear() === d.getFullYear() &&
            ev.date.getMonth() === d.getMonth() &&
            ev.date.getDate() === d.getDate()
        );

        return (
          <div key={d.toISOString()} className="border rounded p-2 min-h-[120px] relative">
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium">{d.getDate()}</div>
              <button
                onClick={() => onDayClick(d)}
                className="text-xs px-2 py-0.5 border rounded hover:bg-gray-100"
              >
                + Add
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {todaysEvents.map((ev) => (
                <div key={ev.id} className="text-xs border rounded px-2 py-1 bg-blue-100 truncate">
                  {ev.title}
                </div>
              ))}
              {todaysEvents.length === 0 && <div className="text-sm text-gray-400">No events</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------- Day View ---------- */
const DayView: React.FC<{ onDayClick: (d: Date) => void }> = ({ onDayClick }) => {
  const ctx = useContext(CalendarContext);
  if (!ctx) return null;
  const { events } = ctx;

  const today = new Date();
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="flex flex-col h-full overflow-auto relative">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold">{today.toDateString()}</h3>
        <button
          onClick={() => onDayClick(today)}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          + Add Event
        </button>
      </div>

      <div className="border-t border-gray-200 relative">
        {hours.map((h) => (
          <div key={h} className="h-16 border-b border-gray-200 relative">
            <span className="absolute left-0 -top-2 text-xs text-gray-500 w-10 text-right pr-2">
              {h}:00
            </span>
          </div>
        ))}

        {events
          .filter(
            (ev) =>
              ev.date.getFullYear() === today.getFullYear() &&
              ev.date.getMonth() === today.getMonth() &&
              ev.date.getDate() === today.getDate()
          )
          .map((ev) => {
            const startHour = ev.date.getHours();
            const topPosition = startHour * 64;
            return (
              <div
                key={ev.id}
                className="absolute left-12 right-2 px-2 py-1 rounded bg-blue-500 text-white text-sm shadow"
                style={{ top: `${topPosition}px` }}
              >
                {ev.title}
                <div className="text-xs text-white/80">
                  {ev.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

/* ---------- Year View ---------- */
const YearView: React.FC<{ onDayClick: (d: Date) => void }> = ({ onDayClick }) => {
  const today = new Date();
  const year = today.getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="grid grid-cols-3 gap-4 ">
      {months.map((m) => (
        <div key={m} className="border rounded p-2 bg-white">
          <div className="font-medium mb-2 ">
            {new Date(year, m, 1).toLocaleString("default", { month: "long" })}
          </div>
          <MiniMonth month={m} year={year} onClickDate={(d) => onDayClick(d)} />
        </div>
      ))}
    </div>
  );
};

/* ---------- MiniMonth for Year view ---------- */
const MiniMonth: React.FC<{ month: number; year: number; onClickDate: (d: Date) => void }> = ({
  month,
  year,
  onClickDate,
}) => {
  const firstDay = new Date(year, month, 1);
  const firstWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  return (
    <div className="grid grid-cols-7 gap-0 text-xs">
      {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
        <div key={d} className="text-center text-[10px]">
          {d}
        </div>
      ))}
      {cells.map((c, i) => (
        <div key={i} className="border h-6 text-center text-[11px]">
          {c ? (
            <button onClick={() => onClickDate(c)} className="w-full h-full">
              {c.getDate()}
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
};
