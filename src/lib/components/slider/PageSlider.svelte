<script lang="ts">
    import type {Page} from "./page";
    import type {ScrollObserver, ScrollObserverEvent} from "./scroll_observer";
    import {create_scroll_observer} from "./scroll_observer";
    import {onMount} from "svelte";


    export let pages: Page[];
    export let current_page_index: number = 0;


    const MIN_SCROLL_FRACTION_FOR_CHANGE = 0.3;
    const MIN_SPEED_FOR_CHANGE = 0.7;


    const on_release = () => {
        const scroll_fraction = Math.abs(last_event.delta_x / width);
        if (scroll_fraction >= MIN_SCROLL_FRACTION_FOR_CHANGE || Math.abs(last_event.speed_x) >= MIN_SPEED_FOR_CHANGE) {
            if (last_event.delta_x > 0) {
                current_page_index = Math.max(0, current_page_index - 1);
            } else {
                current_page_index = Math.min(pages.length - 1, current_page_index + 1);
            }
        }
        last_event = null;

        // I don't know why svelte doesn't update the value of total_offset without this
        total_offset = current_page_index * width;
    }

    onMount(()=>{
        if(current_page_index >= pages.length){
            current_page_index = pages.length - 1;
        }

        // This is to prevent the animation from triggering when the page is first loaded
        setTimeout(()=>{
            animation = true;
        }, 100);
    });


    let last_event: ScrollObserverEvent = null;
    let width = 0;
    let pages_element: HTMLElement;
    let scroll_observer: ScrollObserver;
    let total_offset: number = 0;
    let animation = false;

    $: scroll_observer = create_scroll_observer(pages_element, {uni_directional: true});

    $: if ($scroll_observer.direction !== null) {
        total_offset = (current_page_index * width) - $scroll_observer.delta_x;
        last_event = $scroll_observer;
    }else{
        total_offset = current_page_index * width;
    }

    $: if ($scroll_observer.direction === null && last_event !== null) on_release();
</script>

<div bind:clientWidth={width} class="main">
    <div bind:this={pages_element} class="pages" class:animation={$scroll_observer.direction === null && animation}
         style="--target-offset: {total_offset}px;">
        {#each pages as page}
            <div class="page" style="--width: {width}px;">
                <svelte:component this={page.component}/>
            </div>
        {/each}
    </div>
</div>

<style>

    .main {
        position: absolute;
        height: 100%;
        width: 100%;
    }

    .pages {
        position: absolute;
        height: 100%;
        /*width: 100%;*/
        /*right: -150%;*/
        left: calc(var(--target-offset) * -1);
        display: flex;
        flex-direction: row;
        transition: none;
    }

    .pages.animation {
        transition: left 0.2s ease-in-out;
    }

    .page {
        position: relative;

        height: 100%;
        width: var(--width);
        /*background-color: var(--color);*/
    }

</style>
