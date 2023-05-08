<script lang="ts">
    import "../app_style.css";
    import LoadingEllipsis from "../components/LoadingEllipsis.svelte";
    import CreditFooter from "../components/CreditFooter.svelte";
    import type {KITRoomEventsConfig} from "../types";
    import {KITEvent, KITRoom} from "../types";
    import {find_rooms, get_room_events} from "../event_handler";
    import Event from "../components/Event.svelte";
    import DaySelect from "../components/DaySelect.svelte";
    import RetryButton from "../components/RetryButton.svelte";

    const TYPE_TIMEOUT = 200; // ms

    let room_search_term = "";
    let auto_complete_items: KITRoom[] = [];
    let typing_timeout: NodeJS.Timeout | null = null;

    const try_get_cached_rooms = () => {
        const cached_rooms_raw = localStorage.getItem("cached_rooms");
        try {
            return cached_rooms_raw ? JSON.parse(cached_rooms_raw).map((r) => new KITRoom(r.id, r.name)) : null;
        } catch (e) {
            return null;
        }
    }


    const config: KITRoomEventsConfig = {
        day: new Date(),
        rooms: try_get_cached_rooms() || [],
    }


    $: if (room_search_term.length > 0) {

        const make_search = (term: string) => {
            find_rooms(term).then((rooms) => {
                if (rooms == null) return;
                auto_complete_items = rooms.filter((room) => {
                    return !config.rooms.some((r) => r.id === room.id);
                });
            });
        }

        if (typing_timeout != null) {
            clearTimeout(typing_timeout);
            typing_timeout = setTimeout(() => {
                make_search(room_search_term);
                // typing_timeout = null;
            }, TYPE_TIMEOUT);
        } else {
            make_search(room_search_term);
        }
    } else {
        auto_complete_items = [];
    }

    const on_room_click = (room: KITRoom) => {
        config.rooms = [...config.rooms, room];
        room_search_term = "";
    }

    const on_remove_room_click = (room: KITRoom) => {
        config.rooms = config.rooms.filter((r) => r.id !== room.id);
    }

    let i_promise_events: Promise<KITEvent[]>;

    $: {
        localStorage.setItem("cached_rooms", JSON.stringify(config.rooms));
    }

    const fetch_events = () => {
        i_promise_events = new Promise<KITEvent[]>(async (res, rej) => {
            if (config.rooms.length === 0) res([]);
            try {
                const events = await get_room_events(config);
                events.sort((a, b) => {
                    return a.occurrences.find(occ => occ.matches(config))?.time_start_as_total_seconds -
                        b.occurrences.find(occ => occ.matches(config))?.time_start_as_total_seconds;
                });
                res(events);
            } catch (e) {
                rej(e);
            }
        });
    }

    $: {
        config;
        fetch_events();
    }

</script>

<div class="main app-page">
    <div class="app-bar">
        <span class="title">KIT Room Event Search</span>
    </div>
    <div class="content">
        <div class="config">
            <div class="day-select">
                <DaySelect bind:date={config.day}/>
            </div>
            {#if config.rooms.length > 0}
                <div class="selected-rooms-header">
                    <span>Ausgewählte Räume</span>
                </div>
                <div class="selected-rooms">
                    {#each config.rooms as room}
                        <div class="selected-room">
                            <span>{room.name}</span>
                            <button class="material" on:click={()=>on_remove_room_click(room)}>
                                <span class="material-icons">
                                    close
                                </span>
                            </button>
                        </div>
                    {/each}
                </div>
            {/if}
            <div class="room-search">
                <input bind:value={room_search_term} placeholder="Raum suchen..." type="text"/>
                {#if auto_complete_items.length > 0}
                    <div class="auto-complete box-shadow">
                        {#each auto_complete_items as item}
                            <div class="auto-complete-item" on:click={()=>on_room_click(item)}>
                                <span>{item.name}</span>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
        <!--        <hr/>-->
        {#await i_promise_events}
            <div class="loading flex-center">
                <h3>Loading</h3>
                <LoadingEllipsis/>
            </div>
        {:then events}
            {#if events.length > 0}
                <div class="events">
                    {#each events as event}

                        <Event event={event} config={config} index={events.indexOf(event)}
                        />

                    {/each}
                </div>
            {:else}
                <div class="no-events flex-center">
                    <h3>Keine Vorlesungen gefunden</h3>
                </div>
            {/if}
        {:catch error}
            <div class="error-snippet">
                <p>{error}</p>
                <RetryButton on:click={fetch_events}/>
            </div>
        {/await}
        <CreditFooter/>

    </div>
</div>


<style>
    .config {
        /*padding: 0.5rem;*/
        background-color: #1e1e1e;
        border-radius: 0.5rem;
        margin: 0.5rem;
        position: relative;
    }

    .room-search {
        margin: 0.5rem;
        position: relative;
    }

    .selected-rooms-header {
        margin: 1rem 0.5rem 0 1rem;
        font-size: 1em;
        text-transform: uppercase;
        color: #d9d9d9;
    }

    .auto-complete {
        box-sizing: border-box;
        position: absolute;
        background-color: #1b1e27;
        border: 1px solid #818181;
        border-radius: 2px;
        width: 100%;
        z-index: 100;
        max-height: 400px;
        overflow-y: auto;
    }

    .auto-complete .auto-complete-item {
        padding: 15px 5px 10px 40px;
        cursor: pointer;
        font-size: 1.4em;
    }

    .auto-complete .auto-complete-item:not(:last-child) {
        border-bottom: 1px solid #818181;
    }

    .room-search input {
        width: 100%;
        padding: 5px 10px 0 10px;
        font-size: 1.4em;
        border: none;
        box-sizing: border-box;
        border-radius: 0;
        /*background-color: #484848;*/
        background-color: transparent;
        border-bottom: 1px solid #818181;
        color: #efefef;
        margin: 0;
    }

    .selected-rooms {
        display: flex;
        flex-wrap: wrap;
        padding: 0.5rem;
        position: relative;
    }

    .selected-room {
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        padding: 2px 0.5rem;
        margin: 2px;
        border-radius: 0.5rem;
        background-color: #111111;
        border: 1px solid #818181;
        flex: 1 0 auto;
        max-width: 100%;
        color: #d0d0d0;

    }

    .events {
        /*height: 100%;*/
        width: 100%;

        position: relative;
        /*top: 150px;*/

        display: grid;
        grid-gap: 0;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
        grid-auto-rows: 1fr;
        /*grid-template-rows: minmax(100px, auto);*/
        /*grid-auto-rows: 5px;*/
    }
</style>
