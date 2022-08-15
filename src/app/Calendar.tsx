import { makeStyles } from '@material-ui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { IEvents, ICalender } from "./backend";
import React from 'react';
import { getToday } from './dateFunctions';
import { ICalendarScreenAction } from './calendarScreenReducer';

const DAYS_OF_WEEK = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

const useStyles = makeStyles({
    table: {
        borderTop: "1px solid rgb(224, 224, 224)",
        minHeight: "100%",
        tableLayout: "fixed",
        "& td ~ td, & th ~ th": {
            borderLeft: "1px solid rgb(224, 224, 224)"
        },
        "& td": {
            verticalAlign: "top",
            overflow: "hidden",
            padding: "8px 4px"
        }
    },
    dayOfMonth: {
        display: "inline-block",
        width: "24px",
        lineHeight: "24px",
        fontWeight: 500,
        marginBottom: "4px",
        borderRadius: "50%",
        "&.today": {
            backgroundColor: "#3f51b5",
            color: "white",
        }
    },
    event: {
        display: "flex",
        alignItems: "center",
        background: "none",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
        whiteSpace: "nowrap",
        marginBottom: "4px 0"
    },
    eventBackground: {
        display: "inline-block",
        color: "white",
        padding: "2px",
        borderRadius: "4px"
    }
})

interface IcalendarProps{
    weeks: ICalenderCell[][];
    dispatch: React.Dispatch<ICalendarScreenAction>
}

export const Calendar = React.memo(function (props: IcalendarProps){
    const { weeks } = props;
    const classes = useStyles();

    const handleClick = (e: React.MouseEvent, date: string): void => {
        if(e.target === e.currentTarget){
            props.dispatch({type: "new", payload: date});
        }
    }

    return (
        <TableContainer style={{flex: 1}} component={"div"}>
            <Table className={classes.table} aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        {DAYS_OF_WEEK.map((day) => (
                            <TableCell align="center" key={day}>
                                {day}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {weeks.map((week, i) => (
                        <TableRow key={i}>
                            {week.map((cell) => (
                                <TableCell align="center" key={cell.date} onClick={(me) => handleClick(me, cell.date)}>
                                    <div className={classes.dayOfMonth + (cell.date === getToday() ? " today" : "")}>
                                        {cell.dayOfMonth}
                                    </div>
                                    {cell.events.map((event) => {
                                        const color = event.calendar.color;
                                        return (
                                            <button 
                                                key={event.id} 
                                                className={classes.event} 
                                                onClick={() => props.dispatch({type: "edit", payload: event})}
                                            >
                                                {event.time && (
                                                    <>
                                                        <AccessTimeIcon style={{color: color}} fontSize="inherit"/>
                                                        <Box component="span" margin="0 4px">{event.time}</Box>
                                                    </>
                                                )}
                                                {event.time ? <span>{event.desc}</span> : <div className={classes.eventBackground} style={{background: color}}>{event.desc}</div> }
                                                
                                            </button>
                                        )
                                    })}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
})

export type IEventWithCalendar = (IEvents & {calendar: ICalender})

export interface ICalenderCell{
    date: string;
    dayOfMonth: number;
    events: IEventWithCalendar[];
}

