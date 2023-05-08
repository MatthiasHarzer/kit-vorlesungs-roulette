import {
    KIT_EVENT_DATE_OCCURRENCE_REGEX,
    KIT_EVENT_FIXED_DATE_REGEX,
    KIT_EVENT_ONLY_EVERY_SECOND_WEEK_LABEL,
    KIT_GGUID_GROUP_REGEX,
    KIT_UID_REGEX
} from "./consts";
import {KIT_ENDPOINT_EVENT_TYPES_MAP, KITEvent, KITEventOccurrence, KITEventType, KITRoom} from "./types";


interface RawEventDataItem {
    event_element: Element;
    event_occurrences: Element[];
}

/**
 * The KIT events parser. Parses raw HTML from the KIT CMS and returns KIT events.
 */
export class Parser {
    private readonly raw_html: string;
    private room_cache: { [id: string]: KITRoom } = {};


    constructor(raw_html: string) {
        this.raw_html = raw_html;
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
            const time_element = inner_element.querySelector(".time");
            const room_element = inner_element.querySelector(".room");
            const comment_element = inner_element.querySelector(".comment");

            let room: KITRoom | null = null;

            const date_occurrence_match = date_element?.textContent?.match(KIT_EVENT_DATE_OCCURRENCE_REGEX);

            if (date_occurrence_match === null || time_element === null) continue;

            const [, week_day, event_occurrence] = date_occurrence_match;
            const date = event_occurrence.match(KIT_EVENT_FIXED_DATE_REGEX) ? event_occurrence : null;


            if (room_element !== null) {
                const room_name = room_element?.textContent;
                const room_gguid_match = room_element.getAttribute("href")?.match(KIT_GGUID_GROUP_REGEX);
                const room_id = room_gguid_match ? room_gguid_match[1] : room_name;
                room = this.get_or_create_room(room_id, room_name);
            }

            const occurrence = new KITEventOccurrence(
                room,
                time_element?.textContent,
                week_day,
                date,
                event_occurrence === KIT_EVENT_ONLY_EVERY_SECOND_WEEK_LABEL,
                comment_element?.textContent
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

        const [, , title, , lecturer, , typeShort, , format] = children;

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
        return this.get_all_events_from_raw_data_items(raw_events).filter((event) => event.occurrences.length > 0);
    }


    private parse = (): Document => {
        const parser = new DOMParser();
        return parser.parseFromString(this.raw_html, "text/html");
    }
}
