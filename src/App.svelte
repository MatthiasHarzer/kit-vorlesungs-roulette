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
    let nav_element_width;
    let relative_slide_progress;
    let total_slide_progress;

    $: localStorage.setItem("current_page_index", JSON.stringify(current_page_index));

    const set_app_index = (index: number) => {
        current_page_index = index;
    }


</script>

<main>
    <PageSlider bind:current_page_index bind:relative_slide_progress bind:total_slide_progress {pages}/>


    <div class="nav">

        {#each pages as page, index}
            <button class="nav-item-btn clear" class:active={current_page_index === index}
                    on:click={() => set_app_index(index)}
                    bind:clientWidth={nav_element_width}
            >
                <span class="material-icons">{page.icon}</span>
                <span>{page.title}</span>
            </button>

        {/each}
        <div class="active-indicator"
             style="--progress-offset: {total_slide_progress}; --width: {nav_element_width}px">
            <div class="blob" style="--relative-slide-progress: {relative_slide_progress};"></div>
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


    .nav {
        position: relative;
        width: 100%;

        /*bottom: 0;*/
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;

        background-color: #1b1e27;

        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
        border-radius: 0.2rem 0.2rem 0 0;
        border-top: 0.1rem solid #2a2f3a;

    }

    .nav::after{
        content: "";
        position: absolute;
        bottom: -0.1rem;
        left: 0;
        width: 100%;
        height: 0.1rem;
        box-shadow: 0 0 1rem rgba(255, 255, 255, 0.5);
    }

    .nav-item-btn {
        display: flex;
        flex: 1 0;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 0.5rem;
        cursor: pointer;
        transition: background-color 0.2s ease-in-out;
        position: relative;


    }

    .nav-item-btn:hover {
        background-color: #2a2f3a;
    }

    .nav-item-btn span {
        color: #eaeaea;
        margin-left: 0.5rem;
        z-index: 1;
    }

    .active-indicator {
        pointer-events: none;
        position: absolute;
        bottom: 0;
        left: calc(var(--progress-offset) * (var(--width)));


        height: 100%;
        width: var(--width);

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: end;
        z-index: 1;
    }

    .active-indicator .blob {
        --relative-slide-progress-sined: sin(var(--relative-slide-progress) *pi);

        position: relative;
        bottom: 0;
        left: 0;
        height: 0.3rem;
        /*width: calc(var(--relative-slide-progress-sined) * (50% - 2rem) + 2rem);*/
        width: calc(
                max(var(--relative-slide-progress-sined), -1 * var(--relative-slide-progress-sined))/* This is just an abs() function */
                * (70% - 2rem) + 3rem
        );
        background-color: #eaeaea;
        border-radius: 1rem 1rem 0 0;
    }


</style>
