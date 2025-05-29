import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import IconButton from '@mui/material/IconButton';
import { Box, Button, Typography } from '@mui/material';
import { useContext } from 'react';
import { calendarContext } from './calendarContext';
import dayjs, { Dayjs } from 'dayjs';

const CalendarHeader = () => {

    const context = useContext(calendarContext);
      
      if (!context) {
        // Handle the case when context is null (e.g., return a loading state or error)
        return <div>Loading...</div>;
      }
    
      const { currentMonth, setCurrentMonth } = context;

    // const handleClick = (value:number) =>{
    //     setCurrentMonth((prev) => (dayjs(prev).month()+value))
    // }

    const handleClick = (value: number) => {
        setCurrentMonth((prev) => {
            const newMonth = dayjs(prev[0][0]).add(value, 'month'); // Get the first day of the current month and change the month
            return getMonth(newMonth.month());
        });
    };

    function getMonth(month: number = dayjs().month()): Dayjs[][] {
        const year = dayjs().year();
        const firstDayOfMonth = dayjs(new Date(year, month, 1)).day();
        let currentMonthCount: number = 0 - firstDayOfMonth;
        const daysMatrix = new Array(6).fill([]).map(() => {
            return new Array(7).fill(null).map(() => {
                currentMonthCount++;
                return dayjs(new Date(year, month, currentMonthCount));
            });
        });
        return daysMatrix;
    }

  return (
    <header className='px-4 py-2 flex items-center gap-2'>
      <img src='https://static.vecteezy.com/system/resources/previews/022/613/030/original/google-calendar-icon-logo-symbol-free-png.png' className='h-10'/>
      <Typography variant="h4" component="h2">Calendar</Typography>
      <Button className="border rounded py-2 px-4 mx-5" size="large">Today</Button>
      <Box>
        <span className='material-icons-outlined cursor-pointer text-gray-600 mx-2'>
        <IconButton aria-label="previous" onClick={()=>{handleClick(-1)}}><ChevronLeftOutlinedIcon/></IconButton>
        </span>
      </Box>
      <button>
        <span className='material-icons-outlined cursor-pointer text-gray-600 mx-2'>
        <IconButton aria-label="next" onClick={()=>{handleClick(1)}}><ChevronRightOutlinedIcon/></IconButton>
            
        </span>
      </button>
      <Box><h2>
          {new Date(currentMonth[0][0]).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2></Box>
    </header>
  )
}

export default CalendarHeader
