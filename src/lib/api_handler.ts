import {format_date} from "./util/util";
import type {KITEvent, KITEventsConfig, CorsProxyHeaders} from "./types";
import {END_TIMES} from "./types";
import {Parser} from "./parser";

const CORS_PROXY_SERVER = "https://cors.taptwice.dev/request";
const BASE_URL = "https://campus.kit.edu/sp/campus/all/extendedSearch.asp";
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

const DEFAULT_FORM_DATA = {
    'search': 'Suchen',
    'tguid': '0x40B784B43AED4CC9857335104533EDFB', // TODO: This is the tguid for the semester.
    'appointmentdate': '11.11.2022',
    'appointmenttimestart': '14%3A00',
    'appointmenttimeend': '15%3A30',
    'pagesize': 500,
}


/**
 * Makes a request to the cors proxy to avoid CORS issues with the KIT endpoint.
 * @param url The url to make the request to.
 * @param form_data The form data to send.
 * @param headers The headers to send.
 * @returns The response.
 *
 * @see https://github.com/MatthiasHarzer/minimal-cors-server
 */
const make_request = (url: string, form_data: object, headers: object): Promise<Response> => {
    const body: CorsProxyHeaders = {
        method: "POST",
        url: url,
        data: form_data,
        headers: headers,
        cache: true
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
export const get_events = async (config: KITEventsConfig): Promise<KITEvent[]> => {
    const json_form_data = {...DEFAULT_FORM_DATA};

    json_form_data.appointmentdate = format_date(config.day, "#DD#.#MM#.#YYYY#");
    json_form_data.appointmenttimestart = config.time;
    json_form_data.appointmenttimeend = END_TIMES[config.time];

    const response = await make_request(BASE_URL, json_form_data, REQUEST_HEADERS);
    const text = await response.text();

    const time_span = `${config.time} - ${END_TIMES[config.time]}`

    const parser = new Parser(text, config.day, time_span);
    const events = parser.get_all_events_with_valid_room();

    if (config.types.length === 0) return events;
    return events.filter((event) => config.types.includes(event.type));
}
