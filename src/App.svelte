<script lang="ts">


    import RoomEventsApp from "./lib/room_events/RoomEventsApp.svelte";
    import RouletteApp from "./lib/roulette/RouletteApp.svelte";
    import PageSlider from "./lib/components/slider/PageSlider.svelte";
    import type {Page} from "./lib/components/slider/page";


    const pages: Page[] = [
        {
            title: "Roulette",
            component: RouletteApp,
            icon: "casino"
        },
        {
            title: "Room Events",
            component: RoomEventsApp,
            icon: "event"
        }
    ]

    let current_page_index = JSON.parse(localStorage.getItem("current_page_index") || "null") ?? 0;

    $: localStorage.setItem("current_page_index", JSON.stringify(current_page_index));


</script>

<main>
    <PageSlider bind:current_page_index {pages} show_navigation={true}/>
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
