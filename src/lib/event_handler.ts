import { format_date, json_to_encoded_form_data } from "./util/util";
import type {
    KITEvent,
    KITExtendedSearchFormData,
    KITRoomEventsConfig,
    KITTimeEventsConfig,
    RawRoom,
    RawTerm,
    RequestParams,
    Term,
} from "./types";
import { END_TIMES, KITRoom } from "./types";
import { Parser } from "./parser";
import {
    EXTENDED_SEARCH_BASE_URL,
    CORS_PROXY_SERVER,
    ROOMS_QUICK_SEARCH_URL,
    TERMS_URL,
} from "./consts";

const DEFAULT_FORM_DATA: KITExtendedSearchFormData = {
    search: "Suchen",
    tguid: "", // This gets replaced by the correct term id
    appointmentdate: "",
    appointmenttimestart: "",
    appointmenttimeend: "",
    pagesize: 500,
    room: "{}",
};

let current_room_fetch_id = 0;

const i_promise_terms = new Promise<Term[]>((resolve, reject) => {
    make_request(TERMS_URL, {
        max_age: 60 * 60 * 24, // 1 day
    })
        .then((response) => response.json())
        .then((json: { [id: string]: RawTerm }) => {
            const terms = [];
            for (const id in json) {
                const term = json[id];
                terms.push({
                    start: new Date(term.tstart),
                    end: new Date(term.tend),
                    id: id,
                });
            }
            resolve(terms);
        })
        .catch((error) => reject(error));
});

const get_term_id = async (date: Date): Promise<string> => {
    const terms = await i_promise_terms;
    for (const term of terms) {
        if (date >= term.start && date <= term.end) {
            return term.id;
        }
    }
    throw new Error("No term found for the given date.");
};

/**
 * Creates a template for the form data and determines the term id.
 * @param date The date to get the term id for.
 */
const get_form_data_template = async (
    date: Date,
): Promise<KITExtendedSearchFormData> => {
    const json_form_data = { ...DEFAULT_FORM_DATA };
    json_form_data.tguid = await get_term_id(date);
    json_form_data.appointmentdate = format_date(date, "#DD#.#MM#.#YYYY#");
    return json_form_data;
};

/**
 * Makes a request to the cors proxy to avoid CORS issues with the KIT endpoint.
 * @param url The url to make the request to.
 * @param params The parameters for the request.
 * @returns The response.
 *
 * @see https://github.com/MatthiasHarzer/simple-proxy-server
 */
function make_request(
    url: string,
    params: RequestParams = {},
): Promise<Response> {
    const { form_data, headers, max_age } = params;

    const proxy_url = `${CORS_PROXY_SERVER}/cache/max-age:${
        max_age ?? 0
    }/${url}`;

    return fetch(proxy_url, {
        method: "POST",
        headers: {
            ...headers,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: json_to_encoded_form_data(form_data),
    });
}

/**
 * Gets all events from the KIT endpoint matching the config.
 * @param config The config.
 * @returns The events.
 */
export const get_events = async (
    config: KITTimeEventsConfig,
): Promise<KITEvent[]> => {
    const json_form_data = await get_form_data_template(config.day);
    json_form_data.appointmenttimestart = config.time;
    json_form_data.appointmenttimeend = END_TIMES[config.time];

    const response = await make_request(EXTENDED_SEARCH_BASE_URL, {
        form_data: json_form_data,
        max_age: 60 * 60 * 24 * 3, // 3 days
    });
    const text = await response.text();

    const parser = new Parser(text);
    const events = parser.get_all_events().filter((event) => {
        return event.occurrences.some((occ) => occ.matches(config));
    });
    if (config.types.length === 0) return events;
    return events.filter((event) => config.types.includes(event.type));
};

/**
 * Returns all events matching the kit room events config.
 * @param config The config.
 */
export const get_room_events = async (
    config: KITRoomEventsConfig,
): Promise<KITEvent[]> => {
    const json_form_data = await get_form_data_template(config.day);

    const rooms = {};
    for (const room of config.rooms) {
        rooms[room.id] = room.name;
    }

    json_form_data.room = JSON.stringify(rooms);

    const response = await make_request(EXTENDED_SEARCH_BASE_URL, {
        form_data: json_form_data,
        max_age: 60 * 60 * 24 * 3, // 3 days
    });
    const text = await response.text();

    const parser = new Parser(text);
    return parser
        .get_all_events()
        .filter((event) =>
            event.occurrences.some((occ) => occ.matches(config)),
        );
};

/**
 * Finds rooms matching the search term.
 * @param search_term The search term.
 */
export const find_rooms = async (
    search_term: string,
): Promise<KITRoom[] | null> => {
    let fetch_id = ++current_room_fetch_id;
    const query_url = `${ROOMS_QUICK_SEARCH_URL}${search_term}`;
    const response = await make_request(query_url, {
        max_age: 60 * 60 * 24 * 7 * 4, // 4 weeks
    });

    if (fetch_id !== current_room_fetch_id) {
        return null;
    }

    const json: { count: number; result: RawRoom[] } = await response.json();

    return json.result.map((room) => new KITRoom(room.id, room.name));
};
