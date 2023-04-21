import {KIT_DAY_TIME_REGEX, KIT_UID_REGEX, KIT_GGUID_GROUP_REGEX} from "./consts";
import {KIT_ENDPOINT_EVENT_TYPES_MAP, KITEvent, KITEventOccurrence, KITEventType, KITRoom} from "./types";
import * as util from "./util/util";


interface RawEventDataItem {
    event_element: Element;
    event_occurrences: Element[];
}

interface ParserArgs {
    target_time?: string;
    target_room_id?: string;
}

/**
 * The KIT events parser. Parses raw HTML from the KIT CMS and returns KIT events.
 */
export class Parser {
    private readonly raw_html: string;
    private readonly target_time?: string;
    private readonly target_room_id?: string;
    private readonly target_day: Date;
    private room_cache: { [id: string]: KITRoom } = {};

    private get target_day_short_handle(): string {
        return this.target_day.toLocaleDateString("de-DE", {weekday: "short"});
    }

    private get target_date_formatted(): string {
        return util.format_date(this.target_day, "#DD#.#MM#.#YYYY#");
    }

    constructor(raw_html: string, target_day: Date, args: ParserArgs = {}) {
        const {target_time, target_room_id} = args;
        this.raw_html = raw_html;
        this.target_day = target_day;
        this.target_time = target_time;
        this.target_room_id = target_room_id;
    }

    private get_or_create_room = (room_id: string, room_name: string): KITRoom => {
        if (this.room_cache[room_id] === undefined) {
            this.room_cache[room_id] = new KITRoom(room_id, room_name);
        }

        return this.room_cache[room_id];
    }

    public get_raw_event_items = (doc: Document): RawEventDataItem[] => {
        const event_list_element = doc.querySelector("#EVENTLIST");

        if (event_list_element === null) {
            return [];
        }

        const tr_items = [...event_list_element.querySelectorAll("tr")];
        const event_elements: RawEventDataItem[] = [];
        let event_times = [];
        for (const child of tr_items) {
            if (KIT_UID_REGEX.test(child.id)) {
                event_times = []
                event_elements.push({
                    event_element: child,
                    event_occurrences: event_times
                });
            } else {
                event_times.push(child);
            }
        }

        return event_elements;
    }

    private get_type_from_string = (type: string): KITEventType => {
        return KIT_ENDPOINT_EVENT_TYPES_MAP[type.toLowerCase()] ?? KITEventType.Sonstiges;
    }


    private get_event_occurrences_by_elements = (event_occurrences_elements: Element[]): KITEventOccurrence[] => {
        const occurrences: KITEventOccurrence[] = [];
        for (const element of event_occurrences_elements) {
            if (element.children.length !== 2) continue;
            const inner_element = element.children[1];

            const date_element = inner_element.querySelector(".date");
            const room_element = inner_element.querySelector(".room");

            let room: KITRoom | null = null;

            if (date_element === null) continue;

            const day_time = date_element.textContent;
            const match = day_time.match(KIT_DAY_TIME_REGEX);
            if (match == null) continue;

            if(room_element !== null){
                const room_name = room_element?.textContent;
                const room_gguid_match = room_element.getAttribute("href")?.match(KIT_GGUID_GROUP_REGEX);
                const room_id = room_gguid_match ? room_gguid_match[1] : room_name;
                room = this.get_or_create_room(room_id, room_name);
            }


            const [, week_day, , date, time] = match;



            // if(room === null && plain_room_name != undefined){
            //     console.log(plain_room_name)
            //     room = this.get_or_create_room(plain_room_name, plain_room_name);
            // }

            const occurrence = new KITEventOccurrence(
                room,
                time,
                week_day,
                date
            )

            occurrences.push(occurrence);
        }

        return occurrences;
    }


    private get_event_from_raw_event_data = (event: RawEventDataItem): KITEvent | null => {
        const REQUIRED_CHILDREN = 9;
        const {event_element, event_occurrences} = event;

        const id = event_element.id;
        const children = [...event_element.children];

        if (children.length !== REQUIRED_CHILDREN) {
            // Not a valid event
            return null;
        }

        const [, , title, lecturer, , typeShort, format, ,] = children;

        return new KITEvent(
            id,
            title.textContent,
            this.get_type_from_string(typeShort.textContent),
            lecturer.textContent,
            format.textContent,
            this.get_event_occurrences_by_elements(event_occurrences)
        )
    }

    private get_all_events_from_raw_data_items = (event: RawEventDataItem[]): KITEvent[] => {
        return event.map((event) => this.get_event_from_raw_event_data(event)).filter((event) => event !== null);
    }


    /**
     * Returns all events from the parsed HTML. This may include events that do not have a room.
     */
    public get_all_events = (): KITEvent[] => {
        const doc = this.parse();
        const raw_events = this.get_raw_event_items(doc);
        return this.get_all_events_from_raw_data_items(raw_events);
    }

    // public get_all_events_with_day = (day: Date): KITEvent[] => {
    //     const events = this.get_all_events();
    //     const day_short_hand = day.toLocaleDateString("de-DE", {weekday: "short"});
    // }


    /**
     * Returns all events from the parsed HTML that have a room.
     */
    // public get_all_events_with_valid_room = (): KITEvent[] => {
    //     return this.get_all_events().filter((event) => event.room !== null);
    // }

    private parse = () => {
        const parser = new DOMParser();
        return parser.parseFromString(this.raw_html, "text/html");
    }
}
