'use client';

import React from 'react';
import { Page, Text, View, Document, Link, Image } from '@react-pdf/renderer';
import Section, { getFont } from '../Section';
import formatDate from '@/utils/formatDate';
import { normUrl } from '@/utils/richText';
import { DEFAULT_SECTION_ORDER } from '@/config/ResumeFields';
import { TEMPLATES, DEFAULT_TEMPLATE } from '@/config/templates';
import { LAYOUTS, DEFAULT_LAYOUT } from '@/config/layouts';

const getTemplate = key => TEMPLATES[key] || TEMPLATES[DEFAULT_TEMPLATE];
const getLayout = key => LAYOUTS[key] || LAYOUTS[DEFAULT_LAYOUT];

const ContactLine = ({ contact, font, tmpl }) => {
    const order = contact.order || ['address', 'phone', 'email', 'linkedin', 'github', 'portfolio'];
    const linkColor = font?.linkColor || tmpl.accent;
    const contactAlign = font?.contactAlign || 'center';

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
            const label = String(contact.address || '').trim();
            if (!label) return null;
            return { key, label, value: '', isLink: false };
        }
        return null;
    }).filter(Boolean);

    if (!items.length) return null;

    const justifyContent = contactAlign === 'center' ? 'center' : contactAlign === 'right' ? 'flex-end' : 'flex-start';

    return (
        <View style={{ marginTop: 6, marginBottom: 4, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent, gap: 4 }}>
            {items.map((item, i) => (
                <React.Fragment key={item.key}>
                    {i > 0 && <Text style={{ color: tmpl.light, fontFamily: getFont(font?.family), fontSize: 10 }}> | </Text>}
                    {item.value ? (
                        <Link src={item.value} style={{ color: item.isLink ? linkColor : tmpl.accent, textDecoration: font?.linkUnderline && item.value.startsWith('http') ? 'underline' : 'none', fontFamily: getFont(font?.family), fontSize: 10 }}>
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

const Header = ({ data, tmpl, font, layout }) => {
    const nameSize = font?.nameSize || 28;
    const taglineSize = font?.descSize || font?.size || 12;
    const contactAlign = font?.contactAlign || 'center';
    const taglineAlign = font?.taglineAlign || 'center';
    
    const hasPhoto = data.photo && (typeof data.photo === 'string' || data.photo?.uri);
    const photoSrc = typeof data.photo === 'string' ? data.photo : (data.photo?.uri || '');
    
    return (
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, paddingBottom: 10, borderBottom: `1px solid ${tmpl.border}` }}>
            {hasPhoto ? (
                <View style={{ width: 100, height: 100, borderRadius: 8, marginRight: 20, overflow: 'hidden' }}>
                    <Image src={photoSrc} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </View>
            ) : (
                <View style={{ width: 100, height: 100, borderRadius: 8, backgroundColor: tmpl.accent, marginRight: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: tmpl.bg, fontSize: 28, fontFamily: getFont(font?.family, true), fontWeight: 'bold' }}>
                        {data.name?.split(' ').map(n => n[0]).join('')}
                    </Text>
                </View>
            )}
            <View style={{ flex: 1 }}>
                <Text style={{ color: tmpl.accent, fontSize: nameSize, fontFamily: getFont(font?.family, true), marginBottom: 4, textAlign: contactAlign }}>
                    {data.name || ''}
                </Text>
                {!!data.title && (
                    <Text style={{ color: tmpl.light, fontSize: taglineSize, marginBottom: 6, textAlign: taglineAlign }}>
                        {data.title}
                    </Text>
                )}
                <ContactLine contact={data} font={font} tmpl={tmpl} />
            </View>
        </View>
    );
};

const Experience = ({ data, tmpl, font }) => {
    const lineGap = font?.lineGap || 0;
    const descSize = font?.descSize || font?.size || 10;
    const roleSize = font?.roleSize || 12;
    const companySize = font?.companySize || 10;

    return (
        <Section title="Experience" tmpl={tmpl} font={font}>
            {data.map((item, i) => (
                <React.Fragment key={i}>
                    <View style={{ marginBottom: 12 }}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontFamily: getFont(font?.family, true), color: tmpl.text, fontSize: roleSize }}>{item.role}</Text>
                            <Text style={{ fontFamily: getFont(font?.family), fontSize: companySize, color: tmpl.light }}>
                                {formatDate(item.start)} - {formatDate(item.end)}
                            </Text>
                        </View>
                        <Text style={{ fontFamily: getFont(font?.family), color: tmpl.text, fontSize: companySize }}>
                            {item.company}{item.location && `, ${item.location}`}
                        </Text>
                        {item.description && (() => {
                            const lines = String(item.description).split('\n').map(l => l.trim()).filter(Boolean);
                            return lines.map((line, idx) => (
                                <Text key={idx} style={{ fontFamily: getFont(font?.family), fontSize: descSize, color: tmpl.text, marginTop: idx ? lineGap : 4, textDecoration: font?.linkUnderline ? 'underline' : 'none' }}>
                                    {line}
                                </Text>
                            ));
                        })()}
                    </View>
                </React.Fragment>
            ))}
        </Section>
    );
};

const Education = ({ data, tmpl, font }) => {
    const roleSize = font?.roleSize || 11;
    const companySize = font?.companySize || 9;
    const descSize = font?.descSize || font?.size || 10;

    return (
        <Section title="Education" tmpl={tmpl} font={font}>
            {data.map((item, i) => (
                <React.Fragment key={i}>
                    <View style={{ marginBottom: 8 }}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontFamily: getFont(font?.family, true), color: tmpl.text, fontSize: roleSize }}>{item.degree}</Text>
                            <Text style={{ fontFamily: getFont(font?.family), fontSize: companySize, color: tmpl.light }}>
                                {formatDate(item.start)} - {formatDate(item.end)}
                            </Text>
                        </View>
                        <Text style={{ fontFamily: getFont(font?.family), fontSize: companySize, color: tmpl.text }}>
                            {item.institution}{item.gpa && ` (${item.gpa})`}
                        </Text>
                    </View>
                </React.Fragment>
            ))}
        </Section>
    );
};

