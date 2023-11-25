<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatcher = createEventDispatcher();

    const click = () => {
        dispatcher("click");
    };
</script>

<button class="material text-button" on:click>
    <span class="material-icons">refresh</span>
    Retry
</button>

<style>
    button,
    .material-icons {
        color: #ccc !important;
    }

    button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;
    }

    .material-icons {
        margin-right: 5px;
        font-size: 1.3rem;
    }
</style>
