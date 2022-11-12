<script lang="ts">

    import {get_events, KITEvent, VALID_TIMES} from "./api_handler";
    import LoadingEllipsis from "./LoadingEllipsis.svelte";
    import Event from "./Event.svelte";
    import { DateInput } from 'date-picker-svelte'


    const get_nearest_time_from_now = (): string => {
        const now = Date.now();
        const hours = new Date(now).getHours();
        const minutes_now = new Date(now).getMinutes() + hours * 60;

        let minutes = VALID_TIMES.reduce((prev, curr) => {
            const minutes_curr = curr.split(":")[0] * 60 + curr.split(":")[1] * 1;
            return (Math.abs(minutes_curr - minutes_now) < Math.abs(prev - minutes_now) ? minutes_curr : prev);
        }, 0);

        if(minutes == 0){
            minutes = 8*60;
        }

        const zero_fill = (num: number): string => num < 10 ? "0" + num : num.toString();

        return `${zero_fill(Math.floor(minutes / 60))}:${zero_fill(minutes % 60)}`;
    }

    const date_to_day_string = (date: Date): string => {
        return date.toISOString().split("T")[0].split("-").reverse().join("."); // dd.mm.yyyy
    }

    const default_time = get_nearest_time_from_now();
    let date = new Date();

    if(date.getDay() == 0){
        date = new Date(date.setDate(date.getDate() + 2));
    }else if(date.getDay() == 6){
        date = new Date(date.setDate(date.getDate() + 3));
    }

    // const default_date  = date_to_day_string(date);

    // console.log(default_time, default_date);
    let current_time = default_time;
    let current_day: Date = date;

    $:{
        i_promise_events = get_events(date_to_day_string(current_day), current_time);
        i_promise_events.then(events => {
            available_events = events;
        // console.log("asd")
        });
    }

    let selected_event_index = -1;

    let i_promise_events;
    let available_events: KITEvent[] = [];
    let event_elements = {};

    const select_random_event = () => {
        selected_event_index = Math.floor(Math.random() * (available_events.length - 1));

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
        <button class="material" on:click={select_random_event}>
            <span class="material-icons-outlined">
                casino
            </span>
        </button>
    </div>
    <div class="content">
        <div class="day-notice">
            Tag: {date_to_day_string(current_day)}
        </div>
        {#await i_promise_events}
            <div class="loading flex-center">
                <h3>Loading</h3>
                <LoadingEllipsis/>
            </div>
        {:then events}
            <div class="events">
                {#each events as event}

                        <Event event={event} index={events.indexOf(event)} selected={selected_event_index==events.indexOf(event)} />

                {/each}
            </div>
        {:catch error}
            <div class="error">{error}</div>
        {/await}
    </div>
    <div class="footer-nav">

<!--        <button class="clear day">-->
<!--            Tag-->
<!--            <DateInput bind:value={date} />-->

<!--        </button>-->
        <div class="time">
            <label for="time">Zeit</label>
            <select name="time" id="time" bind:value={current_time} class="dark-select">
                {#each VALID_TIMES as time}
                    <option value={time}>{time}</option>
                {/each}
            </select>
        </div>
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

    .content {
        flex: 1;
        /*height: min-content;*/
        /*max-height: calc(100% - 54px);*/
        overflow: auto;
    }

    .day-notice{
        text-align: center;
        font-size: 1.5em;
        margin: 0.2rem 0;
        color: #c5c5c5;
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

    .header span.title {
        margin: 0;
        padding: 0;
        padding-left: 10px;
        line-height: 54px;
        font-size: 24px;
        font-weight: 550;
    }

    .loading{
        flex-direction: column;
    }

    .loading h3 {
        font-weight: bold;
        color: #dcdcdc;

    }

    .events{
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

    .footer-nav{
        padding-top: 10px;
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
        background-color: var(--dark-bg-color-dark-dark-m);
    }
    .footer-nav .time{
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .footer-nav .time label{
        margin: 0;
        padding: 0 20px;
        line-height: 54px;
        font-weight: 500;
        font-size: 1.3rem;
    }
    .footer-nav .time select{
        /*padding-right: 15px;*/
        width: 80%;
    }
</style>
