import dayjs, { Dayjs } from "dayjs";
import { createContext, ReactNode, useState } from "react";


interface CalendarContextType {
    currentMonth: Dayjs[][];
    setCurrentMonth: React.Dispatch<React.SetStateAction<Dayjs[][]>>;
}

export const calendarContext = createContext<CalendarContextType|null>(null)

const ContextOfCalendar = ({children}:{children : ReactNode}) =>{

    function getMonth(month: number = dayjs().month()): Dayjs[][] {
        const year = dayjs().year()
        const firstDayOfMonth = dayjs(new Date(year, month, 1)).day()
        let currentMonthCount: number = 0 - firstDayOfMonth
        const daysMatrix = new Array(6).fill([]).map(() => {
          return new Array(7).fill(null).map(() => {
            currentMonthCount++
            return dayjs(new Date(year, month, currentMonthCount))
          })
        })
        return daysMatrix
      }

    const [currentMonth, setCurrentMonth] = useState<Dayjs[][]>(getMonth())
    
    return(
        <calendarContext.Provider value = {{currentMonth, setCurrentMonth}}>
            {children}
        </calendarContext.Provider>
    )
}

export default ContextOfCalendar