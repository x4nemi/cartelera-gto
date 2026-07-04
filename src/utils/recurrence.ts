const FULL_DAYS = [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
];

const ABBR_DAYS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

const capitalize = (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1);

/** Minimum number of dated occurrences before an event is considered recurring. */
const MIN_OCCURRENCES = 4;
/** A recurring event repeats on at most this many distinct weekdays. */
const MAX_WEEKDAYS = 3;
/** Minimum span (in days) for an event to count as long-running / ongoing. */
const MIN_LONG_RUNNING_DAYS = 30;
/** Minimum span (in days) for a continuous daily run (e.g. an exhibition season). */
const MIN_CONTINUOUS_DAYS = 14;
/** A run counts as "continuous" when at least this share of the days are present. */
const CONTINUOUS_FILL_RATIO = 0.9;

const parseDates = (dates: string[] | null): Date[] =>
    (dates ?? [])
        .map((value) => new Date(value))
        .filter((date) => !Number.isNaN(date.getTime()));

/** Unique day timestamps (midnight), sorted ascending. */
const toDayKeys = (dates: string[] | null): number[] => {
    const keys = parseDates(dates).map((date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
    });
    return [...new Set(keys)].sort((a, b) => a - b);
};

/**
 * Infer a weekly recurrence pattern from an event's list of dates.
 * Returns the sorted, unique weekdays (0=Sunday..6=Saturday) when the dates
 * look like a repeating weekly schedule, or null for one-off events.
 *
 * Heuristic: the event must have several occurrences that fall on a small,
 * consistent set of weekdays, with each weekday repeating across weeks.
 */
export function getRecurrenceDays(dates: string[] | null): number[] | null {
    if (!dates || dates.length < MIN_OCCURRENCES) return null;

    const days = parseDates(dates).map((date) => date.getDay());

    if (days.length < MIN_OCCURRENCES) return null;

    const uniqueDays = [...new Set(days)];
    if (uniqueDays.length > MAX_WEEKDAYS) return null;

    // Each weekday must recur at least twice (i.e. span multiple weeks).
    const repeatsEnough = uniqueDays.every(
        (weekday) => days.filter((day) => day === weekday).length >= 2
    );
    if (!repeatsEnough) return null;

    return uniqueDays.sort((a, b) => a - b);
}

/** Whether an event's dates follow a repeating weekly pattern. */
export function isRecurring(dates: string[] | null): boolean {
    return getRecurrenceDays(dates) !== null;
}

/**
 * Whether an event runs over a long, continuous period (e.g. a month-long
 * exhibition). Weekly recurring events are excluded — they're handled by
 * getRecurrenceDays.
 */
export function isLongRunning(dates: string[] | null): boolean {
    if (getRecurrenceDays(dates) !== null) return false;

    const parsed = parseDates(dates);
    if (parsed.length < 2) return false;

    const times = parsed.map((date) => date.getTime());
    const spanDays = (Math.max(...times) - Math.min(...times)) / (1000 * 60 * 60 * 24);
    return spanDays >= MIN_LONG_RUNNING_DAYS;
}

/**
 * Whether an event is a long, (near-)continuous daily run such as an exhibition
 * or a season open most/every day. Unlike a recurring weekly schedule (whose end
 * date we fill in), these dates are the real, stated run, so the last date is a
 * genuine end and can be shown as "Hasta el <fecha>".
 */
export function isContinuousRun(dates: string[] | null): boolean {
    const keys = toDayKeys(dates);
    if (keys.length < 2) return false;

    const spanDays = Math.round((keys[keys.length - 1] - keys[0]) / 86400000);
    if (spanDays < MIN_CONTINUOUS_DAYS) return false;

    // Most calendar days within the span must be present (no weekly gaps).
    return keys.length >= (spanDays + 1) * CONTINUOUS_FILL_RATIO;
}

/** The latest day in an event's date list, or null when there are none. */
function getLastDate(dates: string[] | null): Date | null {
    const keys = toDayKeys(dates);
    if (keys.length === 0) return null;
    return new Date(keys[keys.length - 1]);
}

/** Format a date as a compact Spanish "day month" string, e.g. "15 jun". */
function formatDayMonth(date: Date): string {
    const day = date.getDate();
    const month = date
        .toLocaleDateString("es-MX", { month: "short" })
        .replace(".", "");
    return `${day} ${month}`;
}

/**
 * Build the label + kind shown on an ongoing-event card:
 *   - explicit end   -> { kind: "until",  text: "Hasta el 15 jun" }  (post stated
 *                        an end, passed as `endsOn`)
 *   - continuous run -> { kind: "until",  text: "Hasta el 5 jul" }   (real last
 *                        date of a long daily run, e.g. an exhibition)
 *   - weekly         -> { kind: "weekly", text: "Cada jueves" }
 *   - long-running   -> { kind: "ongoing", text: "En curso" }
 * Returns null when the event is none of these.
 */
export function getOngoingLabel(
    dates: string[] | null,
    endsOn?: string | null
): { kind: "weekly" | "until" | "ongoing"; text: string } | null {
    if (endsOn) {
        const end = new Date(endsOn);
        if (!Number.isNaN(end.getTime())) {
            return { kind: "until", text: `Hasta el ${formatDayMonth(end)}` };
        }
    }

    if (isContinuousRun(dates)) {
        const end = getLastDate(dates);
        if (end) return { kind: "until", text: `Hasta el ${formatDayMonth(end)}` };
    }

    const days = getRecurrenceDays(dates);
    if (days) return { kind: "weekly", text: formatRecurrence(days) };

    if (isLongRunning(dates)) return { kind: "ongoing", text: "En curso" };

    return null;
}

/** Whether an event belongs in the ongoing section. */
export function isOngoing(
    dates: string[] | null,
    endsOn?: string | null
): boolean {
    return getOngoingLabel(dates, endsOn) !== null;
}

/**
 * Build a human-readable Spanish recurrence label from weekday indexes
 * (0=Sunday..6=Saturday). Examples:
 *   [4]        -> "Cada jueves"
 *   [2, 3]     -> "Mar y mié"
 *   [1, 3, 5]  -> "Lun, mié y vie"
 */
export function formatRecurrence(daysOfWeek: number[]): string {
    const days = [...new Set(daysOfWeek)]
        .filter((day) => day >= 0 && day <= 6)
        .sort((a, b) => a - b);

    if (days.length === 0) return "Recurrente";
    if (days.length === 1) return `Cada ${FULL_DAYS[days[0]]}`;

    const labels = days.map((day, index) =>
        index === 0 ? capitalize(ABBR_DAYS[day]) : ABBR_DAYS[day]
    );

    if (labels.length === 2) return `${labels[0]} y ${labels[1]}`;
    return `${labels.slice(0, -1).join(", ")} y ${labels[labels.length - 1]}`;
}
