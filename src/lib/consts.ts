const KIT_BASE_URL = "https://campus.kit.edu";

export const CORS_PROXY_SERVER = import.meta.env.VITE_CORS_PROXY_SERVER_URL;
export const EXTENDED_SEARCH_BASE_URL = `${KIT_BASE_URL}/sp/campus/all/extendedSearch.asp`;
export const TERMS_URL = `${KIT_BASE_URL}/sp/server/services/kit/terms.asp`;
export const ROOMS_QUICK_SEARCH_URL = `${KIT_BASE_URL}/sp/server/services/kit/quicksearch.asp?type=room&find=`;

export const ROOMS_SEARCH_URL = `https://campus.studium.kit.edu/search.php#!campus/all/search.asp?searchtype=room&searchterm=`;

export const KIT_UID_REGEX = /0x[0-9a-fA-F]{32}/;
export const KIT_CMS_BASE_EVENT_URL = `${KIT_BASE_URL}/sp/campus/all/event.asp?gguid=`;
export const KIT_CMS_BASE_ROOM_URL = `${KIT_BASE_URL}/sp/campus/all/room.asp?gguid=`;
export const KIT_GGUID_GROUP_REGEX = /gguid=(0x[0-9a-fA-F]{32})/;
export const KIT_DAY_TIME_REGEX =
    /(Mo|Di|Mi|Do|Fr|Sa|So)( \((\d{2}.\d{2}.\d{4})\))?, (.*)?, (\d{2}:\d{2} - \d{2}:\d{2}).*/;

export const KIT_EVENT_DATE_OCCURRENCE_REGEX = /(Mo|Di|Mi|Do|Fr|Sa|So), (.+)/;
export const KIT_EVENT_FIXED_DATE_REGEX = /\d{2}.\d{2}.\d{4}/;

export const KIT_EVENT_ONLY_EVERY_SECOND_WEEK_LABEL = "14-täglich";

export const DATE_FORMAT = "#DD#.#MM#.#YYYY#";
export const TIME_FORMAT = "#hh#:#mm#";
