<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { isBackgroundClick } from "../util/util";
    import type { KITTimeEventsConfig } from "../types";
    import {
        KIT_EVENT_TYPES_LOCALIZATION,
        KITEventType,
        VALID_TIMES,
    } from "../types";
    import DaySelect from "../components/DaySelect.svelte";

    export let config: KITTimeEventsConfig;

    // console.log(config)

    const dispatch = createEventDispatcher();

    const close = () => {
        dispatch("close");
    };
    const bg_click = (e) => {
        if (isBackgroundClick(e)) {
            close();
        }
    };

    const submit = () => {
        dispatch("submit", config);
    };

    const toggle_type = (type: KITEventType) => {
        if (config.types.includes(type)) {
            config.types = config.types.filter((t) => t !== type);
        } else {
            config.types.push(type);
        }
        config.types = config.types;
    };
</script>

<div class="blur-background bg"
     on:click={bg_click}
     on:keydown={bg_click}
     tabindex="-1"
>
    <div class="dialog bo">
        <div class="header">
            <h3>Einstellungen</h3>
            <button class="material close-btn" on:click={close}>
                <span class="material-icons">close</span>
            </button>
        </div>
        <div class="content">
            <div class="day item">
                <span class="key">Tag</span>
                <span class="value">
                    <DaySelect bind:date={config.day} />
                </span>
            </div>
            <div class="day item">
                <span class="key">Zeit</span>
                <span class="value">
                    <select
                        bind:value={config.time}
                        class="dark-select"
                        id="time"
                        name="time"
                    >
                        {#each VALID_TIMES as time}
                            <option value={time}>{time} Uhr</option>
                        {/each}
                    </select>
                </span>
            </div>
            <div class="type item">
                <span class="key">Typ</span>
                <span class="value">
                    {#each Object.keys(KIT_EVENT_TYPES_LOCALIZATION) as key}
                        <label
                            class="box-shadow"
                            for={key}
                            class:active={config.types.includes(key)}
                        >
                            {KIT_EVENT_TYPES_LOCALIZATION[key]}
                        </label>
                        <input
                            hidden
                            type="checkbox"
                            name="type"
                            id={key}
                            value={key}
                            on:change={() => {
                                toggle_type(key);
                            }}
                            checked={config.types.includes(key)}
                        />
                    {/each}
                </span>
            </div>
        </div>
        <div class="footer">
            <button class="clear box-shadow" on:click={submit}>
                Anwenden
            </button>
        </div>
    </div>
</div>

<style>
    .bg{
        z-index: 99999;
    }

    .dialog {
        max-height: 90%;
        display: flex;
        flex-direction: column;
    }

    .header, .footer{
        flex: 0 0 auto;
    }

    .content {
        padding: 0 1rem;
        width: 90%;
        max-width: 400px;
        flex: 1 1 auto;
        overflow: auto;
    }

    .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
    }

    .value {
        overflow: auto;
    }

    .item:not(:last-child) {
        border-bottom: 1px solid #8d8d8d;
    }

    .item.type {
        flex-direction: column;
    }

    .item.type .key {
        margin-bottom: 0.5rem;
    }

    .item.type .value {
        /*display: inline-flex;*/
        /*flex-direction: column;*/
        /*align-items: flex-start;*/
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-bottom: 1rem;
    }

    .item.type .value label {
        flex: 1 0 auto;
        display: inline-block;
        padding: 5px 10px;
        margin: 2px 2px;
        /*border-radius: 0.5rem;*/
        /*margin: 0.5rem 0;*/
        color: #8d8d8d;
        text-align: center;
        cursor: pointer;
        border: 1px solid #8d8d8d;
        border-radius: 15px;

        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently */
    }

    .item.type .value label.active {
        color: #fff;
        background-color: #2bab54;
        border-color: transparent;
    }

    .footer {
        display: flex;
        justify-content: center;
        padding: 0.5rem;
    }

    .footer button {
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        background-color: #2bab54;
        color: #fff;
        border: none;
        cursor: pointer;
    }
</style>
