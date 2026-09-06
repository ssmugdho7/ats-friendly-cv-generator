/**
 * Compact-Sidebar layout — dense single-page variant.
 *
 * Structure (left-to-right DOM order for ATS):
 *   [Main column: name, tagline, summary, experience, education, projects]
 *   [Sidebar: contact, skills, languages, certifications, references]
 *
 * Structural details:
 *   - Narrow sidebar (28%) with a subtle tinted background
 *   - Circular photo with initials
 *   - Very compact spacing (smaller margins, tighter rows)
 *   - Section titles with left border accent
 *   - Skill pills in the sidebar
 *   - Designed for dense single-page resumes
 */
import { Text, View, Document, Page, Link, StyleSheet } from '@react-pdf/renderer';
import { getLayoutTheme, contactRows } from './normalize';
import {
    font,
    RichSegments,
    Href,
    SidebarSectionTitle,
    Bullet,
    Description,
    dateRange,
    InitialsCircle,
    SkillPill,
    ContactItem,
} from './primitives';

const CompactMainSection = ({ title, theme, f, children }) => (
    <View style={{ marginBottom: 6 }}>
        <Text
            style={{
                textTransform: 'uppercase',
                fontSize: f?.titleSize || 11,
                fontFamily: font(null, true, f),
                color: theme.accent,
                marginBottom: 3,
                paddingBottom: 2,
                borderBottomWidth: 1,
                borderBottomStyle: 'solid',
                borderBottomColor: theme.border,
            }}
        >
            {title}
        </Text>
        {children}
    </View>
);

