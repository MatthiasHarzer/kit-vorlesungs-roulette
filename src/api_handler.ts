import {PUBLIC_KIT_API_KEY} from "./creds";

const BASE_URL = `https://api.taptwice.dev/kit/events?key=${PUBLIC_KIT_API_KEY}`;

export const VALID_TIMES = [
    "08:00",
    "09:45",
    "11:30",
    "14:00",
    "15:45",
    "17:30",
]

export interface KITEvent {
    id: string,
    title: string,
    type: string,
    lecturer: string,
    format: string,
    link: string,
    time: string,
    room: string,
    room_link: string,
}

const build_url = (day: string, time: string) => {
    return `${BASE_URL}&day=${day}&time=${time}`;
}

export const get_events = async(day: string, time: string): Promise<KITEvent[]> =>{

    const url = build_url(day, time);

    const response = await fetch(url);
    const data = await response.json();

    // console.log(data);

    return data.events;
}
