<script lang="ts">
    import { createEventDispatcher } from "svelte";
    let dispatch = createEventDispatcher();

    export let active: boolean = false;

    const toggle = () => {
        active = !active;
        dispatch("change", active);
    };
</script>

<div class="slider-outer" class:active on:click={toggle}>
    <div class="body"><div class="point" /></div>
</div>

<style>
    .slider-outer {
        width: 30px;
        /* height: 20px;  */
        margin: 20px auto;
        position: relative;
        cursor: pointer;
    }
    .body {
        background-color: rgb(95, 95, 95);
        height: 14px;
        width: 30px;
        border-radius: 10px;
        margin: 0;
        display: flex;
        align-items: center;
    }
    .point {
        background-color: rgb(144, 144, 144);
        width: 20px;
        height: 20px;
        border-radius: 100%;
        position: absolute;
        left: -10px;
        /* top: -3px; */
        transition: left 0.3s ease;
    }
    .slider-outer.active .point {
        left: 20px;
        background-color: rgb(62, 166, 255);
    }
    .slider-outer.active .body {
        background-color: rgb(20, 51, 78);
    }
</style>
