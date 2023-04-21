import {format_date} from "./util/util";
import type {
    CorsProxyBody,
    KITEvent,
    KITExtendedSearchFormData,
    KITRoomEventsConfig,
    KITTimeEventsConfig
} from "./types";
import {END_TIMES, KITRoom} from "./types";
import {Parser} from "./parser";

const CORS_PROXY_SERVER = "https://cors.taptwice.dev/request";
const BASE_URL = "https://campus.kit.edu/sp/campus/all/extendedSearch.asp";
const TERMS_URL = "https://campus.kit.edu/sp/server/services/kit/terms.asp";
const ROOMS_URL = "https://campus.kit.edu/sp/server/services/kit/quicksearch.asp?type=room&find="

const REQUEST_HEADERS = {
    'authority': 'campus.kit.edu', 'method': 'POST',
    'path': '/sp/campus/all/extendedSearch.asp', 'scheme': 'https',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en,en-US;q=0.9,de;q=0.8,da;q=0.7,zh-CN;q=0.6,zh;q=0.5,es;q=0.4',
    'cache-control': 'max-age=0', 'content-length': '452',
    'content-type': 'application/x-www-form-urlencoded',
    'cookie': 'session-campus-prod-sp=AWTAQSQRENGKPJNCGGLNAHJHCLCEPAMC',
    'origin': 'https://campus.kit.edu',
    'referer': 'https://campus.kit.edu/sp/campus/all/extendedSearch.asp',
    'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
    'sec-ch-ua-mobile': '?0', 'sec-ch-ua-platform': '"Windows"', 'sec-fetch-dest': 'iframe',
    'sec-fetch-mode': 'navigate', 'sec-fetch-site': 'same-origin', 'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64;x64) AppleWebKit / 537.36(KHTML, like Gecko) Chrome / 107.0.0.0 Safari / 537.36',
};

const DEFAULT_FORM_DATA: KITExtendedSearchFormData = {
    'search': 'Suchen',
    'tguid': '', // This gets replaced by the correct term id
    'appointmentdate': '',
    'appointmenttimestart': '',
    'appointmenttimeend': '',
    'pagesize': 500,
    'room': "{}"
}

let current_room_fetch_id = 0;

interface RawTerm {
    tstart: number,
    tend: number,
}

interface Term {
    start: Date,
    end: Date,
    id: string,
}

interface RawRoom {
    id: string,
    name: string,
}

const i_promise_terms = new Promise<Term[]>((resolve, reject) => {
    make_request(TERMS_URL, {}, {}, false)
        .then(response => response.json())
        .then((json: { [id: string]: RawTerm }) => {
            const terms = [];
            for (const id in json) {
                const term = json[id];
                terms.push({
                    start: new Date(term.tstart),
                    end: new Date(term.tend),
                    id: id
                });
            }
            resolve(terms);
        })
        .catch(error => reject(error));

});

const get_term_id = async (date: Date): Promise<string> => {
    const terms = await i_promise_terms;
    for (const term of terms) {
        if (date >= term.start && date <= term.end) {
            return term.id;
        }
    }
    throw new Error("No term found for the given date.");
}

/**
 * Creates a template for the form data and determines the term id.
 * @param date The date to get the term id for.
 */
const get_form_data_template = async (date: Date): Promise<KITExtendedSearchFormData> => {
    const json_form_data = {...DEFAULT_FORM_DATA};
    json_form_data.tguid = await get_term_id(date);
    json_form_data.appointmentdate = format_date(date, "#DD#.#MM#.#YYYY#");
    return json_form_data;
}

/**
 * Makes a request to the cors proxy to avoid CORS issues with the KIT endpoint.
 * @param url The url to make the request to.
 * @param form_data The form data to send.
 * @param headers The headers to send.
 * @param cache Whether to cache the response.
 * @returns The response.
 *
 * @see https://github.com/MatthiasHarzer/minimal-cors-server
 */
function make_request(url: string, form_data?: object, headers?: object, cache?: boolean): Promise<Response> {
    const body: CorsProxyBody = {
        method: "POST",
        url: url,
        data: form_data,
        headers: headers,
        cache: cache ?? true
    }

    return fetch(CORS_PROXY_SERVER, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
}

/**
 * Gets all events from the KIT endpoint matching the config.
 * @param config The config.
 * @returns The events.
 */
export const get_events = async (config: KITTimeEventsConfig): Promise<KITEvent[]> => {
    const json_form_data = await get_form_data_template(config.day);
    json_form_data.appointmenttimestart = config.time;
    json_form_data.appointmenttimeend = END_TIMES[config.time];

    const response = await make_request(BASE_URL, json_form_data, REQUEST_HEADERS);
    const text = await response.text();

    const parser = new Parser(text);
    const events = parser.get_all_events()
        .filter((event) => {
            return event.occurrences.some(occ => occ.matches(config));
        });
    if (config.types.length === 0) return events;
    return events.filter((event) => config.types.includes(event.type));
}

export const get_room_events = async (config: KITRoomEventsConfig): Promise<KITEvent[]> => {
    const json_form_data = await get_form_data_template(config.day);

    const rooms = {};
    for (const room of config.rooms) {
        rooms[room.id] = room.name;
    }

    json_form_data.room = JSON.stringify(rooms);

    const response = await make_request(BASE_URL, json_form_data, REQUEST_HEADERS);
    const text = await response.text();

    const parser = new Parser(text);
    return parser.get_all_events().filter((event) => event.occurrences.some(occ => occ.matches(config)));
}


export const find_rooms = async (search_term: string): Promise<KITRoom[] | null> => {
    let fetch_id = ++current_room_fetch_id;
    const query_url = `${ROOMS_URL}${search_term}`;
    const response = await make_request(query_url, {}, {}, true);

    if (fetch_id !== current_room_fetch_id) {
        return null;
    }

    const json: { count: number; result: RawRoom[] } = await response.json();

    return json.result.map((room) => new KITRoom(room.id, room.name));
}


