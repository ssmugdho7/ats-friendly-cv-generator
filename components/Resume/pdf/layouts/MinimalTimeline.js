/**
 * Minimal-Timeline layout — inspired by Timothy Ricketts style.
 *
 * Structure (left-to-right DOM order for ATS):
 *   [Name + tagline + contact in header]
 *   [Full-width single column: all sections in order]
 *   [Experience entries connected by vertical timeline lines + dot markers]
 *
 * Structural details:
 *   - Single full-width column (no sidebar tricks)
 *   - Each experience entry has a small filled circle (dot) and a vertical
 *     line segment connecting entries, creating a visual timeline
 *   - Timeline uses @react-pdf drawn elements (View with backgroundColor)
 *   - Section titles uppercase with thin underline
 *   - Contact links in a centered horizontal row with labels
 *   - Placeholders resolved against data model
 */
import { Text, View, Document, Page, Link, StyleSheet } from '@react-pdf/renderer';
import { getLayoutTheme, contactRows, resolvePlaceholders } from './normalize';
import {
    font,
    RichSegments,
    Href,
    SectionTitle,
    Bullet,
    Description,
    dateRange,
    ContactItem,
} from './primitives';
import { normUrl } from '@/utils/richText';

const resolve = (text, data) => resolvePlaceholders(text, data);

const TIMELINE_DOT_SIZE = 7;
const TIMELINE_LINE_W = 1;

