export interface KITEvent {
    id: string,
    title: string,
    type: string,
    lecturer: string,
    format: string,
    link: string,
    time: string,
    room: string,
    room_link: string,
}

export interface KITEventsConfig{
    day: Date,
    time: string,
    types: string[],
}
