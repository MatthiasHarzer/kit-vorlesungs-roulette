import { writable } from "svelte/store";

const createPageIndex = () => {
    const cached =
        JSON.parse(localStorage.getItem("current_page_index") || "null") ?? 0;
    const { subscribe, set } = writable(cached);

    return {
        subscribe,
        set: (index: number) => {
            localStorage.setItem("current_page_index", JSON.stringify(index));
            set(index);
        },
    };
};

export const pageIndex = createPageIndex();
