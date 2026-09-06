'use client';

import React from 'react';
import { Page, Text, View, Document, Link } from '@react-pdf/renderer';
import Section, { getFont } from '../Section';
import ListItem from '../ListItem';
import formatDate from '@/utils/formatDate';
import { parseRich, normUrl } from '@/utils/richText';
import { DEFAULT_SECTION_ORDER } from '@/config/ResumeFields';
import { TEMPLATES, DEFAULT_TEMPLATE } from '@/config/templates';

const getTemplate = key => TEMPLATES[key] || TEMPLATES[DEFAULT_TEMPLATE];

const RichSegments = ({ text, font, tmpl }) => (
    <>
        {parseRich(text).map((seg, i) => (
            <Text
                key={i}
                style={{
                    fontFamily: seg.bold ? getFont(font?.family, true) : getFont(font?.family, false),
                    color: seg.color || tmpl.text,
                }}
            >
                {seg.t}
            </Text>
        ))}
    </>
);

const Description = ({ text, bullets, font, tmpl }) => {
    const lines = String(text || '')
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);
    if (!lines.length) return null;
    const descSize = font?.descSize || font?.size || 10;
    const lineGap = font?.lineGap || 0;

    if (bullets === false) {
        return (
            <View style={{ fontSize: descSize, marginTop: 2 }}>
                {lines.map((line, i) => (
                    <Text key={i} style={{ fontSize: descSize, fontFamily: getFont(font?.family), marginTop: i ? lineGap : 0, color: tmpl.text }}>
                        <RichSegments text={line} font={font} tmpl={tmpl} />
                    </Text>
                ))}
            </View>
        );
    }

    return (
        <View style={{ fontSize: descSize, marginTop: 2 }}>
            {lines.map((line, i) => (
                <View key={i} style={{ marginTop: i ? lineGap : 0 }}>
                    <ListItem font={font} tmpl={tmpl}>
                        <RichSegments text={line} font={font} tmpl={tmpl} />
                    </ListItem>
                </View>
            ))}
        </View>
    );
};

const contactLinks = [
    { id: 'phone', name: 'Phone', value: '' },
    { id: 'email', name: 'Email', value: '' },
    { id: 'linkedin', name: 'LinkedIn', value: '' },
    { id: 'github', name: 'Github', value: '' },
    { id: 'portfolio', name: 'Portfolio', value: '' },
];

const Header = ({ data, tagline, font, tmpl }) => {
    const links = contactLinks.map(obj => {
        const raw = data[obj.id];
        if (!raw) return { ...obj, value: '' };
        if (obj.id === 'phone') {
            const code = (data.phoneCountryCode || '').trim();
            const fullPhone = code ? `${code} ${raw}` : raw;
            return { ...obj, value: `tel:${fullPhone}`, label: fullPhone };
        }
        if (obj.id === 'email') return { ...obj, value: `mailto:${raw}`, label: raw };
        return { ...obj, value: raw, label: raw };
    });

    const nameSize = font?.nameSize || 20;
    const headerAlign = font?.headerAlign || 'center';

    return (
        <Section font={font} tmpl={tmpl}>
            <Text style={{ color: tmpl.accent, fontSize: nameSize, fontFamily: getFont(font?.family, true), textAlign: headerAlign }}>
                {data.name || ''}
            </Text>
            {!!tagline && (
                <Text style={{ color: tmpl.light, fontSize: 12, textAlign: headerAlign, marginTop: 2, fontFamily: getFont(font?.family) }}>{tagline}</Text>
            )}
            <ContactLine contact={data} links={links.filter(l => l.value)} font={font} tmpl={tmpl} />
        </Section>
    );
};

