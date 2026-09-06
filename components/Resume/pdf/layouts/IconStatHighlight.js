/**
 * Icon-Stat-Highlight layout — inspired by Karan Malhotra style.
 *
 * Structure (left-to-right DOM order for ATS):
 *   [Header: name + tagline + contact links]
 *   [Achievement stat boxes row (always real text, never images)]
 *   [Main column: experience, education, projects]
 *   [Side column: skills, certifications, languages]
 *
 * Structural details:
 *   - Stat/achievement boxes with number + label, bordered, accent-colored value
 *   - Section headers have a small colored square badge with letter (icon+text)
 *   - Thin rule line under section headers
 *   - Right column separated by vertical border
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
    ContactItem,
    StatBox,
} from './primitives';

const SidebarSection = ({ title, theme, f, children }) => (
    <View style={{ marginBottom: 12 }}>
        <SidebarTitle title={title} theme={theme} f={f} />
        {children}
    </View>
);

const SidebarTitle = ({ title, theme, f }) => (
    <>
        <Text
            style={{
                textTransform: 'uppercase',
                fontSize: f?.titleSize || 12,
                fontFamily: font(null, true, f),
                color: theme.accent,
                marginTop: 8,
                marginBottom: 3,
            }}
        >
            {title}
        </Text>
        <View style={{ height: 1, backgroundColor: theme.border, marginBottom: 4 }} />
    </>
);

const IconStatHighlightLayout = ({ data, theme, size, padding }) => {
    const f = data.font;
    const contacts = contactRows(data.contact);
    const MAIN_W = '66%';
    const SIDE_W = '34%';
    const p = padding || 24;

    // Build stat boxes from achievements or auto-derived
    const stats = data.achievements.length > 0
        ? data.achievements
        : [
              { label: 'Experience', value: `${data.experience.length}+` },
              { label: 'Projects', value: `${data.projects.length}+` },
              { label: 'Skills', value: `${data.flatSkills.length}+` },
              { label: 'Certifications', value: `${data.certifications.length}` },
          ];

    return (
        <Document language="en">
            <Page size={size} style={{ backgroundColor: theme.bg, padding: 0 }}>
                {/* ═══ HEADER ═══ */}
                <View style={{ padding: p, paddingBottom: 8 }}>
                    <Text style={{ fontSize: f?.nameSize || 22, fontFamily: font(null, true, f), color: theme.accent }}>
                        {data.name}
                    </Text>
                    {data.title ? (
                        <Text style={{ fontSize: 11, fontFamily: font(null, false, f), color: theme.light, marginTop: 2 }}>
                            {data.title}
                        </Text>
                    ) : null}
                    {/* Contact row with labels */}
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
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

                {/* ═══ STAT BOXES ═══ */}
                {stats.length > 0 ? (
                    <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: p, paddingBottom: 12, flexWrap: 'wrap' }}>
                        {stats.map((stat, i) => (
                            <StatBox key={i} label={stat.label} value={stat.value} theme={theme} f={f} />
                        ))}
                    </View>
                ) : null}

                {/* ═══ TWO-COLUMN BODY ═══ */}
                <View style={{ flexDirection: 'row', paddingHorizontal: p, flex: 1 }}>
                    {/* ═══ MAIN COLUMN (left) ═══ */}
                    <View style={{ width: MAIN_W, paddingRight: 16 }}>
                        {/* Experience */}
                        {data.experience.length > 0 ? (
                            <View style={{ marginBottom: f?.sectionMarginAfter || 4 }}>
                                <SectionTitle title="Experience" theme={theme} f={f} iconChar="E" />
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
                                <SectionTitle title="Education" theme={theme} f={f} iconChar="D" />
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
                                <SectionTitle title="Projects" theme={theme} f={f} iconChar="P" />
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

                    {/* ═══ SIDE COLUMN (right) ═══ */}
                    <View style={{ width: SIDE_W, paddingLeft: 12, borderLeftWidth: 1, borderLeftStyle: 'solid', borderLeftColor: theme.border }}>
                        {/* Skills */}
                        {data.flatSkills.length > 0 ? (
                            <SidebarSection title="Skills" theme={theme} f={f}>
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
                            </SidebarSection>
                        ) : null}

                        {/* Certifications */}
                        {data.certifications.length > 0 ? (
                            <SidebarSection title="Certifications" theme={theme} f={f}>
                                {data.certifications.map((cert, i) => (
                                    <View key={i} style={{ marginBottom: 4 }}>
                                        <Text style={{ fontSize: 9, fontFamily: font(null, true, f), color: theme.text }}>{cert.title}</Text>
                                        <Text style={{ fontSize: 8, fontFamily: font(null, false, f), color: theme.light }}>
                                            {cert.issuer}{cert.date ? ` — ${dateRange(cert.date, null)}` : ''}
                                        </Text>
                                    </View>
                                ))}
                            </SidebarSection>
                        ) : null}

                        {/* Languages */}
                        {data.languages.length > 0 ? (
                            <SidebarSection title="Languages" theme={theme} f={f}>
                                {data.languages.map((lang, i) => (
                                    <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                                        <Text style={{ fontSize: 10, fontFamily: font(null, false, f), color: theme.text }}>{lang.language}</Text>
                                        <Text style={{ fontSize: 9, fontFamily: font(null, false, f), color: theme.light }}>{lang.proficiency}</Text>
                                    </View>
                                ))}
                            </SidebarSection>
                        ) : null}
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default IconStatHighlightLayout;
