import { ICalender, IEditingEvents, IEvents } from "./backend";

export interface ICalendarScreenState{
    calendars: ICalender[];
    calendarsSelected: boolean[];
    editEvent: IEditingEvents | null;
    events: IEvents[];
}

export type ICalendarScreenAction = {
    type: "load", 
    payload: {
        events: IEvents[],
        calendars?: ICalender[]
    }
} | {
    type: "edit", 
    payload: IEvents
} | {
    type: "closeDialog"
} | {
    type: "new",
    payload: string
}| {
    type: "toggleCalendar",
    payload: number
}

export function reducer(state: ICalendarScreenState, action: ICalendarScreenAction): ICalendarScreenState{
    switch(action.type){
        case "load":
            const calendars = action.payload.calendars ?? state.calendars;
            const selected = action.payload.calendars ? action.payload.calendars.map(() => true) : state.calendarsSelected;
            return {
                ...state, 
                events: action.payload.events, 
                calendars, 
                calendarsSelected: selected,
            };
        case "edit":
            return { ...state, editEvent: action.payload }
        case "new":
            return { ...state, editEvent: {
                date: action.payload, 
                desc: "",
                calendarId: state.calendars[0].id
            }} 
        case "closeDialog":
            return { ...state, editEvent: null}
        case "toggleCalendar":
            const calendarsSelected = [...state.calendarsSelected]
            calendarsSelected[action.payload] = !calendarsSelected[action.payload]; 
            return { ...state, calendarsSelected}
        default:
            return state;
    }
}