const CompactSidebarLayout = ({ data, theme, size, padding }) => {
    const f = data.font;
    const contacts = contactRows(data.contact);
    const SIDEBAR_W = '28%';
    const MAIN_W = '72%';
    const p = padding || 20;

    return (
        <Document language="en">
            <Page size={size} style={{ backgroundColor: theme.bg, padding: 0 }}>
                <View style={{ flexDirection: 'row', minHeight: '100%' }}>
                    {/* ═══ MAIN COLUMN (left, read first by ATS) ═══ */}
                    <View style={{ width: MAIN_W, padding: p }}>
                        {/* Name + tagline */}
                        <Text style={{ fontSize: f?.nameSize || 20, fontFamily: font(null, true, f), color: theme.accent }}>
                            {data.name}
                        </Text>
                        {data.title ? (
                            <Text style={{ fontSize: 10, fontFamily: font(null, false, f), color: theme.light, marginTop: 1, marginBottom: 6 }}>
                                {data.title}
                            </Text>
                        ) : null}

                        {/* Summary */}
                        {data.summary ? (
                            <CompactMainSection title="Summary" theme={theme} f={f}>
                                <Text style={{ fontSize: f?.descSize || f?.size || 9, fontFamily: font(null, false, f), color: theme.text, lineHeight: 1.35 }}>
                                    <RichSegments text={data.summary} theme={theme} f={f} />
                                </Text>
                            </CompactMainSection>
                        ) : null}

                        {/* Experience */}
                        {data.experience.length > 0 ? (
                            <CompactMainSection title="Experience" theme={theme} f={f}>
                                {data.experience.map((exp, i) => (
                                    <View key={i} style={{ marginBottom: 4 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                            <Text style={{ flex: 1, fontSize: f?.size || 10, fontFamily: font(null, true, f), color: theme.text }}>
                                                {exp.role}
                                            </Text>
                                            <Text style={{ fontSize: 8, fontFamily: font(null, false, f), color: theme.light, fontStyle: 'italic' }}>
                                                {dateRange(exp.start, exp.end)}
                                            </Text>
                                        </View>
                                        <Text style={{ fontSize: 9, fontFamily: font(null, false, f), color: theme.light, marginBottom: 1 }}>
                                            {exp.company}{exp.location ? ` — ${exp.location}` : ''}
                                        </Text>
                                        <Description text={exp.description} bullets={exp.bullets} theme={theme} f={f} />
                                    </View>
                                ))}
                            </CompactMainSection>
                        ) : null}

                        {/* Education */}
                        {data.education.length > 0 ? (
                            <CompactMainSection title="Education" theme={theme} f={f}>
                                {data.education.map((edu, i) => (
                                    <View key={i} style={{ marginBottom: 4 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                            <Text style={{ flex: 1, fontSize: f?.size || 10, fontFamily: font(null, true, f), color: theme.text }}>
                                                {edu.degree}
                                            </Text>
                                            <Text style={{ fontSize: 8, fontFamily: font(null, false, f), color: theme.light, fontStyle: 'italic' }}>
                                                {dateRange(edu.start, edu.end)}
                                            </Text>
                                        </View>
                                        <Text style={{ fontSize: 9, fontFamily: font(null, false, f), color: theme.light }}>
                                            {edu.institution}{edu.gpa ? ` (${edu.gpa})` : ''}{edu.location ? ` — ${edu.location}` : ''}
                                        </Text>
                                    </View>
                                ))}
                            </CompactMainSection>
                        ) : null}

                        {/* Projects */}
                        {data.projects.length > 0 ? (
                            <CompactMainSection title="Projects" theme={theme} f={f}>
                                {data.projects.map((proj, i) => (
                                    <View key={i} style={{ marginBottom: 4 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                            <Text style={{ flex: 1, fontSize: f?.size || 10, fontFamily: font(null, true, f), color: theme.text }}>
                                                {proj.title}
                                            </Text>
                                            <View style={{ flexDirection: 'row', gap: 6 }}>
                                                {proj.github ? <Href href={proj.github} theme={theme} f={f}>GitHub</Href> : null}
                                                {proj.live ? <Href href={proj.live} theme={theme} f={f}>Live</Href> : null}
                                            </View>
                                        </View>
                                        <Description text={proj.description} bullets={proj.bullets} theme={theme} f={f} />
                                    </View>
                                ))}
                            </CompactMainSection>
                        ) : null}
                    </View>

                    {/* ═══ SIDEBAR (right, read second by ATS) ═══ */}
                    <View style={{ width: SIDEBAR_W, backgroundColor: theme.tintBg, padding: 14, paddingTop: p }}>
                        {/* Photo */}
                        <View style={{ alignItems: 'center', marginBottom: 12 }}>
                            <InitialsCircle name={data.name} theme={theme} size={48} />
                        </View>

                        {/* Contact */}
                        <SidebarSectionTitle title="Contact" theme={{ ...theme, sidebarText: theme.accent, sidebarRule: theme.border }} f={f} />
                        <View style={{ gap: 1, marginBottom: 8 }}>
                            {contacts.map((row, i) => (
                                <ContactItem key={i} {...row} theme={{ ...theme, light: theme.light }} f={f} />
                            ))}
                        </View>

                        {/* Skills */}
                        {data.flatSkills.length > 0 ? (
                            <>
                                <SidebarSectionTitle title="Skills" theme={{ ...theme, sidebarText: theme.accent, sidebarRule: theme.border }} f={f} />
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 3, marginBottom: 8 }}>
                                    {data.flatSkills.map((skill, i) => (
                                        <SkillPill key={i} text={skill} theme={theme} f={f} />
                                    ))}
                                </View>
                            </>
                        ) : null}

                        {/* Languages */}
                        {data.languages.length > 0 ? (
                            <>
                                <SidebarSectionTitle title="Languages" theme={{ ...theme, sidebarText: theme.accent, sidebarRule: theme.border }} f={f} />
                                {data.languages.map((lang, i) => (
                                    <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                                        <Text style={{ fontSize: 9, fontFamily: font(null, false, f), color: theme.text }}>{lang.language}</Text>
                                        <Text style={{ fontSize: 8, fontFamily: font(null, false, f), color: theme.light }}>{lang.proficiency}</Text>
                                    </View>
                                ))}
                            </>
                        ) : null}

                        {/* Certifications */}
                        {data.certifications.length > 0 ? (
                            <>
                                <SidebarSectionTitle title="Certifications" theme={{ ...theme, sidebarText: theme.accent, sidebarRule: theme.border }} f={f} />
                                {data.certifications.map((cert, i) => (
                                    <View key={i} style={{ marginBottom: 3 }}>
                                        <Text style={{ fontSize: 9, fontFamily: font(null, true, f), color: theme.text }}>{cert.title}</Text>
                                        <Text style={{ fontSize: 8, fontFamily: font(null, false, f), color: theme.light }}>
                                            {cert.issuer}{cert.date ? ` — ${dateRange(cert.date, null)}` : ''}
                                        </Text>
                                    </View>
                                ))}
                            </>
                        ) : null}

                        {/* References */}
                        {data.references.length > 0 ? (
                            <>
                                <SidebarSectionTitle title="References" theme={{ ...theme, sidebarText: theme.accent, sidebarRule: theme.border }} f={f} />
                                {data.references.map((ref, i) => (
                                    <View key={i} style={{ marginBottom: 3 }}>
                                        <Text style={{ fontSize: 9, fontFamily: font(null, true, f), color: theme.text }}>{ref.name}</Text>
                                        <Text style={{ fontSize: 8, fontFamily: font(null, false, f), color: theme.light }}>
                                            {ref.role}{ref.role && ref.company ? ' at ' : ''}{ref.company}
                                        </Text>
                                    </View>
                                ))}
                            </>
                        ) : null}
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default CompactSidebarLayout;
