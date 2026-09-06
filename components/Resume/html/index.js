'use client';

import { useSelector } from 'react-redux';
import Section from './Section';
import ListItem from './ListItem';
import formatDate from '@/utils/formatDate';
import { normUrl } from '@/utils/richText';
import { DEFAULT_SECTION_ORDER } from '@/config/ResumeFields';
import { TEMPLATES, DEFAULT_TEMPLATE } from '@/config/templates';
import { Link, Text, View, RichSegments, getFontCSS } from './Renderer';

const getTemplate = key => TEMPLATES[key] || TEMPLATES[DEFAULT_TEMPLATE];

const Description = ({ text, bullets, font, tmpl }) => {
    const lines = String(text || '')
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);
    if (!lines.length) return null;
    const descSize = font?.descSize || font?.size || 10;

    if (bullets === false) {
        return (
            <View style={{ fontSize: descSize, marginTop: 2 }}>
                {lines.map((line, i) => (
                    <Text key={i} style={{ fontSize: descSize, marginTop: 2, fontFamily: getFontCSS(font?.family), color: tmpl.text }}>
                        <RichSegments text={line} font={font} />
                    </Text>
                ))}
            </View>
        );
    }

    return (
        <View style={{ fontSize: descSize, marginTop: 2 }}>
            {lines.map((line, i) => (
                <ListItem key={i} font={font} tmpl={tmpl}>
                    <RichSegments text={line} font={font} />
                </ListItem>
            ))}
        </View>
    );
};

const Header = ({ data, tagline, font, tmpl }) => {
    const contactLinks = [
        { id: 'phone', name: data['phone'], value: data['phone'] ? `tel:${data['phone']}` : '' },
        { id: 'email', name: data['email'], value: data['email'] ? `mailto:${data['email']}` : '' },
        { id: 'linkedin', name: 'LinkedIn', value: data['linkedin'] },
        { id: 'github', name: 'Github', value: data['github'] },
        { id: 'blogs', name: 'Blogs', value: data['blogs'] },
        { id: 'twitter', name: 'Twitter', value: data['twitter'] },
        { id: 'portfolio', name: 'Portfolio', value: data['portfolio'] },
    ];

    const nameSize = font?.nameSize || 20;

    return (
        <Section font={font} tmpl={tmpl}>
            <Text style={{ color: tmpl.accent, fontSize: nameSize, fontFamily: getFontCSS(font?.family), textAlign: 'center', fontWeight: 'bold' }}>
                {data.name}
            </Text>
            {!!tagline && (
                <Text style={{ color: tmpl.light, fontSize: 12, textAlign: 'center', marginTop: 2, fontFamily: getFontCSS(font?.family) }}>{tagline}</Text>
            )}
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 14, marginTop: 6, marginBottom: 4 }}>
                {contactLinks
                    .filter(obj => obj.value)
                    .map(({ id, value, name }) => (
                        <Link key={id} src={value} style={{ color: tmpl.accent, textDecoration: 'none', fontFamily: getFontCSS(font?.family), fontSize: 11 }}>
                            {name}
                        </Link>
                    ))}
            </View>
        </Section>
    );
};

const Summary = ({ data, font, tmpl }) => {
    if (!data?.summary) return null;
    return (
        <Section title={'Summary'} font={font} tmpl={tmpl}>
            <Text style={{ fontSize: font?.descSize || font?.size || 10, fontFamily: getFontCSS(font?.family), color: tmpl.text }}>
                <RichSegments text={data.summary} font={font} />
            </Text>
        </Section>
    );
};

