/**
 * Priority queue ordering for the patient list.
 *
 * Rule: Critical > High > Normal > Low. Within the same urgency,
 * patients are served in the order they arrived (FIFO), using
 * `createdAt` as the arrival timestamp.
 */

const URGENCY_LEVELS = ["Critical", "High", "Normal", "Low"];

const URGENCY_RANK = URGENCY_LEVELS.reduce((acc, level, index) => {
    acc[level] = index;
    return acc;
}, {});

function rankOf(urgency) {
    // Unknown/unexpected urgency values sort last rather than crashing.
    return URGENCY_RANK[urgency] ?? URGENCY_LEVELS.length;
}

/**
 * Returns a new, sorted array. Does not mutate the input.
 * Waiting patients are surfaced first (by priority + arrival time),
 * followed by patients currently being served, then completed ones —
 * so the "next up" patient is always predictable at the top of the
 * waiting group.
 */
function sortQueue(patients) {
    const statusOrder = { Serving: 0, Waiting: 1, Completed: 2 };

    return [...patients].sort((a, b) => {
        const statusDiff = (statusOrder[a.status] ?? 3) - (statusOrder[b.status] ?? 3);
        if (statusDiff !== 0) return statusDiff;

        const priorityDiff = rankOf(a.urgency) - rankOf(b.urgency);
        if (priorityDiff !== 0) return priorityDiff;

        return new Date(a.createdAt) - new Date(b.createdAt);
    });
}

module.exports = { URGENCY_LEVELS, sortQueue };