const ContactLine = ({ contact, links, font, tmpl }) => {
    const order = contact.order || ['address', 'phone', 'email', 'linkedin', 'github', 'portfolio'];
    const linkColor = font?.linkColor || tmpl.accent;
    const headerAlign = font?.headerAlign || 'center';

    const items = order.map(key => {
        if (key === 'phone') {
            const raw = contact.phone;
            if (!raw) return null;
            const code = (contact.phoneCountryCode || '').trim();
            const label = code ? `${code} ${raw}` : raw;
            const value = `tel:${code ? `${code} ${raw}` : raw}`;
            return { key, label, value, isLink: false };
        }
        if (key === 'email') {
            const raw = contact.email;
            if (!raw) return null;
            return { key, label: raw, value: `mailto:${raw}`, isLink: false };
        }
        if (key === 'linkedin') {
            const raw = contact.linkedin;
            if (!raw) return null;
            return { key, label: 'LinkedIn', value: raw, isLink: true };
        }
        if (key === 'github') {
            const raw = contact.github;
            if (!raw) return null;
            return { key, label: 'GitHub', value: raw, isLink: true };
        }
        if (key === 'portfolio') {
            const raw = contact.portfolio;
            if (!raw) return null;
            return { key, label: 'Portfolio', value: raw, isLink: true };
        }
        if (key === 'address') {
            if (!contact.address) return null;
            return { key, label: contact.address, value: '', isLink: false };
        }
        return null;
    }).filter(Boolean);

    if (!items.length) return null;

    const justifyContent = headerAlign === 'center' ? 'center' : headerAlign === 'right' ? 'flex-end' : 'flex-start';

    return (
        <View style={{ color: tmpl.text, fontSize: 11, marginTop: 6, marginBottom: 8, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 4, textAlign: headerAlign, justifyContent }}>
            {items.map((item, i) => (
                <React.Fragment key={item.key}>
                    {i > 0 && <Text style={{ color: tmpl.light, fontFamily: getFont(font?.family), fontSize: 10 }}> | </Text>}
                    {item.value ? (
                        <Link src={item.value} style={{ color: item.isLink ? linkColor : tmpl.accent, textDecoration: 'none', fontFamily: getFont(font?.family), fontSize: 10 }}>
                            {item.label}
                        </Link>
                    ) : (
                        <Text style={{ color: tmpl.text, fontFamily: getFont(font?.family), fontSize: 10 }}>
                            {item.label}
                        </Text>
                    )}
                </React.Fragment>
            ))}
        </View>
    );
};

const Summary = ({ data, font, tmpl }) => {
    if (!data?.summary) return null;
    const descSize = font?.descSize || font?.size || 10;
    const lines = String(data.summary).split('\n').map(l => l.trim()).filter(Boolean);

    return (
        <Section title={'Summary'} font={font} tmpl={tmpl}>
            {lines.map((line, i) => (
                <Text key={i} style={{ fontSize: descSize, fontFamily: getFont(font?.family), color: tmpl.text, marginTop: i ? 2 : 0 }}>
                    <RichSegments text={line} font={font} tmpl={tmpl} />
                </Text>
            ))}
        </Section>
    );
};

const Education = ({ data, font, tmpl }) => (
    <Section title={'Education'} font={font} tmpl={tmpl}>
        {data.map(({ degree, institution, start, end, present, location, gpa }, i) => {
            const endLabel = present ? 'Present' : formatDate(end);
            return (
                <View key={i} style={{ marginBottom: 4 }}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', fontSize: font?.roleSize || 12 }}>
                        <Text style={{ fontFamily: getFont(font?.family, true), marginRight: 'auto', color: tmpl.text }}>{degree}</Text>
                        <Text style={{ fontFamily: getFont(font?.family), fontSize: font?.descSize || font?.size || 10, fontStyle: 'italic', color: tmpl.light }}>
                            {formatDate(start)}- {endLabel}
                        </Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', fontSize: font?.companySize || 11 }}>
                        <Text style={{ fontFamily: getFont(font?.family), color: tmpl.text }}>
                            {institution}
                            {gpa && <Text> ({gpa})</Text>}
                        </Text>
                        <Text style={{ fontFamily: getFont(font?.family), fontSize: font?.descSize || font?.size || 10, fontStyle: 'italic', color: tmpl.light }}>{location}</Text>
                    </View>
                    {i !== data.length - 1 && <View style={{ borderBottom: `1px solid ${tmpl.border}`, margin: '5px 0px' }} />}
                </View>
            );
        })}
    </Section>
);

