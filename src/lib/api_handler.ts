import {format_date} from "./Util/util";
import type {KITEvent, KITEventsConfig} from "./types";

const BASE_URL = `https://api.taptwice.dev/kit/events?key=${import.meta.env.VITE_PUBLIC_KIT_API_KEY}`;

export const VALID_TIMES = [
    "08:00",
    "09:45",
    "11:30",
    "14:00",
    "15:45",
    "17:30",
]

export const EVENT_TYPES = {
    "v": "Vorlesung",
    "vü": "Vorlesung / Übung",
    "tu": "Tutorium",
    "ü": "Übung",
    "p": "Praktikum",
    "b": "Block",
    "exk": "Exkursion",
    "hs": "Hauptseminar",
    "kol": "Kolloquium",
    "pr": "Prüfung",
    "os": "Oberseminar",
    "pro": "Projekt",
    "ps": "Proseminar",
    "sonst.": "Sonstiges",
    "sprechst.": "Sprechstunde",
    "tw": "Tagesworkshop",
}

const build_url = (config: KITEventsConfig) => {
    const {day, time, types} = config;
    let url = `${BASE_URL}&day=${format_date(day,  "#DD#.#MM#.#YYYY#")}&time=${time}`;
    if(types !== null && types.length > 0){
        url += `&type=${types.join(",")}`;
    }
    return url;
}

export const get_events = async(config: KITEventsConfig): Promise<KITEvent[]> =>{



    const url = build_url(config);

    const response = await fetch(url);
    const data = await response.json();

    // console.log(data);

    return data.events;
}
