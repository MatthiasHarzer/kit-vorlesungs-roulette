export interface KITRoom{
    name: string,
    gguid: string,
    cms_map_link: string,
    google_maps_link: string,
}

export interface KITEvent {
    id: string,
    title: string,
    type: string,
    lecturer: string,
    format: string,
    link: string,
    time: string,
    room: KITRoom,
}

export interface KITEventsConfig{
    day: Date,
    time: string,
    types: string[],
}

