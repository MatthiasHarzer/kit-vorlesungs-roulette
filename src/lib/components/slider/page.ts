import type Component from "svelte/types/compiler/compile/Component";

export interface Page {
    title: string;
    component: Component;
    icon: string;
}
