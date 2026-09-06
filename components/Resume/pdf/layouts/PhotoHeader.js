/**
 * Two-Column-Photo-Header layout — inspired by Korina Villanueva style.
 *
 * Structure (left-to-right DOM order for ATS):
 *   [Header band: circular photo + name + tagline + contact links]
 *   [Main column: summary, experience, education, projects]
 *   [Side column: skills, languages, certifications]
 *
 * Structural details:
 *   - Header band: full-width dark accent with circular photo, centered name
 *   - Contact links with text labels in a horizontal row
 *   - Two-column body below: main left, narrower right column
 *   - Section titles uppercase with underline
 */
import { Text, View, Document, Page, Link, StyleSheet } from '@react-pdf/renderer';
import { getLayoutTheme, contactRows } from './normalize';
import {
    font,
    RichSegments,
    Href,
    SectionTitle,
    Bullet,
    Description,
    dateRange,
    InitialsCircle,
    ContactItem,
} from './primitives';

const PhotoHeaderLayout = ({ data, theme, size, padding }) => {
    const f = data.font;
    const contacts = contactRows(data.contact);
    const MAIN_W = '62%';
    const SIDE_W = '38%';
    const p = padding || 24;

    return (
        <Document language="en">
            <Page size={size} style={{ backgroundColor: theme.bg, padding: 0 }}>
                {/* ═══ HEADER BAND (ATS: text before columns) ═══ */}
                <View style={{ backgroundColor: theme.bandBg, padding: p, paddingBottom: p - 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                        <InitialsCircle name={data.name} theme={theme} size={56} />
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: f?.nameSize || 22, fontFamily: font(null, true, f), color: theme.bandText }}>
                                {data.name}
                            </Text>
                            {data.title ? (
                                <Text style={{ fontSize: 11, fontFamily: font(null, false, f), color: theme.bandMuted, marginTop: 2 }}>
                                    {data.title}
                                </Text>
                            ) : null}
                            {/* Contact row with labels */}
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                                {contacts.map((row, i) => (
                                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                                        <Text style={{ fontSize: 8, fontFamily: font(null, false, f), color: theme.bandMuted }}>{row.label}:</Text>
                                        {row.href ? (
                                            <Link src={row.href} style={{ fontSize: 8, fontFamily: font(null, false, f), color: theme.bandText, textDecoration: 'none' }}>
                                                {row.value}
                                            </Link>
                                        ) : (
                                            <Text style={{ fontSize: 8, fontFamily: font(null, false, f), color: theme.bandText }}>{row.value}</Text>
                                        )}
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>

                {/* ═══ TWO-COLUMN BODY ═══ */}
                <View style={{ flexDirection: 'row', padding: p, paddingTop: 12, flex: 1 }}>
                    {/* ═══ MAIN COLUMN (left) ═══ */}
                    <View style={{ width: MAIN_W, paddingRight: 16 }}>
                        {/* Summary */}
                        {data.summary ? (
                            <View style={{ marginBottom: f?.sectionMarginAfter || 4 }}>
                                <SectionTitle title="Summary" theme={theme} f={f} />
                                <Text style={{ fontSize: f?.descSize || f?.size || 10, fontFamily: font(null, false, f), color: theme.text, lineHeight: 1.4 }}>
                                    <RichSegments text={data.summary} theme={theme} f={f} />
                                </Text>
                            </View>
                        ) : null}

                        {/* Experience */}
                        {data.experience.length > 0 ? (
                            <View style={{ marginBottom: f?.sectionMarginAfter || 4 }}>
                                <SectionTitle title="Experience" theme={theme} f={f} />
                                {data.experience.map((exp, i) => (
                                    <View key={i} style={{ marginBottom: 6 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                            <Text style={{ flex: 1, fontSize: f?.size || 11, fontFamily: font(null, true, f), color: theme.text }}>
                                                {exp.role}
                                            </Text>
                                            <Text style={{ fontSize: 9, fontFamily: font(null, false, f), color: theme.light, fontStyle: 'italic' }}>
                                                {dateRange(exp.start, exp.end)}
                                            </Text>
                                        </View>
                                        <Text style={{ fontSize: 10, fontFamily: font(null, false, f), color: theme.light, marginBottom: 2 }}>
                                            {exp.company}{exp.location ? ` — ${exp.location}` : ''}
                                        </Text>
                                        <Description text={exp.description} bullets={exp.bullets} theme={theme} f={f} />
                                    </View>
                                ))}
                            </View>
                        ) : null}

                        {/* Education */}
                        {data.education.length > 0 ? (
                            <View style={{ marginBottom: f?.sectionMarginAfter || 4 }}>
                                <SectionTitle title="Education" theme={theme} f={f} />
                                {data.education.map((edu, i) => (
                                    <View key={i} style={{ marginBottom: 6 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                            <Text style={{ flex: 1, fontSize: f?.size || 11, fontFamily: font(null, true, f), color: theme.text }}>
                                                {edu.degree}
                                            </Text>
                                            <Text style={{ fontSize: 9, fontFamily: font(null, false, f), color: theme.light, fontStyle: 'italic' }}>
                                                {dateRange(edu.start, edu.end)}
                                            </Text>
                                        </View>
                                        <Text style={{ fontSize: 10, fontFamily: font(null, false, f), color: theme.light }}>
                                            {edu.institution}{edu.gpa ? ` (${edu.gpa})` : ''}{edu.location ? ` — ${edu.location}` : ''}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ) : null}

                        {/* Projects */}
                        {data.projects.length > 0 ? (
                            <View style={{ marginBottom: f?.sectionMarginAfter || 4 }}>
                                <SectionTitle title="Projects" theme={theme} f={f} />
                                {data.projects.map((proj, i) => (
                                    <View key={i} style={{ marginBottom: 6 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                            <Text style={{ flex: 1, fontSize: f?.size || 11, fontFamily: font(null, true, f), color: theme.text }}>
                                                {proj.title}
                                            </Text>
                                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                                {proj.github ? <Href href={proj.github} theme={theme} f={f}>GitHub</Href> : null}
                                                {proj.live ? <Href href={proj.live} theme={theme} f={f}>Live</Href> : null}
                                            </View>
                                        </View>
                                        <Description text={proj.description} bullets={proj.bullets} theme={theme} f={f} />
                                    </View>
                                ))}
                            </View>
                        ) : null}
                    </View>

                    {/* ═══ SIDE COLUMN (right, rendered after main in DOM) ═══ */}
                    <View style={{ width: SIDE_W, paddingLeft: 12, borderLeftWidth: 1, borderLeftStyle: 'solid', borderLeftColor: theme.border }}>
                        {/* Skills */}
                        {data.flatSkills.length > 0 ? (
                            <View style={{ marginBottom: 12 }}>
                                <SectionTitle title="Skills" theme={theme} f={f} />
                                {data.skills.map((group, i) => (
                                    <View key={i} style={{ marginBottom: 4 }}>
                                        {group.title ? (
                                            <Text style={{ fontSize: f?.size || 10, fontFamily: font(null, true, f), color: theme.accent }}>{group.title}:</Text>
                                        ) : null}
                                        <Text style={{ fontSize: f?.descSize || f?.size || 9, fontFamily: font(null, false, f), color: theme.text }}>
                                            <RichSegments text={group.skills} theme={theme} f={f} />
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ) : null}

                        {/* Languages */}
                        {data.languages.length > 0 ? (
                            <View style={{ marginBottom: 12 }}>
                                <SectionTitle title="Languages" theme={theme} f={f} />
                                {data.languages.map((lang, i) => (
                                    <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                                        <Text style={{ fontSize: 10, fontFamily: font(null, false, f), color: theme.text }}>{lang.language}</Text>
                                        <Text style={{ fontSize: 9, fontFamily: font(null, false, f), color: theme.light }}>{lang.proficiency}</Text>
                                    </View>
                                ))}
                            </View>
                        ) : null}

                        {/* Certifications */}
                        {data.certifications.length > 0 ? (
                            <View style={{ marginBottom: 12 }}>
                                <SectionTitle title="Certifications" theme={theme} f={f} />
                                {data.certifications.map((cert, i) => (
                                    <View key={i} style={{ marginBottom: 4 }}>
                                        <Text style={{ fontSize: f?.size || 10, fontFamily: font(null, true, f), color: theme.text }}>{cert.title}</Text>
                                        <Text style={{ fontSize: 9, fontFamily: font(null, false, f), color: theme.light }}>
                                            {cert.issuer}{cert.date ? ` — ${dateRange(cert.date, null)}` : ''}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ) : null}

                        {/* References */}
                        {data.references.length > 0 ? (
                            <View>
                                <SectionTitle title="References" theme={theme} f={f} />
                                {data.references.map((ref, i) => (
                                    <View key={i} style={{ marginBottom: 4 }}>
                                        <Text style={{ fontSize: f?.size || 10, fontFamily: font(null, true, f), color: theme.text }}>{ref.name}</Text>
                                        <Text style={{ fontSize: 9, fontFamily: font(null, false, f), color: theme.light }}>
                                            {ref.role}{ref.role && ref.company ? ' at ' : ''}{ref.company}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ) : null}
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default PhotoHeaderLayout;
