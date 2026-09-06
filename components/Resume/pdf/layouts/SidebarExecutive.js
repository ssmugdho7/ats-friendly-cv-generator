/**
 * Sidebar-Executive layout — Richard Sanchez style.
 *
 * Structure (DOM order for ATS safety):
 *   [Main column (first in DOM): name, tagline, summary, experience, education, projects]
 *   [Sidebar (second in DOM): contact, skills, languages, certifications]
 *
 * Visual order: sidebar on LEFT, main column on RIGHT (via row-reverse).
 * ATS reads main content first because it's first in DOM.
 *
 * Structural details:
 *   - Sidebar: 32% width, dark accent background, white text
 *   - Circular photo (initials circle) at top of sidebar
 *   - Thin white rule under each sidebar section header
 *   - Main column: uppercase section title with underline, bullet lists
 *   - All text is real and selectable (ATS-safe)
 *   - No layout tables — flexbox only
 *   - Every icon has a paired text label
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
    ContactItem,
} from './primitives';

const MainSection = ({ title, theme, f, children }) => (
    <View style={{ marginBottom: f?.sectionMarginAfter || 4 }}>
        <SidebarSectionTitle title={title} theme={theme} f={f} color={theme.accent} />
        <View style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: theme.border, paddingTop: 4, marginTop: 2 }}>
            {children}
        </View>
    </View>
);

const SidebarExecutiveLayout = ({ data, theme, size, padding }) => {
    const f = data.font;
    const contacts = contactRows(data.contact);
    const SIDEBAR_W = '32%';
    const MAIN_W = '68%';
    const p = padding || 24;

    return (
        <Document language="en">
            <Page size={size} style={{ backgroundColor: theme.bg, padding: 0 }}>
                {/* row-reverse: first DOM child (main) appears on RIGHT, second child (sidebar) on LEFT */}
                <View style={{ flexDirection: 'row-reverse', minHeight: '100%' }}>
                    {/* ═══ MAIN COLUMN (right visually, FIRST in DOM = read first by ATS) ═══ */}
                    <View style={{ width: MAIN_W, padding: p, paddingTop: p }}>
                        {/* Name + tagline */}
                        <Text style={{ fontSize: f?.nameSize || 22, fontFamily: font(null, true, f), color: theme.accent }}>
                            {data.name}
                        </Text>
                        {data.title ? (
                            <Text style={{ fontSize: 11, fontFamily: font(null, false, f), color: theme.light, marginTop: 2, marginBottom: 8 }}>
                                {data.title}
                            </Text>
                        ) : null}

                        {/* Summary */}
                        {data.summary ? (
                            <MainSection title="Summary" theme={theme} f={f}>
                                <Text style={{ fontSize: f?.descSize || f?.size || 10, fontFamily: font(null, false, f), color: theme.text, lineHeight: 1.4 }}>
                                    <RichSegments text={data.summary} theme={theme} f={f} />
                                </Text>
                            </MainSection>
                        ) : null}

                        {/* Experience */}
                        {data.experience.length > 0 ? (
                            <MainSection title="Experience" theme={theme} f={f}>
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
                            </MainSection>
                        ) : null}

                        {/* Education */}
                        {data.education.length > 0 ? (
                            <MainSection title="Education" theme={theme} f={f}>
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
                            </MainSection>
                        ) : null}

                        {/* Projects */}
                        {data.projects.length > 0 ? (
                            <MainSection title="Projects" theme={theme} f={f}>
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
                            </MainSection>
                        ) : null}
                    </View>

                    {/* ═══ SIDEBAR (left visually, SECOND in DOM = read second by ATS) ═══ */}
                    <View style={{ width: SIDEBAR_W, backgroundColor: theme.sidebarBg, padding: 20, paddingTop: p }}>
                        {/* Photo circle */}
                        <View style={{ alignItems: 'center', marginBottom: 16 }}>
                            <InitialsCircle name={data.name} theme={theme} size={64} />
                            <Text style={{ fontSize: f?.size || 10, fontFamily: font(null, false, f), color: theme.sidebarMuted, marginTop: 6, textAlign: 'center' }}>
                                {data.title || ''}
                            </Text>
                        </View>

                        {/* Contact */}
                        <SidebarSectionTitle title="Contact" theme={theme} f={f} />
                        <View style={{ gap: 2 }}>
                            {contacts.map((row, i) => (
                                <ContactItem key={i} {...row} theme={theme} f={f} />
                            ))}
                        </View>

                        {/* Skills */}
                        {data.flatSkills.length > 0 ? (
                            <>
                                <SidebarSectionTitle title="Skills" theme={theme} f={f} />
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
                                    {data.flatSkills.map((skill, i) => (
                                        <View
                                            key={i}
                                            style={{
                                                paddingHorizontal: 6,
                                                paddingVertical: 2,
                                                borderRadius: 3,
                                                backgroundColor: 'rgba(255,255,255,0.15)',
                                            }}
                                        >
                                            <Text style={{ fontSize: 8, fontFamily: font(null, false, f), color: theme.sidebarText }}>{skill}</Text>
                                        </View>
                                    ))}
                                </View>
                            </>
                        ) : null}

                        {/* Languages */}
                        {data.languages.length > 0 ? (
                            <>
                                <SidebarSectionTitle title="Languages" theme={theme} f={f} />
                                {data.languages.map((lang, i) => (
                                    <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                                        <Text style={{ fontSize: 9, fontFamily: font(null, false, f), color: theme.sidebarText }}>{lang.language}</Text>
                                        <Text style={{ fontSize: 9, fontFamily: font(null, false, f), color: theme.sidebarMuted }}>{lang.proficiency}</Text>
                                    </View>
                                ))}
                            </>
                        ) : null}

                        {/* Certifications */}
                        {data.certifications.length > 0 ? (
                            <>
                                <SidebarSectionTitle title="Certifications" theme={theme} f={f} />
                                {data.certifications.map((cert, i) => (
                                    <View key={i} style={{ marginBottom: 4 }}>
                                        <Text style={{ fontSize: 9, fontFamily: font(null, true, f), color: theme.sidebarText }}>{cert.title}</Text>
                                        <Text style={{ fontSize: 8, fontFamily: font(null, false, f), color: theme.sidebarMuted }}>
                                            {cert.issuer}{cert.date ? ` — ${dateRange(cert.date, null)}` : ''}
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

export default SidebarExecutiveLayout;
