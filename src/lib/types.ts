import {DATE_FORMAT, KIT_CMS_BASE_EVENT_URL, KIT_CMS_BASE_ROOM_URL, KIT_UID_REGEX} from "./consts";
import {format_date} from "./util/util";

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
    Vorlesung= "v",
    VorlesungUebung = "vue",
    Tutorium = "tu",
    Uebung = "ue",
    Praktikum = "p",
    Block = "b",
    Exkursion = "exk",
    Hauptseminar = "hs",
    Kolloquium = "kol",
    Pruefung = "pue",
    Oberseminar = "os",
    Projekt = "pro",
    Proseminar = "ps",
    Sprechstunde = "sprechst",
    Tagesworkshop = "tw",
    Sonstiges = "sonst",
}

/**
 * The KIT event type map used to convert the event type from the KIT endpoint to the KITEventType enum.
 */
export const KIT_ENDPOINT_EVENT_TYPES_MAP = {
    "v": KITEventType.Vorlesung,
    "vü": KITEventType.VorlesungUebung,
    "tu": KITEventType.Tutorium,
    "ü": KITEventType.Uebung,
    "p": KITEventType.Praktikum,
    "b": KITEventType.Block,
    "exk": KITEventType.Exkursion,
    "hs": KITEventType.Hauptseminar,
    "kol": KITEventType.Kolloquium,
    "pü": KITEventType.Pruefung,
    "os": KITEventType.Oberseminar,
    "pro": KITEventType.Projekt,
    "ps": KITEventType.Proseminar,
    "sonst.": KITEventType.Sonstiges,
    "sprechst.": KITEventType.Sprechstunde,
    "tw": KITEventType.Tagesworkshop,
}

export const KIT_EVENT_TYPES_LOCALIZATION = {}
KIT_EVENT_TYPES_LOCALIZATION[KITEventType.Vorlesung] = "Vorlesung";
KIT_EVENT_TYPES_LOCALIZATION[KITEventType.VorlesungUebung] = "Vorlesung / Übung";
KIT_EVENT_TYPES_LOCALIZATION[KITEventType.Uebung] = "Übung";
KIT_EVENT_TYPES_LOCALIZATION[KITEventType.Tutorium] = "Tutorium";
KIT_EVENT_TYPES_LOCALIZATION[KITEventType.Praktikum] = "Praktikum";
KIT_EVENT_TYPES_LOCALIZATION[KITEventType.Block] = "Block";
KIT_EVENT_TYPES_LOCALIZATION[KITEventType.Exkursion] = "Exkursion";
KIT_EVENT_TYPES_LOCALIZATION[KITEventType.Hauptseminar] = "Hauptseminar";
KIT_EVENT_TYPES_LOCALIZATION[KITEventType.Kolloquium] = "Kolloquium";
KIT_EVENT_TYPES_LOCALIZATION[KITEventType.Pruefung] = "Prüfung";
KIT_EVENT_TYPES_LOCALIZATION[KITEventType.Oberseminar] = "Oberseminar";
KIT_EVENT_TYPES_LOCALIZATION[KITEventType.Projekt] = "Projekt";
KIT_EVENT_TYPES_LOCALIZATION[KITEventType.Proseminar] = "Proseminar";
KIT_EVENT_TYPES_LOCALIZATION[KITEventType.Sonstiges] = "Sonstiges";
KIT_EVENT_TYPES_LOCALIZATION[KITEventType.Sprechstunde] = "Sprechstunde";
KIT_EVENT_TYPES_LOCALIZATION[KITEventType.Tagesworkshop] = "Tagesworkshop";


/**
 * A room of the KIT, containing the id and name and link to the KIT CMS.
 */
export class KITRoom {
    id: string;
    name: string;

    private static readonly BUILDING_PREFIX = "Geb.";

    /**
     * The link to the KIT CMS room, generated from the id.
     */
    public get link(): string {
        if (KIT_UID_REGEX.test(this.id)) {
            return `${KIT_CMS_BASE_ROOM_URL}${this.id}`;
        }
        let search_term = this.name;
        if (this.name.startsWith(KITRoom.BUILDING_PREFIX)) {
            search_term = this.name.substring(KITRoom.BUILDING_PREFIX.length);
        }

        return `https://campus.studium.kit.edu/search.php#!campus/all/search.asp?searchterm=${search_term}&searchtype=room`;
    }

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;

    }
}

export class KITEventOccurrence {
    date?: string;
    week_day: string;
    time_span: string;
    room?: KITRoom;

    constructor(room: KITRoom, time_span: string, week_day: string, date?: string) {
        this.room = room;
        this.time_span = time_span;
        this.week_day = week_day;
        this.date = date;
    }

    /**
     * Returns true if the occurrence matches the given config (day, time, date).
     * @param config The config to match against.
     */
    public matches(config: KITEventsConfig): boolean {
        const config_week_day_short = config.day.toLocaleDateString("de-DE", {weekday: "short"});
        const config_date_formatted = format_date(config.day, DATE_FORMAT)
        return this.week_day == config_week_day_short && this.time_span.startsWith(config.time) && (this.date == null || this.date == config_date_formatted);
    }
}

/**
 * A KIT event has a title, type and occurrences. Each occurrence has a date, time and room.
 */
export class KITEvent {

    id: string;
    title: string;
    type: KITEventType;
    lecturer: string;
    format: string;
    occurrences: KITEventOccurrence[];

    /**
     * The link to the KIT CMS event, generated from the id.
     */
    public get link(): string {
        return `${KIT_CMS_BASE_EVENT_URL}${this.id}`;
    }

    public get_occurrence_by_time(time: string, date?: string): KITEventOccurrence[] {
        return this.occurrences.filter(occurrence => occurrence.time_span == time && (date || occurrence.date == date))
    }


    constructor(id: string, title: string, type: KITEventType, lecturer: string, format: string, occurrences: KITEventOccurrence[]) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.lecturer = lecturer;
        this.format = format;
        this.occurrences = occurrences;
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