const Projects = ({ data, tmpl, font }) => {
    const descSize = font?.descSize || font?.size || 10;
    const linkColor = font?.linkColor || tmpl.accent;
    const roleSize = font?.roleSize || 11;
    const companySize = font?.companySize || 9;

    return (
        <Section title="Projects" tmpl={tmpl} font={font}>
            {data.map((project, i) => (
                <React.Fragment key={i}>
                    <View style={{ marginBottom: 10 }}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontFamily: getFont(font?.family, true), color: tmpl.text, fontSize: roleSize }}>{project.title}</Text>
                            {project.live && (
                                <Link src={normUrl(project.live)} style={{ color: linkColor, fontSize: companySize, textDecoration: font?.linkUnderline && normUrl(project.live).startsWith('http') ? 'underline' : 'none' }}>Live</Link>
                            )}
                        </View>
                        {project.url && (
                            <Text style={{ fontFamily: getFont(font?.family), fontSize: companySize, color: linkColor, marginTop: 2, textDecoration: font?.linkUnderline && normUrl(project.url).startsWith('http') ? 'underline' : 'none' }}>
                                {project.url}
                            </Text>
                        )}
                        {project.description && (() => {
                            const lines = String(project.description).split('\n').map(l => l.trim()).filter(Boolean);
                            return lines.map((line, idx) => (
                                <Text key={idx} style={{ fontFamily: getFont(font?.family), fontSize: descSize, color: tmpl.text, marginTop: idx ? 2 : 2 }}>
                                    {line}
                                </Text>
                            ));
                        })()}
                    </View>
                </React.Fragment>
            ))}
        </Section>
    );
};

const Skills = ({ data, tmpl, font }) => {
    const groups = Array.isArray(data) ? data : data?.skills ? [{ title: 'Skills', skills: data.skills }] : [];
    const visible = groups.filter(g => g && (g.title || g.skills));
    if (!visible.length) return null;

    return (
        <Section title="Skills" tmpl={tmpl} font={font}>
            {visible.map((group, i) => (
                <Text key={i} style={{ fontSize: font?.size || 10, marginTop: i ? 3 : 0, fontFamily: getFont(font?.family), color: tmpl.text }}>
                    {!!group.title && (
                        <Text style={{ fontFamily: getFont(font?.family, true), color: tmpl.accent }}>{group.title}: </Text>
                    )}
                    {group.skills}
                </Text>
            ))}
        </Section>
    );
};

