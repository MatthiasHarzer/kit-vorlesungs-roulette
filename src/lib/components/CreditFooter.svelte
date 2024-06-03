<script>
    import svelte_icon from "../../assets/imgs/svelte.png";
    import github_icon from "../../assets/imgs/github.png";
</script>

<div class="footer">
    <div class="version">
        <span>v{APP_VERSION}</span>
    </div>
    <div class="made-by">
        <span>
            Made by <a href="https://matthiasharzer.de" target="_blank"
                >Matthias Harzer</a
            >
            with
            <a href="https://svelte.dev" target="_blank"
                ><img
                    alt="Svelte"
                    class="svelte"
                    src={svelte_icon}
                    height="1443"
                    width="1200"
                /></a
            >
        </span>
    </div>
    <div class="github">
        <a
            href="https://github.com/MatthiasHarzer/kit-vorlesungs-roulette"
            target="_blank"
        >
            This project is open source
            <img alt="Github" src={github_icon} height="379" width="379" />
        </a>
    </div>
</div>

<style>
    .footer {
        border-top: 1px solid grey;
        padding: 0.5rem 0.5rem 0.6rem 0.5rem;

        bottom: 0;
        /*margin-top: auto;*/
        color: #b2b2b2;

        font-size: 0.9rem;
        justify-content: space-between;
        position: relative;
    }

    .footer > * {
        display: block;
        flex-direction: column;
        align-items: center;
        float: left;
    }

    .footer div > * {
        display: flex;
        align-items: center;
    }

    .footer img {
        height: 1.2rem;
        width: auto;
        margin-left: 0.5rem;
    }

    .footer img.svelte {
        margin-left: 0.1rem;
    }

    .footer a {
        color: white;
        margin: 0 3px;
    }

    .footer .version{
        position: absolute;
        bottom: 0;
        left: 10px;
        opacity: 0.7;
        font-size: 0.7em;
    }

    .footer .github {
        float: right;
        margin-left: 15px;
    }
</style>
