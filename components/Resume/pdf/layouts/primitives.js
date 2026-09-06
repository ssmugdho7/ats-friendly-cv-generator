/**
 * Shared PDF primitives used by ALL five layout components.
 * These are thin wrappers over @react-pdf/renderer primitives.
 * Every component keeps text real/selectable (ATS-safe).
 */
import { Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import { parseRich, normUrl } from '@/utils/richText';

const FONT_MAP = {
    Arial: 'Helvetica',
    'Courier-New': 'Courier',
    Garamond: 'Times-Roman',
    Georgia: 'Times-Roman',
    Palatino: 'Times-Roman',
    Verdana: 'Helvetica',
    Tahoma: 'Helvetica',
};

export const getFont = (family, bold) => {
    const base = FONT_MAP[family] || family || 'Times-Roman';
    if (bold) {
        if (base === 'Helvetica') return 'Helvetica-Bold';
        if (base === 'Courier') return 'Courier-Bold';
        return 'Times-Bold';
    }
    return base;
};

export const font = (fam, bold, f) => getFont(fam || f?.family, bold);

// ─── Rich text segments (ATS: real text, never image) ───────────────
export const RichSegments = ({ text, theme, f }) => (
    <>
        {parseRich(text).map((seg, i) => (
            <Text
                key={i}
                style={{
                    fontFamily: seg.bold ? font(null, true, f) : font(null, false, f),
                    color: seg.color || theme.text,
                }}
            >
                {seg.t}
            </Text>
        ))}
    </>
);

// ─── Hyperlink (ATS: always has visible text label) ─────────────────
export const Href = ({ href, children, theme, f }) => {
    if (!href) return null;
    const url = normUrl(href);
    return (
        <Link src={url} style={{ color: theme.accent, textDecoration: 'none', fontFamily: font(null, false, f) }}>
            {children}
        </Link>
    );
};

// ─── Section title with optional icon badge text ────────────────────
// iconChar is a Unicode character rendered beside the title (ATS: paired with text).
export const SectionTitle = ({ title, theme, f, iconChar, color }) => (
    <>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: f?.sectionMarginBefore ?? 6 }}>
            {iconChar ? (
                <View
                    style={{
                        width: 14,
                        height: 14,
                        borderRadius: 3,
                        backgroundColor: color || theme.accent,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text style={{ fontSize: 8, color: '#ffffff', fontFamily: font(null, true, f) }}>{iconChar}</Text>
                </View>
            ) : null}
            <Text
                style={{
                    textTransform: 'uppercase',
                    color: color || theme.accent,
                    fontSize: f?.titleSize || 13,
                    fontFamily: font(null, true, f),
                }}
            >
                {title}
            </Text>
        </View>
        <View style={{ height: 1, margin: '2px 0 4px 0', backgroundColor: theme.border }} />
    </>
);

// ─── Section title with left border accent (sidebar use) ────────────
export const SidebarSectionTitle = ({ title, theme, f, color }) => (
    <>
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 8,
                marginBottom: 4,
                paddingBottom: 4,
                borderBottomWidth: 1,
                borderBottomStyle: 'solid',
                borderBottomColor: theme.sidebarRule,
            }}
        >
            <Text
                style={{
                    textTransform: 'uppercase',
                    fontSize: f?.titleSize || 12,
                    fontFamily: font(null, true, f),
                    color: color || theme.sidebarText,
                    letterSpacing: 0.5,
                }}
            >
                {title}
            </Text>
        </View>
    </>
);

// ─── Bullet list item (ATS: real bullet char + real text) ───────────
export const Bullet = ({ children, theme, f, color }) => (
    <View style={{ flexDirection: 'row', marginBottom: 2 }}>
        <View style={{ width: 10, paddingTop: 1 }}>
            <Text style={{ fontSize: f?.descSize || f?.size || 9, fontFamily: font(null, false, f), color: color || theme.text }}>{'\u2022'}</Text>
        </View>
        <View style={{ flex: 1 }}>
            <Text style={{ fontSize: f?.descSize || f?.size || 9, fontFamily: font(null, false, f), color: color || theme.text }}>
                {children}
            </Text>
        </View>
    </View>
);