const Projects = ({ data, font, tmpl }) => {
    const linkColor = font?.linkColor || tmpl.accent;

    return (
        <Section title={'Projects'} font={font} tmpl={tmpl}>
            {data.map((project, i) => (
                <View key={i}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', fontSize: font?.roleSize || 12 }}>
                        <Text style={{ fontFamily: getFont(font?.family, true), marginRight: 'auto', color: tmpl.text }}>{project.title}</Text>
                        {project.github && (
                            <Link src={normUrl(project.github)} style={{ color: linkColor, fontSize: font?.companySize || 11, textDecoration: 'none', fontFamily: getFont(font?.family) }}>
                                GitHub
                            </Link>
                        )}
                    </View>
                    <Description text={project.description} bullets={project.bullets} font={font} tmpl={tmpl} />
                    {i !== data.length - 1 && <View style={{ borderBottom: `1px solid ${tmpl.border}`, margin: '5px 0px' }} />}
                </View>
            ))}
        </Section>
    );
};

const Experience = ({ data, font, tmpl }) => (
    <Section title={'Experience'} font={font} tmpl={tmpl}>
        {data.map(({ role, start, end, present, company, location, description, bullets }, i) => {
            const endLabel = present ? 'Present' : formatDate(end);
            return (
                <View key={i} style={{ marginBottom: 4 }}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', fontSize: font?.roleSize || 12 }}>
                        <Text style={{ fontFamily: getFont(font?.family, true), marginRight: 'auto', color: tmpl.text }}>{role}</Text>
                        <Text style={{ fontFamily: getFont(font?.family), fontSize: font?.descSize || font?.size || 10, fontStyle: 'italic', color: tmpl.light }}>
                            {formatDate(start)} - {endLabel}
                        </Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', fontSize: font?.companySize || 11 }}>
                        <Text style={{ fontFamily: getFont(font?.family), color: tmpl.text }}>{company}</Text>
                        <Text style={{ fontFamily: getFont(font?.family), fontSize: font?.descSize || font?.size || 10, fontStyle: 'italic', color: tmpl.light }}>{location}</Text>
                    </View>
                    <Description text={description} bullets={bullets} font={font} tmpl={tmpl} />
                    {i !== data.length - 1 && <View style={{ borderBottom: `1px solid ${tmpl.border}`, margin: '5px 0px' }} />}
                </View>
            );
        })}
    </Section>
);

const Skills = ({ data, font, tmpl }) => {
    const groups = Array.isArray(data) ? data : data?.skills ? [{ title: 'Skills', skills: data.skills }] : [];
    const visible = groups.filter(g => g && (g.title || g.skills));
    if (!visible.length) return null;

    return (
        <Section title={'Skills'} font={font} tmpl={tmpl}>
            {visible.map((group, i) => (
                <Text key={i} style={{ fontSize: font?.size || 10, marginTop: i ? 3 : 0, fontFamily: getFont(font?.family), color: tmpl.text }}>
                    {!!group.title && (
                        <Text style={{ fontFamily: getFont(font?.family, true), color: tmpl.accent }}>{group.title}: </Text>
                    )}
                    <RichSegments text={group.skills} font={font} tmpl={tmpl} />
                </Text>
            ))}
        </Section>
    );
};

const Certifications = ({ data, font, tmpl }) => {
    const roleSize = font?.roleSize || 12;
    const companySize = font?.companySize || 10;

    return (
        <Section title={'Certifications'} font={font} tmpl={tmpl}>
            {data.map(({ title, issuer, date }, i) => (
                <View key={i} style={{ marginBottom: 4 }}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', fontSize: roleSize }}>
                        <Text style={{ fontFamily: getFont(font?.family, true), marginRight: 'auto', color: tmpl.text }}>{title}</Text>
                        <Text style={{ fontFamily: getFont(font?.family), fontSize: companySize, fontStyle: 'italic', color: tmpl.light }}>{formatDate(date)}</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', fontSize: companySize }}>
                        <Text style={{ fontFamily: getFont(font?.family), color: tmpl.text }}>{issuer}</Text>
                    </View>
                    {i !== data.length - 1 && <View style={{ borderBottom: `1px solid ${tmpl.border}`, margin: '5px 0px' }} />}
                </View>
            ))}
        </Section>
    );
};

