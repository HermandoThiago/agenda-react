import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { ChevronRight, ChevronLeft } from '@mui/icons-material';
import { formatMonth, addMonth } from './dateFunctions';
import { useNavigate } from 'react-router-dom';
import { UserMenu } from "./UserMenu";
import React from "react";

interface ICalendarHeader{
    month: string;
}
export const CalendarHeader = React.memo(function (props: ICalendarHeader){
    const { month } = props;
    const navigate = useNavigate();

    return (
        <Box display="flex" alignItems="center" padding="8px 16px">
            <Box flex="1">
                <IconButton aria-label="mês anterior">
                    <ChevronLeft onClick={() => navigate(addMonth(month!, -1))}/>
                </IconButton>
                <IconButton aria-label="proximo mês">
                    <ChevronRight onClick={() => navigate(addMonth(month!, 1))}/>
                </IconButton>
                <Box marginLeft="16px" component="strong">
                    {formatMonth(month!)}
                </Box>
            </Box>
            <UserMenu />
        </Box>
    )
})
 
