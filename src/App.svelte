<script lang="ts">

    import LoadingEllipsis from "./lib/LoadingEllipsis.svelte";
    import Event from "./lib/Event.svelte";
    import ConfigPanel from "./lib/ConfigPanel.svelte";
    import {format_date} from "./lib/Util/util";
    import {get_events, VALID_TIMES} from "./lib/api_handler";
    import type {KITEvent, KITEventsConfig} from "./lib/types";

    import circled from "./assets/imgs/circled.png"
    import arrow from "./assets/imgs/arrow.png"

    const get_nearest_time_from_now = (): string => {
        const now = Date.now();
        const hours = new Date(now).getHours();
        const minutes_now = new Date(now).getMinutes() + hours * 60;

        let minutes = VALID_TIMES.reduce((prev, curr) => {
            const minutes_curr = curr.split(":")[0] * 60 + curr.split(":")[1] * 1;
            return (Math.abs(minutes_curr - minutes_now) < Math.abs(prev - minutes_now) ? minutes_curr : prev);
        }, 0);

        if (minutes == 0) {
            minutes = 8 * 60;
        }

        const zero_fill = (num: number): string => num < 10 ? "0" + num : num.toString();

        return `${zero_fill(Math.floor(minutes / 60))}:${zero_fill(minutes % 60)}`;
    }



    const default_time = get_nearest_time_from_now();
    let date = new Date();

    if (date.getDay() == 0) {
        date = new Date(date.setDate(date.getDate() + 1));
    } else if (date.getDay() == 6) {
        date = new Date(date.setDate(date.getDate() + 2));
    }

    // const default_date  = date_to_day_string(date);

    // console.log(default_time, default_date);



    let config: KITEventsConfig = {
        day: date,
        time: default_time,
        types: ["v"]
    }

    $:{
        selected_event_index = 0;
        i_promise_events = get_events(config);
        i_promise_events.then(events => {
            available_events = events;
            // console.log("asd")
            selected_event_index = -1;
        });
    }

    let selected_event_index = -1;

    let i_promise_events;
    let available_events: KITEvent[] = [];

    const select_random_event = () => {
        selected_event_index = Math.floor(Math.random() * (available_events.length - 1));

    }



    let config_panel_open = false;
    const open_config_panel = () => {
        config_panel_open = true;
    }
    const close_config_panel = () => {
        config_panel_open = false;
    }

    const submit_config = (event) => {

        config = event.detail;
        close_config_panel();
    }

    const p = new Promise((resolve, reject) => {
        // i_promise_events.then((events) => {
        // 	resolve(events);
        // });
    });
</script>

<main>

    <div class="header">
        <span class="title">KIT Vorlesungs Roulette</span>
        <div class="randomize">
            <img src={arrow} alt="->" class="arrow"/>
            <button class="material randomize-btn" on:click={select_random_event}>
                <img src={circled} alt="">
                <span class="material-icons-outlined">
                    casino
                </span>
            </button>
        </div>
    </div>
    <div class="content">
        <div class="config" on:click={open_config_panel}>

            <div class="day text">
                <span class="key">
                    Tag:
                </span>
                <span class="value">
                    {format_date(config.day, "#DDD#, #D#. #M#. #YYYY#")}
                </span>
            </div>
            <div class="right">
                <div class="time text">
                    <span class="key">
                        Zeit:
                    </span>
                    <span class="value">
                        {config.time} Uhr
                    </span>

                </div>
                <button class="material" on:click|stopPropagation={open_config_panel}>
                    <span class="material-icons">
                        edit
                    </span>
                </button>
            </div>

        </div>
        <hr/>
        {#await i_promise_events}
            <div class="loading flex-center">
                <h3>Loading</h3>
                <LoadingEllipsis/>
            </div>
        {:then events}
            {#if events.length > 0}
            <div class="events">
                {#each events as event}

                    <Event event={event} index={events.indexOf(event)}
                           selected={selected_event_index===events.indexOf(event)}/>

                {/each}
            </div>
                {:else}
                <div class="no-events flex-center">
                    <h3>Keine Vorlesungen gefunden</h3>
                </div>
                {/if}
        {:catch error}
            <div class="error">{error}</div>
        {/await}
    </div>

    {#if config_panel_open}
        <ConfigPanel on:close={close_config_panel} on:submit={submit_config} config={{...config}} />
    {/if}

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

    .content {
        flex: 1;
        /*height: min-content;*/
        /*max-height: calc(100% - 54px);*/
        overflow: auto;
    }

    .config .text {
        text-align: center;
        font-size: 1.1em;
        margin: 0.2rem 0;
        color: #f6f6f6;
        display: flex;
        align-items: center;
    }
    .config .text .key{
        font-weight: normal;
        margin-right: 0.5rem;
    }
    .config .text .value{
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

    .header {
        flex: 0 0 auto;
        overflow: hidden;
        height: 54px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
        0 6px 20px 0 rgba(0, 0, 0, 0.19);
        /* z-index: 2; */
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1rem;
    }

    .randomize{
        display: flex;
        align-items: center;
    }
    .randomize img.arrow{
        /*width: 1.5rem;*/
        position: relative;
        top: 0.4rem;
        width: auto;
        height: 1.9rem;
        margin-right: 0.5rem;
    }
    .randomize-btn{
        position: relative;

    }
    .randomize-btn img{
        position: absolute;
        /*top: -0.5rem;*/
        /*left: -0.5rem;*/
        width: auto;
        height: 120%;
        transform: rotate(-45deg);
        object-fit: cover;
        z-index: 1;
    }

    /*.randomize-btn span{*/
    /*    background-color: transparent;*/
    /*}*/

    .header span.title {
        margin: 0;
        padding: 0;
        padding-left: 10px;
        line-height: 54px;
        font-size: 24px;
        font-weight: 550;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .loading {
        flex-direction: column;
    }

    .loading h3 {
        font-weight: bold;
        color: #dcdcdc;

    }

    .events {
        height: 100%;
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
