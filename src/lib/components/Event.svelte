<script lang="ts">

    // import type {KITEvent} from "./api_handler";

    import type {KITEvent, KITOccurrenceEventComparable, KITTimeEventsConfig} from "../types";
    import {KIT_EVENT_TYPES_LOCALIZATION, KITEventOccurrence} from "../types";

    export let event: KITEvent;
    export let config: KITOccurrenceEventComparable;

    export let index: number;
    export let selected: boolean = false;

    const material_color_pallet = [
        "#c76666",
        "#d77e58",
        "#53afaf",
        "#71ad71",
        "#6196d3",
        "#9d7fbe",
        "#a371bb",
        "#cc7b9c",
        "#518f48",
    ];

    index = Math.round(Math.random() * material_color_pallet.length);

    const color = material_color_pallet[index % material_color_pallet.length];

    let target_occurrence: KITEventOccurrence;

    $: matching_occurrences = event.occurrences.filter(occ => occ.matches(config));
    $: target_occurrence = matching_occurrences.length > 0 ? matching_occurrences[0] : null;
    $: loading = target_occurrence == null;

    $: if (matching_occurrences.length == 0) {
        console.log("No matching occurrences found for event (This should not happen!): ", event);
    }

    let element;

    $:{
        if (selected) {
            if (element) {
                element.scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"});
            }
        }
    }

</script>


<div bind:this={element} class="event box-shadow" class:selected style="--color: {color}">
    {#if loading}
        <div class="loading">
            <span class="material-icons">
                hourglass_empty
            </span>
        </div>
    {:else}
        <h4><a href="{event.link}" target="_blank">
            {event.title}
            <span class="material-icons">
            open_in_new
        </span>
        </a></h4>
        <hr>
        <div class="time-room">
            <span class="time">{target_occurrence.time_span}</span>
            <!--        <span class="label">in Room: </span>-->
            <span class="room">
            {#if target_occurrence.room?.name}
                <a href="{target_occurrence.room?.link ?? null}" target="_blank">
                    {target_occurrence.room?.name}
                </a>
            {:else}
                Unknown
            {/if}
        </span>
        </div>
        <div class="footer">
            <div class="lecturer">
                <span class="value">{event.lecturer || "Unknown"}</span>
            </div>
            <div class="type">
                <span>{KIT_EVENT_TYPES_LOCALIZATION[event.type]}</span>
            </div>
        </div>
    {/if}
</div>

<style>

    .event {
        padding: 10px;
        margin: 5px 10px;
        border-radius: 10px;
        /*display: inline-block;*/

        display: flex;
        flex-direction: column;

        position: relative;

        background-color: var(--color);
        height: auto;

        /*min-width: 40%;*/
        /*max-width: 500px;*/


    }

    .event.selected {
        z-index: 9999;
        -webkit-box-shadow: 0 0 14px 6px rgba(255, 170, 0, 0.9);
        -moz-box-shadow: 0 0 14px 6px rgba(255, 170, 0, 0.9);
        box-shadow: 0 0 14px 6px rgba(255, 170, 0, 0.9);
    }


    h4 {
        margin: 0;
        font-weight: 500;
        text-transform: uppercase;
        word-wrap: break-word;
    }

    .material-icons {
        font-size: 1.2rem;
        vertical-align: middle;
    }

    .time-room {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: rgba(10, 31, 12, 0.21);
        padding: 5px 15px;
        border-radius: 5px;
    }

    .time-room .time, .time-room .room {
        font-weight: 500;
    }

    .time-room .room {
        text-align: right;
        /*word-wrap: break-word;*/
        flex: 0 1 auto;
        overflow: hidden;
        word-wrap: break-word;
        margin-left: 5px;
    }

    .time-room .room * {
        word-wrap: break-word;
    }

    .time-room .label {
        margin: 0 10px;
        text-align: center;
    }

    a {
        text-decoration: none;
        color: #fcfcfc;
    }

    .room a {
        color: #ff9a59;
    }

    .footer {
        height: auto;
        flex: 1 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: end;
    }

    .footer .lecturer {
        /*bottom: 0;*/
        margin-top: 4px;
    }

    .footer .lecturer .value {
        font-weight: 500;

    }

    .footer .type span {
        color: #dedede;
        font-weight: 500;
        font-size: 0.9rem;
    }


</style>
