<script lang="ts">
    import RoomEventsApp from "./lib/room_events/RoomEventsApp.svelte";
    import RouletteApp from "./lib/roulette/RouletteApp.svelte";
    import PageSlider from "./lib/components/slider/PageSlider.svelte";
    import type { Page } from "./lib/components/slider/page";
    import { pageIndex } from "./lib/page_index";

    const pages: Page[] = [
        {
            title: "Roulette",
            // @ts-ignore
            component: RouletteApp,
            icon: "casino",
        },
        {
            title: "Room Events",
            // @ts-ignore
            component: RoomEventsApp,
            icon: "event",
        },
    ];
</script>

<main>
    <PageSlider
        bind:current_page_index={$pageIndex}
        {pages}
        show_navigation={true}
    />
</main>

<style>
    main {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        color: white;
        display: flex;
        flex-direction: column;
    }
</style>
