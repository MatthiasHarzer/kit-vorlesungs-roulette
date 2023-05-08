<script lang="ts">
    import type {Page} from "./page";
    import {onMount} from "svelte";
    import PageSliderNav from "./PageSliderNav.svelte";


    export let pages: Page[];
    export let current_page_index: number = 0;

    /**
     * The slide progress is the current page index with a decimal, between 0 and pages.length - 1.
     */
    export let total_slide_progress: number = 0;

    /**
     * The relative slide progress is the slide progress between two pages. It is between 0 and 1.
     */
    export let relative_slide_progress: number = 0;

    export let show_navigation: boolean = false;


    onMount(() => {
        if (current_page_index >= pages.length) {
            current_page_index = pages.length - 1;
        }

        // This is to prevent the animation from triggering when the page is first loaded
        setTimeout(() => {
            mounted = true;
        }, 100);

        pages_element.onscroll = (_: Event) => {
            offset = pages_element.scrollLeft;
        }
    });

    let width = 0;
    let pages_element: HTMLElement;
    let offset = 0;
    let mounted = false;
    let previous_page_index = 0;
    let page_index_diff = 1;

    $: if (pages && pages[current_page_index]?.element) {
        pages[current_page_index].element.scrollIntoView();
    }

    $: if (current_page_index != previous_page_index) {
        page_index_diff = current_page_index - previous_page_index;
        previous_page_index = current_page_index;
    }


    $: if (mounted) {
        total_slide_progress = offset / width;

        if (Math.abs(total_slide_progress - Math.round(total_slide_progress)) < 0.001){
            current_page_index = Math.round(total_slide_progress);
            page_index_diff = 1;
        }

    }

    $: relative_slide_progress = ((total_slide_progress + page_index_diff) - current_page_index) / page_index_diff;
</script>

<div class="main">
    <div bind:clientWidth={width} bind:this={pages_element} class="slides" class:animated={mounted}>
        {#each pages as page}
            <div class="page" bind:this={page.element}>
                <svelte:component this={page.component}/>
            </div>
        {/each}
    </div>
    {#if show_navigation}
        <div class="nav">
            <PageSliderNav {pages} bind:total_slide_progress bind:relative_slide_progress bind:current_page_index
                           bind:page_index_diff/>
        </div>
    {/if}
</div>

<style>
    .main {
        height: 100%;
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
    }

    .slides {
        display: flex;

        overflow-x: auto;
        scroll-snap-type: x mandatory;

        scroll-behavior: auto;

        -webkit-overflow-scrolling: touch;

        height: 100%;
        width: 100%;

        /*flex: auto;*/

    }

    .slides.animated {
        scroll-behavior: smooth;
    }

    .slides::-webkit-scrollbar {
        display: none;
    }


    .page {
        scroll-snap-align: start;
        flex-shrink: 0;

        width: 100%;
        height: 100%;
        position: relative;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .nav {
        position: relative;
        width: 100%;
        /*height: 3rem;*/
        flex: auto;
    }

</style>
