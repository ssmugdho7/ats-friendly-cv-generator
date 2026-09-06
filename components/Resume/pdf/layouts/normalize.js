import { TEMPLATES, DEFAULT_TEMPLATE } from '@/config/templates';
import { DEFAULT_SECTION_ORDER } from '@/config/ResumeFields';

export const getTemplate = key => TEMPLATES[key] || TEMPLATES[DEFAULT_TEMPLATE];

/**
 * Theme layer: derives every layout-specific variable from the shared
 * color theme so ALL layouts support ALL themes (no layout is locked to
 * one color). Think of this as the CSS-variables layer for PDF output.
 */
export const getLayoutTheme = templateKey => {
    const tmpl = getTemplate(templateKey);
    return {
        ...tmpl,
        // Sidebar surfaces (all 8 theme accents are dark, so white text always works)
        sidebarBg: tmpl.accent,
        sidebarText: '#ffffff',
        sidebarMuted: '#d7dce3',
        sidebarRule: 'rgba(255,255,255,0.35)',
        // Photo-header band
        bandBg: tmpl.accent,
        bandText: '#ffffff',
        bandMuted: '#e4e8ee',
        // Stat boxes
        statBorder: tmpl.accent,
        statValue: tmpl.accent,
        statBg: '#ffffff',
        // Timeline
        timelineDot: tmpl.accent,
        timelineLine: tmpl.border,
        // Compact sidebar tint
        tintBg: '#f1f3f6',
    };
};

/**
 * Normalize the Redux resume slice into the ONE shared schema every layout
 * reads from. Layouts must never reach into raw slice shape directly.
 *
 * Shared schema:
 *   name, title, contact{}, summary,
 *   experience[], education[], skills[], languages[],
 *   projects[], certifications[], achievements[], references[], sectionOrder
 */
export const normalizeResume = (data = {}) => {
    const contact = data.contact || {};
    const skillsRaw = data.skills;
    const skillGroups = Array.isArray(skillsRaw)
        ? skillsRaw.filter(g => g && (g.title || g.skills))
        : skillsRaw && skillsRaw.skills
          ? [{ title: 'Skills', skills: skillsRaw.skills }]
          : [];

    const flatSkills = skillGroups
        .flatMap(g => String(g.skills || '').split(','))
        .map(s => s.trim())
        .filter(Boolean);

    return {
        name: contact.name || 'Your Name',
        title: data.tagline?.tagline || '',
        contact: {
            name: contact.name || '',
            email: contact.email || '',
            phone: contact.phone || '',
            address: contact.address || '',
            linkedin: contact.linkedin || '',
            github: contact.github || '',
            portfolio: contact.portfolio || '',
            twitter: contact.twitter || '',
            blogs: contact.blogs || '',
        },
        summary: data.summary?.summary || '',
        experience: Array.isArray(data.experience) ? data.experience : [],
        education: Array.isArray(data.education) ? data.education : [],
        skills: skillGroups,
        flatSkills,
        languages: Array.isArray(data.languages) ? data.languages : [],
        projects: Array.isArray(data.projects) ? data.projects : [],
        certifications: Array.isArray(data.certificates) ? data.certificates : [],
        achievements: Array.isArray(data.achievements) ? data.achievements : [],
        references: Array.isArray(data.references) ? data.references : [],
        sectionOrder:
            Array.isArray(data.sectionOrder) && data.sectionOrder.length
                ? data.sectionOrder
                : [...DEFAULT_SECTION_ORDER],
        font: data.font || {},
    };
};

/** Contact entries as labeled rows — every value keeps its text label (ATS). */
export const contactRows = contact => {
    const rows = [];
    if (contact.phone) rows.push({ label: 'Phone', value: contact.phone, href: `tel:${contact.phone}` });
    if (contact.email) rows.push({ label: 'Email', value: contact.email, href: `mailto:${contact.email}` });
    if (contact.address) rows.push({ label: 'Location', value: contact.address });
    if (contact.linkedin) rows.push({ label: 'LinkedIn', value: 'LinkedIn', href: contact.linkedin });
    if (contact.github) rows.push({ label: 'GitHub', value: 'GitHub', href: contact.github });
    if (contact.portfolio) rows.push({ label: 'Portfolio', value: 'Portfolio', href: contact.portfolio });
    if (contact.twitter) rows.push({ label: 'Twitter', value: 'Twitter', href: contact.twitter });
    if (contact.blogs) rows.push({ label: 'Blog', value: 'Blog', href: contact.blogs });
    return rows;
};

export const initialsOf = name =>
    String(name || '')
        .trim()
        .split(/\s+/)
        .map(w => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || '•';
