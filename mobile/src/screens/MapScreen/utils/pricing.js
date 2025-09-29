// pricing.js (refined, modern, and readable)

/**
 * Convert the API's HTML-ish string into clean, line-based text.
 * - Decodes escaped angle brackets (\u003C, \u003E)
 * - Converts <br> tags to newlines
 * - Strips simple emphasis tags (e.g., <b>)
 * - Collapses multiple newlines/whitespace
 */
function normalizeHtmlToLines(html) {
    if (!html || typeof html !== 'string') return [];

    let text = html
        // Handle escaped < and >
        .replace(/\\u003C/g, '<')
        .replace(/\\u003E/g, '>')
        // Common HTML entities we care about
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        // Line breaks
        .replace(/<br\s*\/?>/gi, '\n')
        // Lightweight tag stripping for simple markup
        .replace(/<\/?b>/gi, '')
        .replace(/<\/?i>/gi, '')
        .replace(/<\/?strong>/gi, '')
        .replace(/<\/?em>/gi, '');

    // Strip any remaining tags (best effort; input is simple)
    text = text.replace(/<[^>]*>/g, '');

    // Split to lines and tidy up whitespace
    return text
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);
}

/**
 * Decide whether a line describes a "period" (e.g., "Mon–Fri: 9am–6pm")
 * We avoid lines that clearly look like prices or "free".
 */
function isPeriodLine(line) {
    const lower = line.toLowerCase();
    const looksLikePrice = /\$/.test(line);
    const mentionsFree = lower.includes('free');
    const hasColon = line.includes(':'); // common in "Mon–Fri: 9–6"
    return hasColon && !looksLikePrice && !mentionsFree;
}

/**
 * Decide whether a line describes a rate (contains $ or "free")
 */
function isRateLine(line) {
    const lower = line.toLowerCase();
    return /\$/.test(line) || lower.includes('free');
}

/**
 * Parse html_zone_rate into an ordered list of { period, rate } entries.
 * Example output:
 *   [{ period: "Mon–Fri: 9am–6pm", rate: "$2/hr" }, { period: "", rate: "Free after 6pm" }]
 */
export const parseHtmlZoneRate = (html) => {
    const lines = normalizeHtmlToLines(html);
    if (!lines.length) return [];

    const out = [];
    let current = null;

    for (const raw of lines) {
        const line = raw.trim();
        if (!line) continue;

        if (isPeriodLine(line)) {
            // Push any previous period that already captured a rate
            if (current) out.push(current);
            current = { period: line, rate: '' };
            continue;
        }

        if (isRateLine(line)) {
            if (current) {
                current.rate = line;
                out.push(current);
                current = null;
            } else {
                // Rate without a preceding period
                out.push({ period: '', rate: line });
            }
        }
    }

    // If we ended on a period that never got a rate, keep it only if it has one
    if (current?.rate) out.push(current);

    return out;
};

/**
 * Business rules for the "current" price badge:
 * - If no HTML, fall back to Zone or "Check signs".
 * - Sunday or outside 9–18 -> "FREE".
 * - If a section mentions "loading" -> prefer that rate (or "Free 20 mins").
 * - Otherwise, use the first parsed rate or "Check signs".
 *
 * Returns a short string suitable for compact UI (badges, list items).
 */
export const getCurrentPrice = (spot) => {
    const html = spot?.zone_info?.html_zone_rate;

    if (!html) {
        return spot?.zone_info?.price_zone
            ? `Zone ${spot.zone_info.price_zone}`
            : 'Check signs';
    }

    const sections = parseHtmlZoneRate(html);

    // Time-based quick rule: Sunday or outside 9–18 is free.
    const now = new Date();
    const day = now.getDay();   // 0 = Sunday
    const hour = now.getHours();
    const isSunday = day === 0;
    const isOutsideBusinessHours = hour < 9 || hour >= 18;

    if (isSunday || isOutsideBusinessHours) return 'FREE';

    // Prefer a "loading" window if present (common city wording)
    const loading = sections.find(s => s.period.toLowerCase().includes('loading'));
    if (loading) return loading.rate || 'Free 20 mins';

    // Otherwise, take the first rate we parsed
    return sections[0]?.rate || 'Check signs';
};
