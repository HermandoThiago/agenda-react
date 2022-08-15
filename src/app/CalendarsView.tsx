import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { ICalender} from './backend';
import React from "react";
import { ICalendarScreenAction } from './calendarScreenReducer';

interface ICalenderViewprops{
    calendars: ICalender[], 
    dispatch: React.Dispatch<ICalendarScreenAction>, 
    calendarsSelected: boolean[] 
}

export const CalendarsView = React.memo(function(props: ICalenderViewprops){
    const { calendars, calendarsSelected } = props;
    return (
        <Box marginTop="64px">
            <h3>Agendas</h3>
            {calendars.map((calendar, i) => (
                <div key={calendar.id}>
                    <FormControlLabel
                        key={calendar.id} 
                        control={<Checkbox style={{color: calendar.color}} checked={calendarsSelected[i]} />} 
                        label={calendar.name}
                        onChange={() => props.dispatch({type: "toggleCalendar", payload: i})}
                    />
                </div>
            ))}
        </Box> 
    )
})
