<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import arrow from "../../assets/imgs/arrow.png";
    import arrow2 from "../../assets/imgs/arrow2.png";
    import { fade } from "svelte/transition";

    export let events_promise: Promise<any[]>;

    const dispatch = createEventDispatcher();

    let intro_was_shown = localStorage.getItem("intro_was_shown") === "true";
    let show_intro = false;

    $: if (events_promise) {
        events_promise.then((events) => {
            setTimeout(() => {
                if (events.length > 0 && !intro_was_shown) {
                    show_intro = true;
                    intro_was_shown = true;
                }
            }, 5000);
        });
    }

    const hide_intro = () => {
        show_intro = false;
        localStorage.setItem("intro_was_shown", "true");
    };

    const click = () => {
        hide_intro();
        dispatch("click");
    };
</script>

<div class="fab-wrapper">
    {#if show_intro}
        <div
            transition:fade={{ duration: 200 }}
            class="fab-intro"
            on:click={hide_intro}
        >
            <img class="arrow" src={arrow} alt="->" height="214" width="488" />
            <img
                class="arrow2"
                src={arrow2}
                alt="->"
                height="546"
                width="960"
            />
            <div class="text">Zufällige Vorlesung auswählen</div>
        </div>
    {/if}
    <button
        class="floating-action-button clear flex-center box-shadow"
        class:highlighted={show_intro}
        on:click={click}
    >
        <span class="material-icons-outlined">casino</span>
    </button>
</div>

<style>
    .fab-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .floating-action-button {
        position: absolute;
        bottom: 50px;
        right: 10px;
        background-color: #1b1e27;
        border-radius: 50%;
        margin: 0;
        padding: 15px;
        aspect-ratio: 1;
        width: 60px;
        height: 60px;
        font-size: 1.7rem;
        pointer-events: all;
        z-index: 9999;
    }
    .floating-action-button.highlighted {
        /*z-index: 9999;*/
        -webkit-box-shadow: 0 0 14px 6px rgba(255, 170, 0, 0.9);
        -moz-box-shadow: 0 0 14px 6px rgba(255, 170, 0, 0.9);
        box-shadow: 0 0 14px 6px rgba(255, 170, 0, 0.9);
    }

    .fab-intro {
        position: absolute;
        width: 100%;
        height: 100%;

        background-color: rgba(0, 0, 0, 0.8);
        pointer-events: all;
    }

    .fab-intro .arrow {
        position: absolute;
        bottom: 40px;
        right: 110px;
        width: 150px;
        height: 100px;
        rotate: 20deg;
        z-index: 1;
        pointer-events: none;
    }
    .fab-intro .arrow2 {
        position: absolute;
        bottom: 160px;
        right: 60px;
        width: 150px;
        height: 100px;
        rotate: 90deg;
        z-index: 1;
        pointer-events: none;
        filter: saturate(0.5) brightness(1.4);
    }
    .fab-intro .text {
        position: absolute;
        bottom: 200px;
        right: 200px;
        /*width: 300px;*/
        height: 100px;
        z-index: 1;
        pointer-events: none;
        font-size: 2rem;
        color: white;
        text-align: center;
    }
</style>
