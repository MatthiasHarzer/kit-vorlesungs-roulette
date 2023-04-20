import {KIT_EVENT_REGEX, KIT_GGUID_GROUP_REGEX} from "./consts";
import {KITEvent, KITRoom, KIT_EVENT_TYPES_MAP, KITEventType} from "./types";


interface RawEventDataItem {
    event_element: Element;
    event_occurrences: Element[];
}

/**
 * The KIT events parser. Parses raw HTML from the KIT CMS and returns KIT events.
 */
export class Parser {
    private readonly raw_html: string;
    private readonly target_time: string;
    private target_day: Date;

    constructor(raw_html: string, target_day: Date, target_time: string) {
        this.raw_html = raw_html;
        this.target_day = target_day;
        this.target_time = target_time;

    }

    public get_raw_event_items = (doc: Document): RawEventDataItem[] => {
        const event_list_element = doc.querySelector("#EVENTLIST");
        const tr_items = [...event_list_element.querySelectorAll("tr")];
        const event_elements: RawEventDataItem[] = [];
        let event_times = [];
        for (const child of tr_items) {
            if (KIT_EVENT_REGEX.test(child.id)) {
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
        return KIT_EVENT_TYPES_MAP[type.toLowerCase()] ?? KITEventType.Sonstiges;
    }

    private get_room_from_event_occurrences_elements = (event_occurrences_elements: Element[]): KITRoom | null => {
        for (const element of event_occurrences_elements) {
            if (element.children.length !== 2) continue;
            const inner_element = element.children[1];

            const date_element = inner_element.querySelector(".date");
            const room_element = inner_element.querySelector("a.room");

            if (date_element === null || room_element === null) continue;

            const date = date_element.textContent;
            const room_name = room_element.textContent;
            const room_gguid_match = room_element.getAttribute("href").match(KIT_GGUID_GROUP_REGEX);
            const room_id = room_gguid_match[1];


            if (date.includes(this.target_time)) {
                return new KITRoom(room_id, room_name);
            }
        }

        return null;
    }

    private get_event_from_raw_event_data = (event: RawEventDataItem): KITEvent | null => {
        const REQUIRED_CHILDREN = 9;

        const {event_element, event_occurrences} = event;

        const id = event_element.id;
        const children = [...event_element.children];
        const room = this.get_room_from_event_occurrences_elements(event_occurrences);

        if (children.length !== REQUIRED_CHILDREN) {
            return null;
        }

        const [
            _,
            lvlNumber,
            title,
            lecturer,
            type,
            typeShort,
            format,
            formatShort,
            __
        ] = children;

        return new KITEvent(
            id,
            title.textContent,
            this.get_type_from_string(typeShort.textContent),
            lecturer.textContent,
            format.textContent,
            this.target_time,
            room
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

    /**
     * Returns all events from the parsed HTML that have a room.
     */
    public get_all_events_with_valid_room = (): KITEvent[] => {
        return this.get_all_events().filter((event) => event.room !== null);
    }

    private parse = () => {
        const parser = new DOMParser();
        return parser.parseFromString(this.raw_html, "text/html");
    }
}
