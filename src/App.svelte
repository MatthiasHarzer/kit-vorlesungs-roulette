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
        },
    ]

    let current_page_index = JSON.parse(localStorage.getItem("current_page_index") || "null") ?? 0;

    $: localStorage.setItem("current_page_index", JSON.stringify(current_page_index));

    const set_app_index = (index: number) => {
        current_page_index = index;
    }

</script>

<main>
    <PageSlider bind:current_page_index {pages}/>


    <div class="nav">
        <div class="page-indicator-wrapper">
            {#each pages as page, index}
                <div class="page-indicator" class:active={current_page_index === index}
                     on:click={()=>set_app_index(index)}></div>
            {/each}
        </div>
    </div>
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


    .page-indicator {
        width: 0.4rem;
        height: 0.4rem;
        border-radius: 50%;
        background-color: transparent;
        border: 2px solid white;
        margin: 0.2rem;
        transition: background-color 0.2s ease-in-out;
        cursor: pointer;

    }

    .page-indicator.active {
        background-color: white;
    }

    .nav {
        position: absolute;
        width: 100%;

        bottom: 0;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        /*background-color: tr;*/

        background-color: transparent;
    }

    .page-indicator-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 1rem;
        padding: 0.1rem 0.5rem 0 0.5rem;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        background-color: rgba(26, 26, 26, 0.71);
    }

</style>
