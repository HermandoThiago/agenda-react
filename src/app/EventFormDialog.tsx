import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { ICalender, createEvent, updateEvent, deleteEvent } from "./backend";
import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';

interface IEventFormDialogProps{
    event: IEditingEvents | null;
    calendars: ICalender[];
    onCancel: () => void;
    onSave: () => void;
}

export interface IEditingEvents {
    id?: number,
    date: string,
    time?: string,
    desc: string,
    calendarId: number
}

interface IValidationErrors{
    [fields: string]: string;
}

export function EventFormDialog(props: IEventFormDialogProps) {
    const [event, setEvent] = useState<IEditingEvents | null>(props.event);
    const [errors, setErrors] = useState<IValidationErrors>({});

    const inputDate = useRef<HTMLInputElement | null>();
    const inputDesc = useRef<HTMLInputElement | null>();

    useEffect(() => {
        setEvent(props.event);
        setErrors({});
    }, [props.event])

    const validate = (): boolean => {
        if(event){
            const currentErrors: IValidationErrors = {};

            if(!event.date){
                currentErrors["date"] = "A data deve ser preenchida";
                inputDate.current?.focus();
            }

            if(!event.desc){
                currentErrors["desc"] = "A descrição deve ser preenchida";
                inputDesc.current?.focus();
            }

            setErrors(currentErrors);
            return Object.keys(currentErrors).length === 0;
        }
        return false;
    }

    const save = (e: React.FormEvent) => {   
        e.preventDefault();

        if(event){
            if(validate()){
                if(isNew){
                    createEvent(event).then(props.onSave)
                }else{
                    updateEvent(event).then(props.onSave)
                }
            }
        }

        console.log("save")
    }

    const deleteEventClick = () => {   
        if(event){
            deleteEvent(event.id!).then(props.onSave)
        }
    }

    const isNew = !event?.id;

    return (
    <div>
      <Dialog open={!!event} onClose={props.onCancel}>
        <form onSubmit={save}>
            <DialogTitle>{isNew ? "Criar evento" : "Editar evento"}</DialogTitle>
            <DialogContent>
                {event && (
                    <>
            <TextField
                inputRef={inputDate}
                type="date"
                margin="normal"
                label="Data"
                fullWidth
                error={!!errors.date}
                helperText={errors.date}
                value={event.date}
                onChange={(e) => setEvent({...event, date: e.target.value})}
            />
            <TextField
                inputRef={inputDesc}
                margin="normal"
                label="Descrição"
                fullWidth
                autoFocus
                error={!!errors.desc}
                helperText={errors.desc}
                value={event.desc}
                onChange={(e) => setEvent({...event, desc: e.target.value})}
            />
            <TextField
                type="time"
                margin="normal"
                label="Hora"
                fullWidth
                value={event.time ?? ""}
                onChange={(e) => setEvent({...event, time: e.target.value})}
            />
            <FormControl margin="normal" fullWidth>
                <InputLabel id="select-calendar">Agenda</InputLabel>
                <Select
                    labelId="select-calendar"
                    value={event.calendarId}
                    onChange={(e) => setEvent({...event, calendarId: e.target.value as number})}
                >
                    {props.calendars.map(calendar => <MenuItem key={calendar.id} value={calendar.id}>{calendar.name}</MenuItem>)}
                </Select>
            </FormControl>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                {!isNew && (
                    <Button type="button" onClick={deleteEventClick}>Excluir</Button>
                )}
                <Box flex="1"></Box>
                <Button type="button" onClick={props.onCancel}>Cancelar</Button>
                <Button type="submit" color="primary">Salvar</Button>
            </DialogActions>
        </form>
        
      </Dialog>
    </div>
  );
}