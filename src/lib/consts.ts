
export const KIT_UID_REGEX = /0x[0-9a-fA-F]{32}/;
export const KIT_CMS_BASE_EVENT_URL = "https://campus.kit.edu/sp/campus/all/event.asp?gguid="
export const KIT_CMS_BASE_ROOM_URL = "https://campus.kit.edu/sp/campus/all/room.asp?gguid="
export const KIT_GGUID_GROUP_REGEX = /gguid=(0x[0-9a-fA-F]{32})/;
export const KIT_DAY_TIME_REGEX = /(Mo|Di|Mi|Do|Fr|Sa|So)( \((\d{2}.\d{2}.\d{4})\))?, (.*)?, (\d{2}:\d{2} - \d{2}:\d{2}).*/;

export const KIT_EVENT_DATE_OCCURRENCE_REGEX = /(Mo|Di|Mi|Do|Fr|Sa|So), (.+)/;
export const KIT_EVENT_FIXED_DATE_REGEX = /\d{2}.\d{2}.\d{4}/;

export const KIT_EVENT_ONLY_EVERY_SECOND_WEEK_LABEL = "14-täglich";

export const DATE_FORMAT = "#DD#.#MM#.#YYYY#";
export const TIME_FORMAT = "#hh#:#mm#";