const TimelineEntry = ({ entry, index, isLast, theme, f, showTimeline }) => (
    <View style={{ flexDirection: 'row', marginBottom: isLast ? 0 : 8 }}>
        {/* Timeline column */}
        {showTimeline ? (
            <View style={{ width: 18, alignItems: 'center', paddingTop: 3 }}>
                {/* Dot */}
                <View
                    style={{
                        width: TIMELINE_DOT_SIZE,
                        height: TIMELINE_DOT_SIZE,
                        borderRadius: TIMELINE_DOT_SIZE / 2,
                        backgroundColor: theme.timelineDot,
                    }}
                />
                {/* Vertical line */}
                {!isLast ? (
                    <View
                        style={{
                            flex: 1,
                            width: TIMELINE_LINE_W,
                            backgroundColor: theme.timelineLine,
                            marginTop: 2,
                            minHeight: 30,
                        }}
                    />
                ) : null}
            </View>
        ) : null}

        {/* Content */}
        <View style={{ flex: 1, paddingBottom: 4 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Text style={{ flex: 1, fontSize: f?.size || 11, fontFamily: font(null, true, f), color: theme.text }}>
                    {resolve(entry.role || entry.title || entry.degree || '', data)}
                </Text>
                <Text style={{ fontSize: 9, fontFamily: font(null, false, f), color: theme.light, fontStyle: 'italic' }}>
                    {dateRange(entry.start, entry.end || entry.date)}
                </Text>
            </View>
            {/* Sub line: company / institution / issuer */}
            {(entry.company || entry.institution || entry.issuer) ? (
                <Text style={{ fontSize: 10, fontFamily: font(null, false, f), color: theme.light, marginBottom: 2 }}>
                    {resolve(entry.company || entry.institution || entry.issuer, data)}
                    {entry.location ? ` — ${resolve(entry.location, data)}` : ''}
                </Text>
            ) : null}
            {entry.description ? (
                <Description text={resolve(entry.description, data)} bullets={entry.bullets} theme={theme} f={f} />
            ) : null}
            {entry.gpa ? (
                <Text style={{ fontSize: 9, fontFamily: font(null, false, f), color: theme.light }}>GPA: {resolve(entry.gpa, data)}</Text>
            ) : null}
        </View>
    </View>
);

const MinimalTimelineLayout = ({ data, theme, size, padding }) => {
    const f = data.font;
    const contacts = contactRows(data.contact);
    const p = padding || 30;

    return (
        <Document language="en">
            <Page size={size} style={{ backgroundColor: theme.bg, padding: p }}>
                {/* ═══ HEADER ═══ */}
                <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: f?.nameSize || 22, fontFamily: font(null, true, f), color: theme.accent, textAlign: 'center' }}>
                        {resolve(data.name, data)}
                    </Text>
                    {data.title ? (
                        <Text style={{ fontSize: 11, fontFamily: font(null, false, f), color: theme.light, textAlign: 'center', marginTop: 2 }}>
                            {resolve(data.title, data)}
                        </Text>
                    ) : null}
                    {/* Contact row with labels */}
                    <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
                        {contacts.map((row, i) => (
                            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                                <Text style={{ fontSize: 9, fontFamily: font(null, false, f), color: theme.light }}>{row.label}:</Text>
                                {row.href ? (
                                    <Link src={row.href} style={{ fontSize: 9, fontFamily: font(null, false, f), color: theme.accent, textDecoration: 'none' }}>
                                        {row.value}
                                    </Link>
                                ) : (
                                    <Text style={{ fontSize: 9, fontFamily: font(null, false, f), color: theme.text }}>{row.value}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                </View>

                {/* ═══ SUMMARY ═══ */}
                {data.summary ? (
                    <View style={{ marginBottom: f?.sectionMarginAfter || 6 }}>
                        <SectionTitle title="Summary" theme={theme} f={f} />
                        <Text style={{ fontSize: f?.descSize || f?.size || 10, fontFamily: font(null, false, f), color: theme.text, lineHeight: 1.4 }}>
                            <RichSegments text={resolve(data.summary, data)} theme={theme} f={f} />
                        </Text>
                    </View>
                ) : null}

                {/* ═══ EXPERIENCE (with timeline) ═══ */}
                {data.experience.length > 0 ? (
                    <View style={{ marginBottom: f?.sectionMarginAfter || 6 }}>
                        <SectionTitle title="Experience" theme={theme} f={f} />
                        {data.experience.map((exp, i) => (
                            <TimelineEntry
                                key={i}
                                entry={exp}
                                index={i}
                                isLast={i === data.experience.length - 1}
                                theme={theme}
                                f={f}
                                showTimeline
                            />
                        ))}
                    </View>
                ) : null}

                {/* ═══ EDUCATION (with timeline) ═══ */}
                {data.education.length > 0 ? (
                    <View style={{ marginBottom: f?.sectionMarginAfter || 6 }}>
                        <SectionTitle title="Education" theme={theme} f={f} />
                        {data.education.map((edu, i) => (
                            <TimelineEntry
                                key={i}
                                entry={edu}
                                index={i}
                                isLast={i === data.education.length - 1}
                                theme={theme}
                                f={f}
                                showTimeline
                            />
                        ))}
                    </View>
                ) : null}

                {/* ═══ PROJECTS ═══ */}
                {data.projects.length > 0 ? (
                    <View style={{ marginBottom: f?.sectionMarginAfter || 6 }}>
                        <SectionTitle title="Projects" theme={theme} f={f} />
                        {data.projects.map((proj, i) => (
                            <View key={i} style={{ marginBottom: 6, paddingLeft: 18 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <Text style={{ flex: 1, fontSize: f?.size || 11, fontFamily: font(null, true, f), color: theme.text }}>
                                        {resolve(proj.title, data)}
                                    </Text>
                                    <View style={{ flexDirection: 'row', gap: 8 }}>
                                        {proj.live ? <Href href={proj.live} theme={theme} f={f}>Live Demo</Href> : null}
                                        {proj.github ? <Href href={proj.github} theme={theme} f={f}>Repository</Href> : null}
                                    </View>
                                </View>
                                <Description text={resolve(proj.description, data)} bullets={proj.bullets} theme={theme} f={f} />
                            </View>
                        ))}
                    </View>
                ) : null}

                {/* ═══ SKILLS ═══ */}
                {data.flatSkills.length > 0 ? (
                    <View style={{ marginBottom: f?.sectionMarginAfter || 6 }}>
                        <SectionTitle title="Skills" theme={theme} f={f} />
                        {data.skills.map((group, i) => (
                            <View key={i} style={{ marginBottom: 3, paddingLeft: 18 }}>
                                {group.title ? (
                                    <Text style={{ fontSize: f?.size || 10, fontFamily: font(null, true, f), color: theme.accent }}>{group.title}: </Text>
                                ) : null}
                                <Text style={{ fontSize: f?.descSize || f?.size || 9, fontFamily: font(null, false, f), color: theme.text }}>
                                    <RichSegments text={resolve(group.skills, data)} theme={theme} f={f} />
                                </Text>
                            </View>
                        ))}
                    </View>
                ) : null}

                {/* ═══ CERTIFICATIONS ═══ */}
                {data.certifications.length > 0 ? (
                    <View style={{ marginBottom: f?.sectionMarginAfter || 6 }}>
                        <SectionTitle title="Certifications" theme={theme} f={f} />
                        {data.certifications.map((cert, i) => (
                            <View key={i} style={{ marginBottom: 4, paddingLeft: 18 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <Text style={{ flex: 1, fontSize: f?.size || 10, fontFamily: font(null, true, f), color: theme.text }}>
                                        {cert.url ? (
                                            <Link src={normUrl(cert.url)} style={{ color: theme.text, textDecoration: 'none' }}>
                                                {resolve(cert.title, data)}
                                            </Link>
                                        ) : (
                                            resolve(cert.title, data)
                                        )}
                                    </Text>
                                    <Text style={{ fontSize: 9, fontFamily: font(null, false, f), color: theme.light, fontStyle: 'italic' }}>
                                        {dateRange(cert.date, null)}
                                    </Text>
                                </View>
                                <Text style={{ fontSize: 9, fontFamily: font(null, false, f), color: theme.light }}>{resolve(cert.issuer, data)}</Text>
                            </View>
                        ))}
                    </View>
                ) : null}

                {/* ═══ LANGUAGES ═══ */}
                {data.languages.length > 0 ? (
                    <View style={{ marginBottom: f?.sectionMarginAfter || 6 }}>
                        <SectionTitle title="Languages" theme={theme} f={f} />
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingLeft: 18 }}>
                            {data.languages.map((lang, i) => (
                                <View key={i}>
                                    <Text style={{ fontSize: 10, fontFamily: font(null, true, f), color: theme.text }}>{lang.language}</Text>
                                    <Text style={{ fontSize: 9, fontFamily: font(null, false, f), color: theme.light }}>{lang.proficiency}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ) : null}

                {/* ═══ REFERENCES ═══ */}
                {data.references.length > 0 ? (
                    <View>
                        <SectionTitle title="References" theme={theme} f={f} />
                        {data.references.map((ref, i) => (
                            <View key={i} style={{ marginBottom: 4, paddingLeft: 18 }}>
                                <Text style={{ fontSize: f?.size || 10, fontFamily: font(null, true, f), color: theme.text }}>{ref.name}</Text>
                                <Text style={{ fontSize: 9, fontFamily: font(null, false, f), color: theme.light }}>
                                    {ref.role}{ref.role && ref.company ? ' at ' : ''}{ref.company}
                                </Text>
                            </View>
                        ))}
                    </View>
                ) : null}
            </Page>
        </Document>
    );
};

export default MinimalTimelineLayout;
