<script>
    import { createEventDispatcher } from "svelte";

    // export let light_theme;

    const dispatch = createEventDispatcher();

    const clicked = () => {
        dispatch("click");
    };
</script>

<main on:click={clicked}>
    <div class="x1" />
    <div class="x2" />
</main>

<style>
    main {
        color: white;
        font-family: Calibri;
        font-size: 30px;
        height: 30px;
        width: 30px;
        cursor: pointer;
        position: relative;
    }
    main .x1,
    main .x2 {
        width: 20px;
        height: 2px;
        background-color: white;
        top: 13px;
        left: 0px;
        position: absolute;
    }

    main .x2 {
        transform: rotate(45deg);
    }
    main .x1 {
        transform: rotate(-45deg);
    }
</style>
