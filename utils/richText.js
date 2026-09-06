/**
 * Lightweight rich-text markers used across editors and renderers.
 *
 *   **bold**                      → bold
 *   [color=#ff0000]text[/color]   → colored text (3 or 6 hex digits)
 *
 * Markers can nest one level deep (bold inside color and vice versa).
 * Unknown/malformed markers are left untouched as plain text.
 */

const TOKEN_RE = /\*\*(.+?)\*\*|\[color=(#[0-9a-fA-F]{3,6})\](.+?)\[\/color\]/g;
const BOLD_INNER_RE = /\*\*(.+?)\*\*/g;
const COLOR_INNER_RE = /\[color=(#[0-9a-fA-F]{3,6})\](.+?)\[\/color\]/g;

function splitInner(text, innerRe, decorate) {
    const out = [];
    let last = 0;
    innerRe.lastIndex = 0;
    let m;
    while ((m = innerRe.exec(text))) {
        if (m.index > last) out.push({ t: text.slice(last, m.index), bold: false, color: null });
        out.push(decorate(m));
        last = m.index + m[0].length;
    }
    if (last < text.length) out.push({ t: text.slice(last), bold: false, color: null });
    return out.length ? out : [{ t: text, bold: false, color: null }];
}

/**
 * Parse a single line into styled segments: [{ t, bold, color }]
 * `color` is a `#rrggbb`-ish string or null.
 */
export function parseRich(input) {
    const text = input === null || input === undefined ? '' : String(input);
    const out = [];
    TOKEN_RE.lastIndex = 0;
    let last = 0;
    let m;
    while ((m = TOKEN_RE.exec(text))) {
        if (m.index > last) out.push({ t: text.slice(last, m.index), bold: false, color: null });
        if (m[1] !== undefined) {
            // **bold** — may contain a color marker inside
            splitInner(m[1], COLOR_INNER_RE, c => ({ t: c[2], bold: true, color: c[1] })).forEach(seg => {
                if (seg && seg.t) out.push({ t: seg.t, bold: true, color: seg.color || null });
            });
        } else {
            // [color=#x]...[/color] — may contain bold inside
            splitInner(m[3], BOLD_INNER_RE, b => ({ t: b[1], bold: true, color: m[2] })).forEach(seg =>
                out.push(seg.t ? { t: seg.t, bold: seg.bold, color: seg.color || m[2] } : null),
            );
        }
        last = m.index + m[0].length;
    }
    if (last < text.length) out.push({ t: text.slice(last), bold: false, color: null });
    return out.filter(s => s && s.t);
}

/** Strip all markers, returning plain text (useful for inputs/titles). */
export function stripRich(input) {
    return parseRich(input)
        .map(s => s.t)
        .join('');
}

/** Normalize a user-typed URL so links actually open (adds https:// when missing). */
export function normUrl(url) {
    if (!url) return '';
    const u = String(url).trim();
    if (!u) return '';
    if (/^(https?:\/\/|mailto:|tel:)/i.test(u)) return u;
    return `https://${u}`;
}
