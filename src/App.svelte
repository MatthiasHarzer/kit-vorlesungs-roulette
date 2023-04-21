<script lang="ts">


    import RoomEventsApp from "./lib/room_events/RoomEventsApp.svelte";
    import RouletteApp from "./lib/roulette/RouletteApp.svelte";

    enum App {
        Roulette = "roulette",
        RoomEvents = "room-events"
    }

    let current_app = JSON.parse(localStorage.getItem("current_app") || "null") || App.Roulette;

    const enter_app = (app: App) => {
        current_app = app;
        localStorage.setItem("current_app", JSON.stringify(app));
    }

    const on_track_start = (e: CustomEvent) => {
        console.log("on_track_start", e.detail);
    }

    const on_track_end = (e: CustomEvent) => {
        console.log("on_track_end", e.detail);
    }

</script>

<main >
    {#if current_app === App.Roulette}
        <RouletteApp/>
    {:else if current_app === App.RoomEvents}
        <RoomEventsApp/>
    {/if}


    <div class="nav">

        <div class="page-indicator roulette-app" class:active={current_app === App.Roulette}
             on:click={()=>enter_app(App.Roulette)}></div>
        <div class="page-indicator room-events-app" class:active={current_app === App.RoomEvents}
             on:click={()=>enter_app(App.RoomEvents)}></div>
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

    .page-indicator {
        width: 0.6rem;
        height: 0.6rem;
        border-radius: 50%;
        background-color: transparent;
        border: 2px solid white;
        margin: 0 0.2rem;
        transition: background-color 0.2s ease-in-out;
    }

    .page-indicator.active {
        background-color: white;
    }

    .nav {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 0 1rem;
        /*background-color: tr;*/
        height: 3rem;
    }

    /*.nav-item{*/
    /*    flex: 1 0 0;*/
    /*    display: flex;*/
    /*    justify-content: center;*/
    /*}*/
</style>
