import type {Readable, Writable} from "svelte/store";
import {get, readable, writable} from "svelte/store";

/**
 * The scroll direction enum.
 */
enum ScrollDirection {
    Horizontal,
    Vertical
}

/**
 * The scroll observer parameters.
 */
interface ScrollObserverParams {
    /**
     * If true, the scroll observer will only observe the scroll direction that was first detected.
     */
    uni_directional?: boolean;
}

/**
 * An event containing scroll information, such as the scroll direction, delta and speed of scrolling.
 * Note that the speed is signed, meaning that it can be negative.
 */
export interface ScrollObserverEvent {
    delta_x: number;
    delta_y: number;
    direction: ScrollDirection | null;
    speed_x: number;
    speed_y: number;
}

/**
 * A scroll event stamp, used to calculate the speed of scrolling.
 */
interface ScrollEventStamp {
    time: number;
    delta_x: number;
    delta_y: number;
}

const default_scroll_event: ScrollObserverEvent = {
    delta_x: 0,
    delta_y: 0,
    direction: null,
    speed_x: 0,
    speed_y: 0,
};

/**
 * A scroll observer, which emits events whenever the user scrolls inside the observed element.
 */
export type ScrollObserver = Readable<ScrollObserverEvent>;

/**
 * Creates a scroll observer for the given element. The scroll observer will emit events whenever the user scrolls
 * inside the element.
 * @param element The element to observe.
 * @param params The scroll observer parameters.
 */
export const create_scroll_observer = (element: HTMLElement = null, params: ScrollObserverParams = {}): ScrollObserver => {

    if (element == null)
        return readable(default_scroll_event);

    let start_position: number[];
    let delta_position: number[] = [0, 0];
    let initial_scroll_direction: ScrollDirection | null = null;
    let scroll_event_stamps: ScrollEventStamp[] = [];
    const uni_directional = params?.uni_directional ?? false;
    const event_store: Writable<ScrollObserverEvent> = writable(default_scroll_event);

    const get_delta = (): number[] => {
        if (!uni_directional)
            return delta_position;

        return [
            initial_scroll_direction == ScrollDirection.Vertical ? 0 : delta_position[0],
            initial_scroll_direction == ScrollDirection.Horizontal ? 0 : delta_position[1]
        ]
    }

    const get_direction = (): ScrollDirection | null => {
        if (uni_directional)
            return initial_scroll_direction;

        return delta_position[0] > delta_position[1] ? ScrollDirection.Horizontal : ScrollDirection.Vertical;
    }

    const get_speed = (): number[] => {
        const last_stamp = scroll_event_stamps[scroll_event_stamps.length - 1];
        const first_valid_stamp = scroll_event_stamps.find(stamp => stamp.time > Date.now() - 1000);

        if (last_stamp == null || first_valid_stamp == null)
            return [0, 0];

        const delta_time = last_stamp.time - first_valid_stamp.time;
        const delta_x = last_stamp.delta_x - first_valid_stamp.delta_x;
        const delta_y = last_stamp.delta_y - first_valid_stamp.delta_y;

        if (delta_time == 0)
            return [0, 0];

        return [delta_x / delta_time, delta_y / delta_time];
    }

    const update = () => {
        const [delta_x, delta_y] = get_delta();
        const direction = get_direction();


        scroll_event_stamps.push({
            time: Date.now(),
            delta_x: delta_x,
            delta_y: delta_y
        });

        const speed = get_speed();

        const event: ScrollObserverEvent = {
            delta_x: delta_x,
            delta_y: delta_y,
            direction: direction,
            speed_x: speed[0],
            speed_y: speed[1]
        }

        event_store.set(event);
    }

    const on_touch_start = (event: TouchEvent) => {
        start_position = [event.touches[0].clientX, event.touches[0].clientY];
        update();
    }

    const on_touch_move = (event: TouchEvent) => {
        delta_position = [
            event.touches[0].clientX - start_position[0],
            event.touches[0].clientY - start_position[1]
        ]

        if (initial_scroll_direction == null) {
            const abs_delta_x = Math.abs(delta_position[0]);
            const abs_delta_y = Math.abs(delta_position[1]);
            if (abs_delta_x > abs_delta_y) {
                initial_scroll_direction = ScrollDirection.Horizontal;
            } else {
                initial_scroll_direction = ScrollDirection.Vertical;
            }
        }
        update();
    }

    const on_touch_end = (event: TouchEvent) => {
        delta_position = [0, 0];
        initial_scroll_direction = null;
        update();

        scroll_event_stamps = [];
    }

    console.log("create scroll observer")

    element.ontouchstart = on_touch_start;
    element.ontouchmove = on_touch_move;
    element.ontouchend = on_touch_end;

    return readable(get(event_store), (set) => {
        event_store.subscribe(set);
    });
}