const Languages = ({ data, font, tmpl }) => {
    const roleSize = font?.roleSize || 12;
    const descSize = font?.descSize || font?.size || 10;

    return (
        <Section title={'Languages'} font={font} tmpl={tmpl}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                {data.map(({ language, proficiency }, i) => (
                    <View key={i}>
                        <Text style={{ fontSize: roleSize, fontFamily: getFont(font?.family), color: tmpl.text }}>
                            {language}
                        </Text>
                        <Text style={{ fontSize: descSize, color: tmpl.light, fontFamily: getFont(font?.family) }}>
                            {proficiency}
                        </Text>
                    </View>
                ))}
            </View>
        </Section>
    );
};

const References = ({ data, font, tmpl }) => {
    const roleSize = font?.roleSize || 12;
    const companySize = font?.companySize || 10;
    const descSize = font?.descSize || font?.size || 10;

    return (
        <Section title={'References'} font={font} tmpl={tmpl}>
            {data.map(({ name, role, company, contacts, website }, i) => (
                <View key={i} style={{ marginBottom: 4 }}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', fontSize: roleSize }}>
                        <Text style={{ fontFamily: getFont(font?.family, true), marginRight: 'auto', color: tmpl.text }}>{name}</Text>
                        {website && (
                            <Link src={normUrl(website)} style={{ color: tmpl.accent, fontSize: companySize, textDecoration: 'none', fontFamily: getFont(font?.family) }}>
                                Website
                            </Link>
                        )}
                    </View>
                    {(role || company) && (
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', fontSize: companySize }}>
                            <Text style={{ fontFamily: getFont(font?.family), color: tmpl.text }}>
                                {role}{role && company ? ' at ' : ''}{company}
                            </Text>
                        </View>
                    )}
                    {!!contacts && (
                        <Text style={{ fontSize: descSize, fontFamily: getFont(font?.family), marginTop: 2, color: tmpl.light }}>
                            {String(contacts).split('\n').filter(c => c.trim()).join(' | ')}
                        </Text>
                    )}
                    {i !== data.length - 1 && <View style={{ borderBottom: `1px solid ${tmpl.border}`, margin: '5px 0px' }} />}
                </View>
            ))}
        </Section>
    );
};

const sectionComponents = {
    summary: Summary,
    education: Education,
    experience: Experience,
    projects: Projects,
    skills: Skills,
    certificates: Certifications,
    languages: Languages,
    references: References,
};

const renderOrderedSections = (sections, order, font, tmpl, hiddenSections = []) => {
    const hiddenSet = new Set(hiddenSections || []);
    const keys = Array.isArray(order) && order.length ? order : DEFAULT_SECTION_ORDER;
    return keys.map(key => {
        if (hiddenSet.has(key)) return null;
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

const ClassicLayout = ({ data, size = 'A4', padding = 30, hiddenSections = [] }) => {
    const {
        contact,
        tagline,
        education,
        experience,
        projects,
        summary,
        skills,
        certificates,
        languages,
        references,
        sectionOrder,
        template,
        font,
    } = data || {};

    const tmpl = getTemplate(template);
    const sections = { summary, education, experience, projects, skills, certificates, languages, references };

    return (
        <Document language="en">
            <Page size={size} style={{ backgroundColor: tmpl.bg, color: tmpl.text, padding, fontFamily: getFont(font?.family) }}>
                <Header data={contact || {}} tagline={tagline?.tagline} font={font} tmpl={tmpl} />
                <View style={{ marginTop: 12 }}>
                    {renderOrderedSections(sections, sectionOrder, font, tmpl, hiddenSections)}
                </View>
            </Page>
        </Document>
    );
};

export default ClassicLayout;