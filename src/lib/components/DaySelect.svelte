<script lang="ts">
    import * as util from "../util/util";

    export let date: Date;

    const today = new Date();
    $: day_diff = util.get_day_diff(today, date);

    const DATE_FORMAT = "#DDD#. #DD#.#MM#.#YYYY#";

    const on_previous = () => {
        date = util.add_days(date, -1);
    };

    const on_next = () => {
        date = util.add_days(date, 1);
    };

    const on_today = () => {
        date = today;
    };
</script>

<div class="outer">
    <div class="main">
        <div class="day-select">
            <button class="material nav-btn previous" on:click={on_previous}>
                <span class="material-icons">double_arrow</span>
            </button>
            <div class="day-label">
                <span>{util.format_date(date, DATE_FORMAT)}</span>
                <span class="diff"
                    >({util.get_label_from_day_diff(day_diff)})</span
                >
            </div>
            <button class="material nav-btn next" on:click={on_next}>
                <span class="material-icons">double_arrow</span>
            </button>
        </div>
    </div>
</div>

<style>
    .outer {
        display: flex;
    }

    .day-select,
    .main {
        margin: auto;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 0.5em;
    }

    .day-label {
        /*width: 115px;*/
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        /*font-size: 1.5em;*/
        font-weight: bold;
    }

    .day-label .diff {
        color: #d7d7d7;
        font-size: 0.9em;
        font-weight: normal;
    }

    .nav-btn {
        margin: 0 10px;
    }

    .nav-btn span {
        font-size: 1.8em;
        color: #cecece;
    }

    .nav-btn.previous {
        transform: rotate(180deg);
        margin-left: 0;
    }
    .nav-btn.next {
        margin-right: 0;
    }

    .today-btn span {
        font-size: 1.8em;
        color: #cecece;
    }
</style>
