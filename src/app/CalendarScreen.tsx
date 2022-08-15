import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useCallback, useEffect, useReducer } from 'react';
import { getCalenders, getEvents, ICalender, IEvents } from './backend';
import { useParams } from 'react-router-dom';
import { CalendarsView } from './CalendarsView';
import { CalendarHeader } from './CalendarHeader';
import { Calendar } from "./Calendar";
import { ICalenderCell, IEventWithCalendar } from './Calendar';
import { EventFormDialog } from './EventFormDialog';
import { getToday } from './dateFunctions';
import { useMemo } from 'react';
import { reducer } from './calendarScreenReducer';

function useCalendarScreenState(month: string){
    const [state, dispatch] = useReducer(reducer, {
        calendars: [],
        calendarsSelected: [],
        events: [],
        editEvent: null
    });

    const { events, calendars, calendarsSelected, editEvent } = state;

    const weeks = useMemo(() => {
        return generateCalender(month + "-01", events, calendars, calendarsSelected);
    }, [month, events, calendars, calendarsSelected])

    const firstDate = weeks[0][0].date;
    const lastDate = weeks[weeks.length - 1][6].date;

    useEffect(() => {
        Promise.all([getCalenders(), getEvents(firstDate, lastDate)])
        .then(([calendars, events]) => {
            dispatch({type: "load", payload: { events, calendars }});
        });
    }, [firstDate, lastDate])

    const refreshEvents = () => {
        getEvents(firstDate, lastDate).then((events) => {
            dispatch({type: "load", payload: {events}})
        })
    }

    return {
        weeks, 
        calendars,
        dispatch,
        refreshEvents,
        calendarsSelected,
        editEvent
    }

}

export default function CalendarScreen(){
    const { month } = useParams<{month: string}>();

    const { weeks, calendars, dispatch, refreshEvents, calendarsSelected, editEvent } = useCalendarScreenState(month!);

    const handleClose = useCallback(() => {
        dispatch({type: "closeDialog"})
    }, [])

    return (
        <Box display="flex" height="100%" alignItems="stretch">
            <Box borderRight="1px solid rgb(224, 224, 224)" width="16em" padding="8px 16px">
                <h2>Agenda react</h2>
                <Button onClick={() => dispatch({type: "new", payload: getToday()})} variant="contained" color="primary">
                    Novo evento
                </Button>
                <CalendarsView 
                    calendars={calendars}
                    dispatch={dispatch}
                    calendarsSelected={calendarsSelected}
                />
            </Box>
            <Box flex="1" display="flex" flexDirection="column">
                <CalendarHeader month={month!} />
               <Calendar weeks={weeks} dispatch={dispatch}/>
               <EventFormDialog 
                    event={editEvent} 
                    onCancel={handleClose} 
                    calendars={calendars}
                    onSave={() => {
                        handleClose();
                        refreshEvents();
                    }}
                />
            </Box>
        </Box>
    )
}

function generateCalender(
    date: string, 
    allEvents: IEvents[], 
    calendars: ICalender[],
    calendarsSelected: boolean[]
): ICalenderCell[][]{
    const weeks: ICalenderCell[][] = [];
    const jsDate = new Date(date + "T12:00:00");
    const currentMonth = jsDate.getMonth()

    const currentDay = new Date(jsDate.valueOf());
    currentDay.setDate(1);
    const dayOfWeek = currentDay.getDay();
    currentDay.setDate(1 - dayOfWeek);

    do{
        const week: ICalenderCell[] = [];
        for(let i = 0; i < 7; i++){
            const monthStr = (currentDay.getMonth() + 1).toString().padStart(2, "0")
            const dayStr = currentDay.getDate().toString().padStart(2, "0")
            const isoDate = `${currentDay.getFullYear()}-${monthStr}-${dayStr}`;
            
            const events: IEventWithCalendar[] = [];
            for(const event of allEvents){
                if(event.date === isoDate){
                    const calIndex = calendars.findIndex(cal => cal.id === event.calendarId);
                    if(calendarsSelected[calIndex]){
                        events.push({ ...event, calendar: calendars[calIndex]})
                    }
                }
            }
            week.push({
                dayOfMonth: currentDay.getDate(),
                date: isoDate, 
                events
            });
            currentDay.setDate(currentDay.getDate() + 1);
        }
        weeks.push(week);
    }while(currentDay.getMonth() === currentMonth)

    return weeks;
}


