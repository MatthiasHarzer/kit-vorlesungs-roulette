import {VALID_TIMES} from "../types";


export const isBackgroundClick = e => {
    try {
        return e.srcElement.classList.contains("bg") || false;
    } catch {
        return false;
    }
}


export const format_date = (date: Date, formatString: string) => {
    var YYYY, YY, MMMM, MMM, MM, M, DDDD, DDD, DD, D, hhhh, hhh, hh, h, mm, m, ss, s, ampm, AMPM, dMod, th, ms;
    YY = ((YYYY = date.getFullYear()) + "").slice(-2);
    MM = (M = date.getMonth() + 1) < 10 ? ('0' + M) : M;
    MMM = (MMMM = ["Jan.", "Feb.", "März", "April", "Mai", "Juni", "Juli", "Aug.", "Sept.", "Okt.", "Nov.", "Dez."][M - 1]).substring(0, 3);
    DD = (D = date.getDate()) < 10 ? ('0' + D) : D;
    DDD = (DDDD = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"][date.getDay()]).substring(0, 3);
    th = (D >= 10 && D <= 20) ? 'th' : ((dMod = D % 10) == 1) ? 'st' : (dMod == 2) ? 'nd' : (dMod == 3) ? 'rd' : 'th';
    formatString = formatString.replace("#YYYY#", YYYY).replace("#YY#", YY).replace("#MMMM#", MMMM).replace("#MMM#", MMM).replace("#MM#", MM).replace("#M#", M).replace("#DDDD#", DDDD).replace("#DDD#", DDD).replace("#DD#", DD).replace("#D#", D).replace("#th#", th);
    h = (hhh = date.getHours());
    if (h == 0) h = 24;
    if (h > 12) h -= 12;
    hh = h < 10 ? ('0' + h) : h;
    hhhh = hhh < 10 ? ('0' + hhh) : hhh;
    AMPM = (ampm = hhh < 12 ? 'am' : 'pm').toUpperCase();
    mm = (m = date.getMinutes()) < 10 ? ('0' + m) : m;
    ss = (s = date.getSeconds()) < 10 ? ('0' + s) : s;
    ms = date.getMilliseconds();
    return formatString.replace("#hhhh#", hhhh).replace("#hhh#", hhh).replace("#hh#", hh).replace("#h#", h).replace("#mm#", mm).replace("#m#", m).replace("#ss#", ss).replace("#s#", s).replace("#ampm#", ampm).replace("#AMPM#", AMPM).replace("#ms#", ms);

}

export const get_nearest_time_from_now = (): string => {
    const now = Date.now();
    const hours = new Date(now).getHours();
    const minutes_now = new Date(now).getMinutes() + hours * 60;

    let minutes = VALID_TIMES.reduce((prev, curr) => {
        // @ts-ignore
        const minutes_curr = curr.split(":")[0] * 60 + curr.split(":")[1] * 1;
        return (Math.abs(minutes_curr - minutes_now) < Math.abs(prev - minutes_now) ? minutes_curr : prev);
    }, 0);

    if (minutes == 0) {
        minutes = 8 * 60;
    }

    const zero_fill = (num: number): string => num < 10 ? "0" + num : num.toString();

    return `${zero_fill(Math.floor(minutes / 60))}:${zero_fill(minutes % 60)}`;
}