const Education = ({ data, font, tmpl }) => (
    <Section title={'Education'} font={font} tmpl={tmpl}>
        {data.map(({ degree, institution, start, end, location, gpa }, i) => (
            <View key={i} style={{ marginBottom: 4 }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                    <Text style={{ fontFamily: getFontCSS(font?.family), marginRight: 'auto', color: tmpl.text, fontWeight: 'bold' }}>{degree}</Text>
                    <Text style={{ fontFamily: getFontCSS(font?.family), fontSize: 10, fontStyle: 'italic', color: tmpl.light }}>
                        {formatDate(start)}- {formatDate(end)}
                    </Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
                    <Text style={{ fontFamily: getFontCSS(font?.family), color: tmpl.text }}>
                        {institution}
                        {gpa && <Text> ({gpa})</Text>}
                    </Text>
                    <Text style={{ fontFamily: getFontCSS(font?.family), fontSize: 10, fontStyle: 'italic', color: tmpl.light }}>{location}</Text>
                </View>
                {i !== data.length - 1 && <View style={{ borderBottom: `1px solid ${tmpl.border}`, margin: '5px 0px' }} />}
            </View>
        ))}
    </Section>
);

const Projects = ({ data, font, tmpl }) => (
    <Section title={'Projects'} font={font} tmpl={tmpl}>
        {data.map((project, i) => (
            <View key={i}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                    <Text style={{ fontFamily: getFontCSS(font?.family), marginRight: 'auto', color: tmpl.text, fontWeight: 'bold' }}>{project.title}</Text>
                    {(project.github || project.live) && (
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            {project.github ? (
                                <Link src={normUrl(project.github)} style={{ color: tmpl.accent, fontSize: 11, textDecoration: 'none', fontFamily: getFontCSS(font?.family) }}>
                                    GitHub
                                </Link>
                            ) : null}
                            {project.live ? (
                                <Link src={normUrl(project.live)} style={{ color: tmpl.accent, fontSize: 11, textDecoration: 'none', fontFamily: getFontCSS(font?.family) }}>
                                    Live
                                </Link>
                            ) : null}
                        </View>
                    )}
                </View>
                {!!project.url && (
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
                        <Link style={{ color: tmpl.accent, fontSize: 11, textDecoration: 'none', fontFamily: getFontCSS(font?.family) }} src={normUrl(project.url)}>
                            {project.url}
                        </Link>
                    </View>
                )}
                <Description text={project.description} bullets={project.bullets} font={font} tmpl={tmpl} />
                {i !== data.length - 1 && <View style={{ borderBottom: `1px solid ${tmpl.border}`, margin: '5px 0px' }} />}
            </View>
        ))}
    </Section>
);

const Experience = ({ data, font, tmpl }) => (
    <Section title={'Experience'} font={font} tmpl={tmpl}>
        {data.map(({ role, start, end, company, location, description, bullets }, i) => (
            <View key={i} style={{ marginBottom: 4 }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                    <Text style={{ fontFamily: getFontCSS(font?.family), marginRight: 'auto', color: tmpl.text, fontWeight: 'bold' }}>{role}</Text>
                    <Text style={{ fontFamily: getFontCSS(font?.family), fontSize: 10, fontStyle: 'italic', color: tmpl.light }}>
                        {formatDate(start)} - {formatDate(end)}
                    </Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
                    <Text style={{ fontFamily: getFontCSS(font?.family), color: tmpl.text }}>{company}</Text>
                    <Text style={{ fontFamily: getFontCSS(font?.family), fontSize: 10, fontStyle: 'italic', color: tmpl.light }}>{location}</Text>
                </View>
                <Description text={description} bullets={bullets} font={font} tmpl={tmpl} />
                {i !== data.length - 1 && <View style={{ borderBottom: `1px solid ${tmpl.border}`, margin: '5px 0px' }} />}
            </View>
        ))}
    </Section>
);

const Skills = ({ data, font, tmpl }) => {
    const groups = Array.isArray(data) ? data : data?.skills ? [{ title: 'Skills', skills: data.skills }] : [];
    const visible = groups.filter(g => g && (g.title || g.skills));
    if (!visible.length) return null;

    return (
        <Section title={'Skills'} font={font} tmpl={tmpl}>
            {visible.map((group, i) => (
                <Text key={i} style={{ fontSize: font?.size || 10, marginTop: i ? 3 : 0, fontFamily: getFontCSS(font?.family), color: tmpl.text }}>
                    {!!group.title && (
                        <strong style={{ fontFamily: getFontCSS(font?.family), color: tmpl.accent }}>{group.title}: </strong>
                    )}
                    <RichSegments text={group.skills} font={font} />
                </Text>
            ))}
        </Section>
    );
};

const Certificaes = ({ data, font, tmpl }) => (
    <Section title={'Certifications'} font={font} tmpl={tmpl}>
        {data.map(({ title, issuer, date }, i) => (
            <View key={i} style={{ marginBottom: 4 }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                    <Text style={{ fontFamily: getFontCSS(font?.family), marginRight: 'auto', color: tmpl.text, fontWeight: 'bold' }}>{title}</Text>
                    <Text style={{ fontFamily: getFontCSS(font?.family), fontSize: 10, fontStyle: 'italic', color: tmpl.light }}>{formatDate(date)}</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
                    <Text style={{ fontFamily: getFontCSS(font?.family), color: tmpl.text }}>{issuer}</Text>
                </View>
                {i !== data.length - 1 && <View style={{ borderBottom: `1px solid ${tmpl.border}`, margin: '5px 0px' }} />}
            </View>
        ))}
    </Section>
);

const Languages = ({ data, font, tmpl }) => (
    <Section title={'Languages'} font={font} tmpl={tmpl}>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            {data.map(({ language, proficiency }, i) => (
                <View key={i}>
                    <Text style={{ fontSize: font?.size ? font.size + 2 : 12, fontFamily: getFontCSS(font?.family), color: tmpl.text }}>
                        {language}
                    </Text>
                    <Text style={{ fontSize: font?.size || 10, color: tmpl.light, fontFamily: getFontCSS(font?.family) }}>
                        {proficiency}
                    </Text>
                </View>
            ))}
        </View>
    </Section>
);

const References = ({ data, font, tmpl }) => (
    <Section title={'References'} font={font} tmpl={tmpl}>
        {data.map(({ name, role, company, contacts, website }, i) => (
            <View key={i} style={{ marginBottom: 4 }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                    <Text style={{ fontFamily: getFontCSS(font?.family), marginRight: 'auto', color: tmpl.text, fontWeight: 'bold' }}>{name}</Text>
                    {website && (
                        <Link src={normUrl(website)} style={{ color: tmpl.accent, fontSize: 11, textDecoration: 'none', fontFamily: getFontCSS(font?.family) }}>
                            Website
                        </Link>
                    )}
                </View>
                {(role || company) && (
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
                        <Text style={{ fontFamily: getFontCSS(font?.family), color: tmpl.text }}>
                            {role}{role && company ? ' at ' : ''}{company}
                        </Text>
                    </View>
                )}
                {!!contacts && (
                    <Text style={{ fontSize: font?.descSize || font?.size || 10, fontFamily: getFontCSS(font?.family), marginTop: 2, color: tmpl.light }}>
                        {String(contacts).split('\n').filter(c => c.trim()).join(' | ')}
                    </Text>
                )}
                {i !== data.length - 1 && <View style={{ borderBottom: `1px solid ${tmpl.border}`, margin: '5px 0px' }} />}
            </View>
        ))}
    </Section>
);

const sectionComponents = {
    summary: Summary,
    education: Education,
    experience: Experience,
    projects: Projects,
    skills: Skills,
    certificates: Certificaes,
    languages: Languages,
    references: References,
};

const renderOrderedSections = (sections, order, font, tmpl) => {
    const keys = Array.isArray(order) && order.length ? order : DEFAULT_SECTION_ORDER;
    return keys.map(key => {
        const Component = sectionComponents[key];
        if (!Component) return null;
        const sectionData = sections[key];
        if (sectionData == null) return null;
        if (Array.isArray(sectionData) && sectionData.length === 0) return null;
        if (key === 'summary' && !sectionData.summary) return null;
        if (key === 'skills') {
            const groups = Array.isArray(sectionData)
                ? sectionData
                : sectionData.skills
                  ? [sectionData]
                  : [];
            if (!groups.filter(g => g && (g.title || g.skills)).length) return null;
        }
        return <Component key={key} data={sectionData} font={font} tmpl={tmpl} />;
    });
};

const Preview = () => {
    const resumeData = useSelector(state => state.resume);
    const { contact, tagline, education, experience, projects, summary, skills, certificates, languages, references, template, font } = resumeData;

    const tmpl = getTemplate(template);
    const sections = { summary, education, experience, projects, skills, certificates, languages, references };

    return (
        <div className="h-[40rem] w-[28rem] md:block">
            <div style={{ backgroundColor: tmpl.bg, color: tmpl.text, padding: 30, fontFamily: getFontCSS(font?.family) }}>
                <Header data={contact || {}} tagline={tagline?.tagline} font={font} tmpl={tmpl} />
                {renderOrderedSections(sections, resumeData.sectionOrder, font, tmpl)}
            </div>
        </div>
    );
};

export default Preview;