// ─── Description block (lines or bullets) ───────────────────────────
export const Description = ({ text, bullets, theme, f, color }) => {
    const lines = String(text || '')
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);
    if (!lines.length) return null;
    const descSize = f?.descSize || f?.size || 10;

    if (bullets === false) {
        return (
            <View style={{ marginTop: 2 }}>
                {lines.map((line, i) => (
                    <Text key={i} style={{ fontSize: descSize, fontFamily: font(null, false, f), marginTop: 2, color: color || theme.text }}>
                        <RichSegments text={line} theme={theme} f={f} />
                    </Text>
                ))}
            </View>
        );
    }
    return (
        <View style={{ marginTop: 2 }}>
            {lines.map((line, i) => (
                <Bullet key={i} theme={theme} f={f} color={color}>
                    <RichSegments text={line} theme={theme} f={f} />
                </Bullet>
            ))}
        </View>
    );
};

// ─── Date range string ──────────────────────────────────────────────
import formatDate from '@/utils/formatDate';

export const dateRange = (start, end) => {
    const s = formatDate(start);
    const e = formatDate(end);
    if (s && e) return `${s} – ${e}`;
    if (s) return `${s} – Present`;
    if (e) return e;
    return '';
};

// ─── Initials circle (used as photo placeholder) ────────────────────
export const InitialsCircle = ({ name, theme, size = 48 }) => {
    const initials = String(name || '')
        .trim()
        .split(/\s+/)
        .map(w => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || '•';
    return (
        <View
            style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: theme.sidebarBg || theme.accent,
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Text style={{ fontSize: size * 0.38, fontFamily: font(null, true), color: '#ffffff' }}>{initials}</Text>
        </View>
    );
};

// ─── Skill pill (compact badge) ─────────────────────────────────────
export const SkillPill = ({ text, theme, f }) => (
    <View
        style={{
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
            backgroundColor: theme.accent + '18',
            borderWidth: 0.5,
            borderColor: theme.accent + '40',
        }}
    >
        <Text style={{ fontSize: f?.descSize || f?.size || 9, fontFamily: font(null, false, f), color: theme.text }}>
            {text}
        </Text>
    </View>
);

// ─── Stat box (for Icon-Stat-Highlight layout) ──────────────────────
export const StatBox = ({ label, value, theme, f }) => (
    <View
        style={{
            alignItems: 'center',
            padding: 8,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: theme.statBorder,
            backgroundColor: theme.statBg,
            minWidth: 80,
        }}
    >
        <Text style={{ fontSize: 18, fontFamily: font(null, true, f), color: theme.statValue }}>{value}</Text>
        <Text style={{ fontSize: 8, fontFamily: font(null, false, f), color: theme.light, marginTop: 2, textTransform: 'uppercase' }}>{label}</Text>
    </View>
);

// ─── Timeline dot (for Minimal-Timeline layout) ─────────────────────
export const TimelineDot = ({ theme, size = 8 }) => (
    <View
        style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: theme.timelineDot,
            marginTop: 4,
        }}
    />
);

// ─── Contact row with label + value (ATS: label always present) ─────
export const ContactItem = ({ label, value, href, theme, f }) => (
    <View style={{ flexDirection: 'row', marginBottom: 3, alignItems: 'center', gap: 4 }}>
        <Text style={{ fontSize: 9, fontFamily: font(null, false, f), color: theme.light, minWidth: 48 }}>{label}:</Text>
        {href ? (
            <Link src={normUrl(href)} style={{ fontSize: 9, fontFamily: font(null, false, f), color: theme.accent, textDecoration: 'none' }}>
                {value}
            </Link>
        ) : (
            <Text style={{ fontSize: 9, fontFamily: font(null, false, f), color: theme.text }}>{value}</Text>
        )}
    </View>
);
