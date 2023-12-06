<script lang="ts">
    import { fade } from "svelte/transition";
    import LoadingEllipsis from "../components/LoadingEllipsis.svelte";
    import Event from "../components/Event.svelte";
    import ConfigPanel from "./ConfigPanel.svelte";
    import * as util from "../util/util";
    import { format_date } from "../util/util";
    import { get_events } from "../event_handler";
    import type { KITEvent, KITTimeEventsConfig } from "../types";
    import { KITEventType } from "../types";
    import CreditFooter from "../components/CreditFooter.svelte";
    import "../app_style.css";
    import RetryButton from "../components/RetryButton.svelte";
    import RandomizeFab from "./RandomizeFab.svelte";
    import { onMount } from "svelte";
    import { pageIndex } from "../page_index";

    let app_body: HTMLElement;
    let scroll_up_hidden = true;

    const default_time = util.get_nearest_time_from_now();
    let date = new Date();

    if (date.getDay() == 0) {
        date = new Date(date.setDate(date.getDate() + 1));
    } else if (date.getDay() == 6) {
        date = new Date(date.setDate(date.getDate() + 2));
    }

    const cached_types_raw = localStorage.getItem("types");
    const cached_types = cached_types_raw
        ? JSON.parse(cached_types_raw)
        : [KITEventType.Vorlesung];

    let config: KITTimeEventsConfig = {
        day: date,
        time: default_time,
        types: cached_types.filter(
            (type) =>
                type != null && Object.values(KITEventType).includes(type),
        ),
    };

    onMount(() => {
        app_body.addEventListener("scroll", () => {
            scroll_up_hidden = app_body.scrollTop < 100;
        });
    });

    const scroll_up = () => {
        app_body.scrollTo({ top: 0, behavior: "smooth" });
    };

    const resets_indexes = () => {
        available_indexes = available_events.map((_, i) => i);
        remaining_indexes = [...available_indexes];
    };

    const fetch_events = () => {
        i_promise_events = get_events(config);
        i_promise_events.then((events) => {
            available_events = events;
            resets_indexes(); // Needs to be a method call to prevent svelte from calling this block every time the array is modified
        });
    };

    $: {
        selected_event_index = -1;
        config; // Needed to trigger the watcher
        fetch_events();
    }

    let selected_event_index = -1;

    let i_promise_events: Promise<KITEvent[]>;
    let available_events: KITEvent[] = [];
    let available_indexes: number[] = [];
    let remaining_indexes: number[] = [];

    const select_random_event = () => {
        // Selects a random event from the available events (without duplicates)

        if (selected_event_index >= 0) {
            clear_random_event();
            return;
        }

        if (remaining_indexes.length == 0) {
            remaining_indexes = [...available_indexes];
        }

        selected_event_index = remaining_indexes.splice(
            Math.floor(Math.random() * remaining_indexes.length),
            1,
        )[0];
    };
    const clear_random_event = () => {
        selected_event_index = -1;
    };

    let config_panel_open = false;
    const open_config_panel = () => {
        config_panel_open = true;
    };
    const close_config_panel = () => {
        config_panel_open = false;
    };

    const submit_config = (event) => {
        config = event.detail;
        localStorage.setItem("types", JSON.stringify(config.types));
        close_config_panel();
    };

    const randomize_intro_shown = () => {
        $pageIndex = 0; // Go to roulette page
        close_config_panel();
    };
</script>

<div class="main app-page">
    <div class="app-bar">
        <span class="title">KIT Vorlesungs Roulette</span>
    </div>
    <div class="app-body" bind:this={app_body}>
        <div class="content">
            <div class="config" on:click={open_config_panel}>
                <div class="day text">
                    <span class="key"> Tag: </span>
                    <span class="value">
                        {format_date(config.day, "#DDD#, #D#. #M#. #YYYY#")}
                    </span>
                </div>
                <div class="right">
                    <div class="time text">
                        <span class="key"> Zeit: </span>
                        <span class="value">
                            {config.time} Uhr
                        </span>
                    </div>
                    <button
                        class="material"
                        on:click|stopPropagation={open_config_panel}
                    >
                        <span class="material-icons"> edit </span>
                    </button>
                </div>
            </div>
            <hr />
            {#await i_promise_events}
                <div class="loading flex-center">
                    <h3>Loading</h3>
                    <LoadingEllipsis />
                </div>
            {:then events}
                {#if events.length > 0}
                    <div class="events">
                        {#each events as event}
                            <Event
                                {event}
                                {config}
                                index={events.indexOf(event)}
                                selected={selected_event_index ===
                                    events.indexOf(event)}
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
                    <RetryButton on:click={fetch_events} />
                </div>
            {/await}
        </div>
        <div class="fab-position-wrapper">
            <button
                class="scroll-up-button box-shadow"
                class:b-hidden={scroll_up_hidden}
                on:click={scroll_up}
                disabled={selected_event_index >= 0}
            >
                <span class="material-icons"> keyboard_arrow_up </span>
            </button>
            <RandomizeFab
                events_promise={i_promise_events}
                on:intro_shown={randomize_intro_shown}
                on:click={select_random_event}
                visually_disabled={selected_event_index >= 0}
            />
        </div>

        <CreditFooter />
    </div>

    {#if config_panel_open}
        <ConfigPanel
            on:close={close_config_panel}
            on:submit={submit_config}
            config={{ ...config }}
        />
    {/if}

    {#if selected_event_index >= 0}
        <button
            transition:fade={{ duration: 200 }}
            class="clear dark-background"
            on:click|stopPropagation={clear_random_event}
        ></button>
    {/if}
</div>

<style>
    .config .text {
        text-align: center;
        font-size: 1.1em;
        margin: 0.2rem 0;
        color: #f6f6f6;
        display: flex;
        align-items: center;
    }

    .config .text .key {
        font-weight: normal;
        margin-right: 0.5rem;
    }

    .config .text .value {
        font-weight: bold;
    }

    .config {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        background-color: #1e1e1e;
        border-radius: 0.5rem;
        margin: 0.5rem;
    }

    .config .right {
        display: flex;
        align-items: center;
    }

    .config .right > * {
        margin: 0 0.5rem;
    }

    hr {
        width: 90%;
        margin: 0 auto;
    }

    .events {
        position: relative;
        width: 100%;

        display: grid;
        grid-gap: 0;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
        grid-auto-rows: 1fr;
    }

    .dark-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1;
    }

    .fab-position-wrapper {
        position: sticky;
        bottom: 0;
        flex: 0 0 auto;

        pointer-events: none;

        display: flex;
        justify-content: space-between;
        align-items: center;

        padding: 10px;
        z-index: 9999;
        /*margin-top: auto;*/
    }

    .scroll-up-button {
        width: 40px;
        height: 40px;
        border-radius: 50%;

        border: 1px solid #404249;
        background-color: #1b1e27;

        scale: 1;
        transition: scale 0.2s ease-in-out;
        pointer-events: all;
    }
    .scroll-up-button:disabled {
        pointer-events: none;
        filter: brightness(0.5);
    }

    .scroll-up-button.b-hidden {
        pointer-events: none;
        scale: 0;
    }
</style>
