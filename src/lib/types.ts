import {KIT_CMS_BASE_EVENT_URL, KIT_CMS_BASE_ROOM_URL} from "./consts";

/**
 * The body for the cors proxy server request.
 * @see https://github.com/MatthiasHarzer/minimal-cors-server
 */
export interface CorsProxyBody {
    method: "POST" | "GET" | "PUT" | "DELETE";
    url: string;
    headers?: object;
    body?: string;
    data?: object;
    cache?: boolean;
}

/**
 * The KIT event type.
 */
export enum KITEventType {
    Vorlesung = "Vorlesung",
    VorlesungUebung = "Vorlesung / Übung",
    Tutorium = "Tutorium",
    Uebung = "Übung",
    Praktikum = "Praktikum",
    Block = "Block",
    Exkursion = "Exkursion",
    Hauptseminar = "Hauptseminar",
    Kolloquium = "Kolloquium",
    Pruefung = "Prüfung",
    Oberseminar = "Oberseminar",
    Projekt = "Projekt",
    Proseminar = "Proseminar",
    Sprechstunde = "Sprechstunde",
    Tagesworkshop = "Tagesworkshop",
    Sonstiges = "Sonstiges",
}

/**
 * The KIT event type map used to convert the event type from the KIT endpoint to the KITEventType enum.
 */
export const KIT_EVENT_TYPES_MAP = {
    "v": KITEventType.Vorlesung,
    "vü": KITEventType.VorlesungUebung,
    "tu": KITEventType.Tutorium,
    "ü": KITEventType.Uebung,
    "p": KITEventType.Praktikum,

    "b": KITEventType.Block,
    "exk": KITEventType.Exkursion,
    "hs": KITEventType.Hauptseminar,
    "kol": KITEventType.Kolloquium,
    "pr": KITEventType.Pruefung,
    "os": KITEventType.Oberseminar,
    "pro": KITEventType.Projekt,
    "ps": KITEventType.Proseminar,
    "sonst.": KITEventType.Sonstiges,
    "sprechst.": KITEventType.Sprechstunde,
    "tw": KITEventType.Tagesworkshop,

}

/**
 * A room of the KIT, containing the id and name and link to the KIT CMS.
 */
export class KITRoom {
    id: string;
    name: string;

    /**
     * The link to the KIT CMS room, generated from the id.
     */
    public get link(): string {
        return `${KIT_CMS_BASE_ROOM_URL}${this.id}`;
    }

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;

    }
}

/**
 * A KIT event, containing the id, title, type, lecturer, format, time, room and link to the KIT CMS.
 */
export class KITEvent {

    id: string;
    title: string;
    type: KITEventType;
    lecturer: string;
    format: string;
    time: string;
    room: KITRoom;

    /**
     * The link to the KIT CMS event, generated from the id.
     */
    public get link(): string {
        return `${KIT_CMS_BASE_EVENT_URL}${this.id}`;
    }

    constructor(id: string, title: string, type: KITEventType, lecturer: string, format: string, time: string, room: KITRoom) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.lecturer = lecturer;
        this.format = format;
        this.time = time;
        this.room = room;
    }
}

/**
 * The KIT events config, containing the day, time and types. Used to filter the events.
 */
export interface KITEventsConfig {
    day: Date,
    time: string,
    types: KITEventType[],
}

/**
 * The start and end time of a KIT event.
 */
export const END_TIMES = {
    "08:00": "09:30",
    "09:45": "11:15",
    "11:30": "13:00",
    "14:00": "15:30",
    "15:45": "17:15",
    "17:30": "19:00",
}
export const VALID_TIMES = Object.keys(END_TIMES);

