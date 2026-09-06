/**
 * Placeholder / token resolution for CV content.
 *
 * Supports replacing tokens like {{full_name}}, {{experience_1_description}},
 * {{project_1_name}}, etc. within text strings. Tokens are resolved from a
 * flat data object so the same resolver works for PDF, DOCX, and any future
 * export format.
 *
 * Rules:
 *  - Unknown tokens are replaced with empty string (never leaked as raw {{...}}).
 *  - Array-backed fields use 1-based indexing: {{experience_1_role}},
 *    {{experience_2_role}}, etc.
 *  - Nested object access uses dot notation: {{contact.email}}.
 *  - The same resolver is shared across all layouts and export pipelines so
 *    base and tailored CVs always use identical structure/formatting.
 */

const TOKEN_RE = /\{\{([^}]+)\}\}/g;

function getValue(data, path) {
    if (!path || typeof data !== 'object' || data === null) return undefined;
    const segments = String(path).split('.');
    let current = data;
    for (const seg of segments) {
        if (current === null || current === undefined) return undefined;
        current = current[seg];
    }
    return current;
}

export function resolvePlaceholders(text, data = {}) {
    if (typeof text !== 'string') return text;
    return text.replace(TOKEN_RE, (_, rawPath) => {
        const path = rawPath.trim();
        const value = getValue(data, path);
        if (value === undefined || value === null) return '';
        return String(value);
    });
}

export function resolveRichPlaceholders(text, data = {}) {
    if (typeof text !== 'string') return text;
    return text.replace(TOKEN_RE, (_, rawPath) => {
        const path = rawPath.trim();
        const value = getValue(data, path);
        if (value === undefined || value === null) return '';
        return String(value);
    });
}

/**
 * Flatten a normalized resume object into a lookup table that includes
 * 1-based indexed array entries for easy token resolution.
 *
 * Example output keys:
 *   full_name, job_title, contact.email, experience_1_role,
 *   experience_1_description, project_1_name, project_1_live_url, ...
 */
export function buildTokenMap(data = {}) {
    const map = {
        full_name: data.name || '',
        job_title: data.title || '',
        location: data.contact?.address || data.contact?.location || '',
        email: data.contact?.email || '',
        phone: data.contact?.phone || '',
        portfolio_url: data.contact?.portfolio || '',
        github_url: data.contact?.github || '',
        linkedin_url: data.contact?.linkedin || '',
        professional_summary: data.summary?.summary || '',
        languages: Array.isArray(data.languages)
            ? data.languages.map(l => `${l.language} (${l.proficiency || ''})`).join(', ')
            : '',
        extracurricular_activities: '',
    };

    if (Array.isArray(data.experience)) {
        data.experience.forEach((exp, i) => {
            const idx = i + 1;
            map[`experience_${idx}_company`] = exp.company || '';
            map[`experience_${idx}_position`] = exp.role || '';
            map[`experience_${idx}_start_date`] = exp.start || '';
            map[`experience_${idx}_end_date`] = exp.end || '';
            map[`experience_${idx}_description`] = exp.description || '';
            map[`experience_${idx}_location`] = exp.location || '';
        });
    }

    if (Array.isArray(data.projects)) {
        data.projects.forEach((proj, i) => {
            const idx = i + 1;
            map[`project_${idx}_name`] = proj.title || '';
            map[`project_${idx}_description`] = proj.description || '';
            map[`project_${idx}_live_url`] = proj.live || '';
            map[`project_${idx}_repo_url`] = proj.github || '';
            map[`project_${idx}_technologies`] = proj.technologies || '';
        });
    }

    if (Array.isArray(data.education)) {
        data.education.forEach((edu, i) => {
            const idx = i + 1;
            map[`education_${idx}_degree`] = edu.degree || '';
            map[`education_${idx}_institution`] = edu.institution || '';
            map[`education_${idx}_year`] = [edu.start, edu.end].filter(Boolean).join(' - ') || '';
            map[`education_${idx}_result`] = edu.gpa || '';
            map[`education_${idx}_location`] = edu.location || '';
        });
    }

    if (Array.isArray(data.certifications)) {
        data.certifications.forEach((cert, i) => {
            const idx = i + 1;
            map[`certification_${idx}_name`] = cert.title || '';
            map[`certification_${idx}_url`] = cert.url || '';
            map[`certification_${idx}_issuer`] = cert.issuer || '';
        });
    }

    if (Array.isArray(data.references)) {
        data.references.forEach((ref, i) => {
            const idx = i + 1;
            map[`reference_${idx}_name`] = ref.name || '';
            map[`reference_${idx}_position`] = ref.role || '';
            map[`reference_${idx}_company`] = ref.company || '';
            map[`reference_${idx}_phone`] = ref.contacts?.split('\n')[0] || '';
            map[`reference_${idx}_email`] = ref.contacts?.split('\n')[1] || '';
            map[`reference_${idx}_website`] = ref.website || '';
        });
    }

    // Skills grouped
    if (Array.isArray(data.skills)) {
        const groups = {};
        data.skills.forEach(group => {
            const key = (group.title || 'skills').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
            groups[key] = group.skills || '';
        });
        Object.assign(map, groups);
    }

    // Flat skills fallback
    if (Array.isArray(data.flatSkills) && data.flatSkills.length) {
        map.frontend_skills = groups.frontend || '';
        map.backend_skills = groups.backend || '';
        map.database_skills = groups.database || '';
        map.ai_ml_skills = groups['ai_ml'] || groups['ai-ml'] || '';
        map.tools_skills = groups.tools || '';
    }

    return map;
}