const Certificates = ({ data, tmpl, font }) => {
    const roleSize = font?.roleSize || 11;
    const companySize = font?.companySize || 9;
    const descSize = font?.descSize || font?.size || 10;

    return (
        <Section title="Certifications" tmpl={tmpl} font={font}>
            {data.map((item, i) => (
                <React.Fragment key={i}>
                    <View style={{ marginBottom: 6, paddingBottom: 6, borderBottom: `1px solid ${tmpl.border}` }}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontFamily: getFont(font?.family, true), color: tmpl.text, fontSize: roleSize }}>{item.title}</Text>
                            <Text style={{ fontFamily: getFont(font?.family), fontSize: companySize, color: tmpl.light }}>{formatDate(item.date)}</Text>
                        </View>
                        {item.issuer && (
                            <Text style={{ fontFamily: getFont(font?.family), fontSize: companySize, color: tmpl.text }}>{item.issuer}</Text>
                        )}
                    </View>
                </React.Fragment>
            ))}
        </Section>
    );
};

const References = ({ data, tmpl, font }) => {
    const roleSize = font?.roleSize || 11;
    const companySize = font?.companySize || 10;
    const descSize = font?.descSize || font?.size || 10;

    return (
        <Section title="References" tmpl={tmpl} font={font}>
            {data.map((item, i) => (
                <React.Fragment key={i}>
                    <View style={{ marginBottom: 10 }}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontFamily: getFont(font?.family, true), color: tmpl.text, fontSize: roleSize }}>{item.name}</Text>
                            {item.website && (
                                <Link src={normUrl(item.website)} style={{ color: tmpl.accent, fontSize: companySize, textDecoration: font?.linkUnderline && normUrl(item.website).startsWith('http') ? 'underline' : 'none' }}>Website</Link>
                            )}
                        </View>
                        {(item.role || item.company) && (
                            <Text style={{ fontFamily: getFont(font?.family), fontSize: companySize, color: tmpl.text }}>
                                {item.role}{item.role && item.company ? ' at ' : ''}{item.company}
                            </Text>
                        )}
                        {item.contacts && (
                            <Text style={{ fontFamily: getFont(font?.family), fontSize: descSize, color: tmpl.light }}>
                                {String(item.contacts).split('\n').filter(c => c.trim()).join(' | ')}
                            </Text>
                        )}
                    </View>
                </React.Fragment>
            ))}
        </Section>
    );
};

const Languages = ({ data, tmpl, font }) => {
    const roleSize = font?.roleSize || 12;
    const descSize = font?.descSize || font?.size || 10;

    return (
        <Section title="Languages" tmpl={tmpl} font={font}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                {data.map((item, i) => (
                    <View key={i}>
                        <Text style={{ fontSize: roleSize, fontFamily: getFont(font?.family), color: tmpl.text }}>
                            {item.language}
                        </Text>
                        <Text style={{ fontSize: descSize, color: tmpl.light, fontFamily: getFont(font?.family) }}>
                            {item.proficiency}
                        </Text>
                    </View>
                ))}
            </View>
        </Section>
    );
};

const Summary = ({ data, tmpl, font }) => {
    if (!data?.summary) return null;
    const descSize = font?.descSize || font?.size || 10;
    const lines = String(data.summary).split('\n').map(l => l.trim()).filter(Boolean);

    return (
        <Section title="Summary" tmpl={tmpl} font={font}>
            {lines.map((line, i) => (
                <Text key={i} style={{ fontSize: descSize, fontFamily: getFont(font?.family), color: tmpl.text, marginTop: i ? 2 : 0, textDecoration: font?.linkUnderline ? 'underline' : 'none' }}>
                    {line}
                </Text>
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
    certificates: Certificates,
    languages: Languages,
    references: References,
};

const renderOrderedSections = (sections, order, tmpl, font, hiddenSections = []) => {
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
        return <Component key={key} data={sectionData} tmpl={tmpl} font={font} />;
    });
};

const PhotoHeaderLayout = ({ data, size = 'A4', padding = 30, hiddenSections = [] }) => {
    const {
        contact,
        tagline,
        summary,
        education,
        experience,
        projects,
        skills,
        certificates,
        languages,
        references,
        sectionOrder,
        template,
        layout,
        font,
    } = data || {};

    const tmpl = getTemplate(template);
    const layoutConfig = getLayout(layout || DEFAULT_LAYOUT);
    const sections = { summary, education, experience, projects, skills, certificates, languages, references };

    return (
        <Document language="en">
            <Page size={size} style={{ backgroundColor: tmpl.bg, fontFamily: getFont(font?.family) }}>
                <View style={{ padding }}>
                    <Header data={{ ...contact, name: contact?.name, title: tagline?.tagline, photo: data.photo }} tmpl={tmpl} font={font} layout={layoutConfig} />
                    <View style={{ marginTop: font?.imageBottomGap || 8 }}>
                        {renderOrderedSections(sections, sectionOrder, tmpl, font, hiddenSections)}
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default PhotoHeaderLayout;