import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState } from 'react'
import "./calendar.css"
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';


const locales = {
  'en-US': enUS,
}

interface Event {
  title: string;
  start: Date;
  end: Date;
}

// Sample events for the calendar
const events: Event[] = [
  {
    title: 'Meeting with Bob',
    start: new Date(2025, 2, 16, 10, 0), // March 16, 2025, 10:00 AM
    end: new Date(2025, 2, 16, 12, 0),   // March 16, 2025, 12:00 PM
  },
  {
    title: 'Lunch Break',
    start: new Date(2025, 2, 17, 13, 0), // March 17, 2025, 1:00 PM
    end: new Date(2025, 2, 17, 14, 0),   // March 17, 2025, 2:00 PM
  },
];

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const Caalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const handleSelect = (event: Event) => alert(`You clicked on: ${event.title}`)
  return (
    <div>
      <Calendar 
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, width:"80%", margin:"50px 50px 50px auto" }}
        step={30}
        defaultView="month"
        views={['month', 'week', 'day']}
        date={currentDate}
        onNavigate={setCurrentDate}
        onSelectEvent={handleSelect}
        onSelectSlot={(slotInfo: { start: Date; end: Date }) => console.log(slotInfo)}
        components={{
          toolbar: ({ label, onNavigate }) => (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
              <button onClick={() => onNavigate('PREV')}>
                <ChevronLeftOutlinedIcon size={20} /> {/* Back button with React Icon */}
              </button>
              <button onClick={() => onNavigate('NEXT')}>
                <ChevronRightOutlinedIcon size={20} /> {/* Next button with React Icon */}
              </button>
              </div>
              <span>{label}</span> {/* Month label */}
              
            </div>
          ),
           // Customize how events are displayed
        event: ({ event }) => (
          <div style={{ backgroundColor: '#f0f0f0', padding: '5px', borderRadius: '5px' }}>
            <strong>{event.title}</strong>
            <p>{event.desc}</p>
          </div>
        ),

        // Customize how each day cell in the month view is displayed
        dateCellWrapper: ({ children, value }) => (
          <div style={{ position: 'relative', height: '100%' }}>
            {children}
            {value.getDay() === 0 && (
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: 'red',
                color: 'white',
                padding: '3px',
                fontSize: '12px'
              }}>
                Sun
              </div>
            )}
          </div>
        ),

        // Customize how time slots appear in the Day and Week views
        timeSlotWrapper: ({ children, value }) => (
          <div style={{ position: 'relative', padding: '2px' }}>
            {children}
            {value.getHours() < 9 && (
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: 'lightgreen',
                padding: '5px',
                fontSize: '10px'
              }}>
                Early Slot
              </div>
            )}
          </div>
        )
        }}
      />
    </div>
  )

}

export default Caalendar;


<div className="toolbar">
  <span className="buttongroup">
    <button>today</button>
    <button>back</button>
    <button>next</button>
  </span>
  <span className="toolbar-label"></span>
  <span className="buttongroup">
    <button>month</button>
    <button>week</button>
    <button>day</button>
  </span>
</div>