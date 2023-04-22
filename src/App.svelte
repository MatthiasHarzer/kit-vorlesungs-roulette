<script lang="ts">


    import RoomEventsApp from "./lib/room_events/RoomEventsApp.svelte";
    import RouletteApp from "./lib/roulette/RouletteApp.svelte";

    enum App {
        Roulette = "roulette",
        RoomEvents = "room-events"
    }

    let current_app = JSON.parse(localStorage.getItem("current_app") || "null") || App.Roulette;
    // current_app = App.Roulette;

    const enter_app = (app: App) => {
        current_app = app;
        localStorage.setItem("current_app", JSON.stringify(app));
    }

    enum ScrollDirection {
        Horizontal,
        Vertical
    }

    let track_start_x: number = null;
    let track_start_y: number = 0;
    let track_delta_x: number = 0;
    let track_delta_y: number = 0;
    let view_width: number = 0;
    let scroll_direction: ScrollDirection = null;

    const SCROLL_Y_THRESHOLD = 50;
    const SCROLL_X_MIN = 150;

    const on_track_start = (e: TouchEvent) => {
        track_start_x = e.touches[0].clientX;
        track_start_y = e.touches[0].clientY;
    }

    const on_track_end = (e: TouchEvent) => {
        scroll_direction = null;

        if(scroll_direction === ScrollDirection.Vertical) return;

        if (current_app === App.Roulette) {
            if (track_delta_x < -SCROLL_X_MIN) {
                enter_app(App.RoomEvents);
            } else {
                enter_app(App.Roulette);
            }
        } else if (current_app == App.RoomEvents) {
            if (track_delta_x > SCROLL_X_MIN) {
                enter_app(App.Roulette);
            } else {
                enter_app(App.RoomEvents);
            }
        }

    }

    const on_track = (e: TouchEvent) => {
        if (scroll_direction === null) {
            track_delta_x = e.touches[0].clientX - track_start_x;
            track_delta_y = e.touches[0].clientY - track_start_y;
            scroll_direction = Math.abs(track_delta_x) > Math.abs(track_delta_y) ? ScrollDirection.Horizontal : ScrollDirection.Vertical;
        } else {
            if (scroll_direction === ScrollDirection.Horizontal) {
                track_delta_x = e.touches[0].clientX - track_start_x;
            } else {
                track_delta_y = e.touches[0].clientY - track_start_y;
            }
        }
    }

    let offset: number = 0;

    $:{
        if (scroll_direction == null) {
            offset = current_app === App.Roulette ? 0 : -view_width;
            track_delta_x = 0;
        } else {

            if (current_app == App.Roulette) {
                offset = Math.min(0, track_delta_x);
            } else if (current_app == App.RoomEvents) {
                offset = Math.max(0, track_delta_x) - view_width;
            }
        }


    }

</script>

<main bind:clientWidth={view_width} on:touchend={on_track_end} on:touchmove={on_track} on:touchstart={on_track_start}>

    <div class="swipe-apps"
         class:active-scroll={scroll_direction != null}
         style="--offset: {offset}px;">
        <div class="app">
            <RouletteApp/>
        </div>
        <div class="app">
            <RoomEventsApp/>
        </div>
    </div>


    <div class="nav">
        <div class="page-indicator-wrapper">

            <div class="page-indicator roulette-app" class:active={current_app === App.Roulette}
                 on:click={()=>enter_app(App.Roulette)}></div>
            <div class="page-indicator room-events-app" class:active={current_app === App.RoomEvents}
                 on:click={()=>enter_app(App.RoomEvents)}></div>
        </div>
        <!--        <div class="nav-item roulette-app">-->
        <!--            <button class="material text-button">-->
        <!--                <span class="material-icons">-->
        <!--                    casino-->
        <!--                </span>-->
        <!--                Roulette-->
        <!--            </button>-->
        <!--        </div>-->
        <!--        <div class="nav-item room-app">-->
        <!--            <button class="material text-button">-->
        <!--                <span class="material-icons">-->
        <!--                    casino-->
        <!--                </span>-->
        <!--                Room-->
        <!--            </button>-->
        <!--        </div>-->
    </div>
</main>


<style>
    main {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        color: white;
        display: flex;
        flex-direction: column;
    }

    .app-container {
        position: relative;
        flex: 1 0 0;
    }

    .swipe-apps {
        position: absolute;
        display: flex;
        flex-direction: row;
        width: 200vw;
        height: 100%;

        overflow: hidden;

        right: calc(-100vw - var(--offset));
        /*left: 100vw;*/
        transition: right 0.2s ease-in-out;
    }

    .swipe-apps.active-scroll {
        transition: none;
    }

    .app {
        position: relative;
        width: 100vw;
        height: 100%;
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

    /*.nav-item{*/
    /*    flex: 1 0 0;*/
    /*    display: flex;*/
    /*    justify-content: center;*/
    /*}*/
</style>
