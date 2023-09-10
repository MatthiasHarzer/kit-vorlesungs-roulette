<script lang="ts">
    import type {Page} from "./page";


    export let pages: Page[];
    export let current_page_index = 0;
    export let total_slide_progress = 0;
    export let relative_slide_progress = 0;
    export let page_index_diff = 0;

    let nav_element_width = 0;

    const set_app_index = (index: number) => {
        current_page_index = index;
    }

    $: active_indicator_style =
        `--width: ${nav_element_width}px;` +
        `--page-index-difference: ${Math.abs(page_index_diff)};` +
        `--blob-left: ${nav_element_width * total_slide_progress}px;` +
        `--blob-sined-progress: ${Math.abs(Math.sin(relative_slide_progress * Math.PI))};`;
</script>

<div class="main">
    {#each pages as page, index}
        <button class="nav-item-btn clear" class:active={current_page_index === index}
                on:click={() => set_app_index(index)}
                bind:clientWidth={nav_element_width}
        >
            <span class="material-icons">{page.icon}</span>
            <span>{page.title}</span>
        </button>

    {/each}
    <div class="active-indicator"
         style={active_indicator_style}>
        <div class="blob"></div>
    </div>
</div>

<style>
    .main {
        position: relative;
        width: 100%;

        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;

        background-color: #1b1e27;

        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
        border-radius: 0.2rem 0.2rem 0 0;
        border-top: 0.1rem solid #2a2f3a;
    }

    .main::after {
        content: "";
        position: absolute;
        bottom: -0.1rem;
        left: 0;
        width: 100%;
        height: 0.1rem;
        box-shadow: 0 0 1rem rgba(255, 255, 255, 0.5);
    }

    .nav-item-btn {

        display: flex;
        flex: 1 0;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 0.5rem;
        cursor: pointer;
        transition: background-color 0.2s ease-in-out;
        position: relative;
        height: 100%;

    }

    .nav-item-btn:hover {
        background-color: #2a2f3a;
    }

    .nav-item-btn span {
        color: #eaeaea;
        margin-left: 0.5rem;
        z-index: 1;
    }

    /*noinspection CssUnresolvedCustomProperty,CssInvalidFunction*/
    .active-indicator {
        pointer-events: none;
        position: absolute;
        top: 0;
        left: var(--blob-left);

        height: 100%;
        width: var(--width);

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: end;
        z-index: 1;
    }

    /*noinspection CssUnresolvedCustomProperty*/
    .active-indicator .blob {
        --min-width: 3rem;
        --max-width: 70%;

        position: relative;
        bottom: 0;
        left: 0;
        height: 0.3rem;
        width: calc(var(--blob-sined-progress) * (var(--max-width) * var(--page-index-difference) - var(--min-width)) + var(--min-width));
        background-color: #eaeaea;
        border-radius: 1rem 1rem 0 0;
    }
</style>
