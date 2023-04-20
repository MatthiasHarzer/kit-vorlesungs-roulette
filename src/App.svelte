<script lang="ts">

    import RouletteApp from "./lib/roulette/RouletteApp.svelte";
</script>

<main>

    <RouletteApp/>
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

</style>
