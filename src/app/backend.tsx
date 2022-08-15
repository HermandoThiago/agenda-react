export interface ICalender {
    id: number,
    name: string,
    color: string
}

export interface IEditingEvents {
    id?: number,
    date: string,
    time?: string,
    desc: string,
    calendarId: number
}

export interface IEvents extends IEditingEvents {
    id: number;
}

export interface IUser {
    name: string;
    email: string;
}

export const getCalenders = (): Promise<ICalender[]> => {
return fetch("http://localhost:8080/calendars", {
    credentials: "include",
})
    .then(handleResponse);
}

export const getEvents = (from: string, to: string): Promise<IEvents[]> => {
    return fetch(`http://localhost:8080/events?date_gt=${from}&date_lte=${to}&_sort=date,time`, {
        credentials: "include",
    })
        .then(handleResponse);
}

export const createEvent = (event: IEditingEvents): Promise<IEvents> => {
    return fetch(`http://localhost:8080/events`, {
        credentials: "include",
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(event)
    }).then(handleResponse)
}

export const updateEvent = (event: IEditingEvents): Promise<IEvents> => {
    return fetch(`http://localhost:8080/events/${event.id}`, {
        credentials: "include",
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(event)
    }).then(handleResponse)
}

export const deleteEvent = (eventId: number): Promise<void> => {
    return fetch(`http://localhost:8080/events/${eventId}`, {
        method: "DELETE",
        credentials: "include",
    }).then(handleResponse)
}

export const getUser = (): Promise<IUser> => {
    return fetch(`http://localhost:8080/auth/user`, {
        credentials: "include",
    })
    .then(handleResponse)
}

export const signInEndpoint = (email: string, password: string): Promise<IUser> => {
    return fetch(`http://localhost:8080/auth/login`, {
        credentials: "include",
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email, password})
    })
    .then(handleResponse)
}

export const signOutEndpoint = (): Promise<IUser> => {
    return fetch(`http://localhost:8080/auth/logout`, {
        credentials: "include",
        method: "POST",
    })
    .then(handleResponse)
}

export const handleResponse = (resp: Response) => {
    if(resp.ok){
        return resp.json();
    }else{
        throw new Error(resp.statusText)
    }
} 
