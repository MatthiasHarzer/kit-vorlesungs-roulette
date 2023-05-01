<script lang="ts">
    import type {Page} from "./page";
    import {onMount} from "svelte";


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


    onMount(() => {
        if (current_page_index >= pages.length) {
            current_page_index = pages.length - 1;
        }

        // This is to prevent the animation from triggering when the page is first loaded
        setTimeout(() => {
            animated = true;
            mounted = true;
        }, 100);

        pages_element.onscroll = (e: Event) => {
            offset = pages_element.scrollLeft;
        }
    });

    let width = 0;
    let pages_element: HTMLElement;
    let animated = false;
    let offset = 0;
    let mounted = false;


    $: if (pages[current_page_index]?.element) {
        pages[current_page_index].element.scrollIntoView();
    }


    $: if(mounted) {
        total_slide_progress = offset / width;

        relative_slide_progress = total_slide_progress - Math.floor(total_slide_progress);

        if (total_slide_progress - Math.floor(total_slide_progress) == 0)
            current_page_index = Math.floor(total_slide_progress);

    }


</script>

<div bind:clientWidth={width} bind:this={pages_element} class="main" class:animated>
    <!--    <div bind:this={pages_element} class="pages" class:animation={$scroll_observer.direction === null && animation}-->
    <!--         style="&#45;&#45;target-offset: {total_offset}px;">-->
    {#each pages as page}
        <div class="page" style="--width: {width}px;" bind:this={page.element}>
            <svelte:component this={page.component}/>
        </div>
    {/each}
    <!--    </div>-->
</div>

<style>

    /*.main {*/
    /*    position: relative;*/
    /*    height: 100%;*/
    /*    width: 100%;*/
    /*}*/

    .main {
        /*position: absolute;*/
        /*height: 100%;*/
        /*!*width: 100%;*!*/
        /*!*right: -150%;*!*/
        /*left: calc(var(--target-offset) * -1);*/
        /*display: flex;*/
        /*flex-direction: row;*/
        /*transition: none;*/
        display: flex;

        overflow-x: auto;
        scroll-snap-type: x mandatory;

        scroll-behavior: auto;

        -webkit-overflow-scrolling: touch;

        height: 100%;
        width: 100%;

    }

    .main.animated {
        scroll-behavior: smooth;
    }

    .main::-webkit-scrollbar {
        display: none;
    }

    .pages.animation {
        /*transition: left 0.2s ease-in-out;*/
    }

    .page {
        /*position: relative;*/

        /*height: 100%;*/
        /*width: var(--width);*/
        /*background-color: var(--color);*/
        scroll-snap-align: start;
        flex-shrink: 0;

        width: 100%;
        height: 100%;
        transform-origin: center center;
        transform: scale(1);
        transition: transform 0.5s;
        position: relative;

        display: flex;
        justify-content: center;
        align-items: center;
        /*font-size: 100px;*/
    }

</style>
